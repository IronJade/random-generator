'use strict';

const { Plugin, Modal, Setting, Notice, PluginSettingTab } = require('obsidian');

// Default settings with pre-configured generators
const DEFAULT_SETTINGS = {
    generators: [
        {
            name: "Tavern Generator",
            description: "Generates random tavern names and features",
            format: "{Beginning Name} {Ending Name}, known for {Known For}.",
            fields: {
                "Beginning Name": [
                    "The Rusty", "The Golden", "The Drunken", "The Silver", 
                    "The Laughing", "The Prancing", "The Dancing", "The Sleeping", 
                    "The Leaping", "The Broken", "The Wicked", "The Wayward",
                    "The Smiling", "The Crafty", "The Salty", "The Shining",
                    "The Howling", "The Wandering", "The Crimson", "The Gilded"
                ],
                "Ending Name": [
                    "Anchor", "Dragon", "Goblin", "Flagon", 
                    "Barrel", "Tankard", "Horse", "Pony", 
                    "Hound", "Knight", "Witch", "Sailor",
                    "Axe", "Sword", "Shield", "Crown",
                    "Piper", "Minstrel", "Cloak", "Lantern"
                ],
                "Known For": [
                    "its strong ale", "its mysterious patrons", "its rowdy brawls", "its magical drinks",
                    "its delicious stew", "its haunted cellar", "its beautiful barmaid", "its grumpy innkeeper",
                    "its secret meetings", "its exotic food", "its gambling tables", "its bardic competitions",
                    "its ancient history", "its unusual architecture", "its rare wines", "its monster trophies",
                    "its hidden treasure", "its enchanted fireplace", "its famous guests", "its storytelling nights"
                ]
            }
        },
        {
            name: "Fantasy Character Generator",
            description: "Generates random fantasy characters",
            format: "A {Personality} {Race} {Class} who was once a {Background}.",
            fields: {
                "Race": [
                    "Human", "Elf", "Dwarf", "Halfling", "Gnome",
                    "Half-Elf", "Half-Orc", "Tiefling", "Dragonborn", "Orc",
                    "Goblin", "Hobgoblin", "Lizardfolk", "Kenku", "Tabaxi",
                    "Firbolg", "Tortle", "Genasi", "Aasimar", "Changeling"
                ],
                "Class": [
                    "Fighter", "Wizard", "Cleric", "Rogue", "Bard",
                    "Barbarian", "Druid", "Monk", "Paladin", "Ranger",
                    "Sorcerer", "Warlock", "Artificer", "Blood Hunter", "Alchemist",
                    "Necromancer", "Knight", "Archer", "Summoner", "Assassin"
                ],
                "Background": [
                    "Noble", "Outlander", "Soldier", "Criminal", "Sage",
                    "Acolyte", "Entertainer", "Guild Artisan", "Hermit", "Sailor",
                    "Urchin", "Charlatan", "Folk Hero", "Merchant", "Knight",
                    "Pirate", "Gladiator", "Spy", "Scholar", "Explorer"
                ],
                "Personality": [
                    "Brave and reckless", "Cautious and methodical", "Arrogant and prideful", "Kind and generous",
                    "Sarcastic and witty", "Silent and brooding", "Cheerful and optimistic", "Cynical and pessimistic",
                    "Curious and inquisitive", "Loyal and honorable", "Greedy and selfish", "Wise and patient",
                    "Impulsive and emotional", "Calculating and cunning", "Eccentric and unpredictable", "Shy and reserved",
                    "Aggressive and confrontational", "Playful and mischievous", "Formal and proper", "Mysterious and secretive"
                ]
            }
        },
        {
            name: "Quest Generator",
            description: "Generates random quest hooks",
            format: "{Quest Giver} needs you to {Task} {Location}, {Complication}.",
            fields: {
                "Quest Giver": [
                    "A noble lord", "A shady merchant", "A desperate farmer", "A mysterious wizard",
                    "The town guard", "A crying child", "An elderly scholar", "A talking animal",
                    "A ghostly apparition", "A royal messenger", "A wounded soldier", "A traveling bard",
                    "A fortune teller", "A masked stranger", "A foreign diplomat", "A frightened innkeeper",
                    "A captured fairy", "A powerful oracle", "A village elder", "A drunken sailor"
                ],
                "Task": [
                    "retrieve a stolen artifact", "rescue a kidnapped person", "slay a dangerous monster", "investigate strange occurrences",
                    "deliver a secret message", "break a terrible curse", "find a lost treasure", "escort a valuable shipment",
                    "clear out a monster infestation", "negotiate a peace treaty", "sabotage an enemy operation", "win a competition",
                    "gather rare ingredients", "map an unexplored region", "solve an ancient puzzle", "stop a dark ritual",
                    "infiltrate a guarded location", "track down a fugitive", "protect a witness", "survive a deadly trial"
                ],
                "Location": [
                    "in a forgotten dungeon", "in a corrupt city", "in a haunted forest", "in the monster-infested wilderness",
                    "on a remote island", "in a foreign kingdom", "in the dangerous mountains", "in the scorching desert",
                    "in the frozen tundra", "in an ancient ruin", "in a wealthy estate", "in the lawless borderlands",
                    "in a magical academy", "in a sacred temple", "in the treacherous swamps", "in an underground network",
                    "in a floating fortress", "in a parallel dimension", "in a besieged settlement", "in a cursed valley"
                ],
                "Complication": [
                    "but it's all a trap", "but a rival group is also involved", "but the quest giver isn't telling the whole truth", "but there's a strict time limit",
                    "but supernatural forces are interfering", "but the weather is becoming dangerous", "but a traitor is working against you", "but the situation is morally complex",
                    "but the locals are hostile", "but the target is heavily guarded", "but the environment is hazardous", "but a curse is affecting the area",
                    "but magical anomalies distort reality there", "but a powerful enemy is watching", "but resources in the area are scarce", "but a disease is spreading",
                    "but political tensions complicate matters", "but the quest has unexpected cultural significance", "but an ancient prophecy is involved", "but nothing is as it first appears"
                ]
            }
        }
    ],
    customCSSEnabled: false,
    customCSSPath: ''
};

class RandomGeneratorPlugin extends Plugin {
    async onload() {
        // Load settings first
        await this.loadSettings();

        // Add a ribbon icon for the generator
        this.addRibbonIcon('dice', 'Random Generator', () => {
            new GeneratorModal(this.app, this).open();
        });

        // Add a command to open the generator
        this.addCommand({
            id: 'open-random-generator',
            name: 'Open Random Generator',
            callback: () => {
                new GeneratorModal(this.app, this).open();
            }
        });

        // Add a command to insert a random generation at cursor position
        this.addCommand({
            id: 'insert-random-generation',
            name: 'Insert Random Generation',
            editorCallback: (editor) => {
                if (!this.settings.generators || this.settings.generators.length === 0) {
                    new Notice('No generators available');
                    return;
                }

                // Use the first generator by default
                const generator = this.settings.generators[0];
                const result = this.generateFromTemplate(generator);
                editor.replaceSelection(result);
            }
        });

        // Add settings tab
        this.addSettingTab(new RandomGeneratorSettingTab(this.app, this));

        // Add CSS - defer to avoid blocking plugin load
        setTimeout(() => {
            this.loadCSS();
        }, 0);
    }

    onunload() {
        // Clean up when the plugin is disabled
        const styleElement = document.getElementById('random-generator-styles');
        if (styleElement) {
            styleElement.remove();
        }
    }

    async loadSettings() {
        try {
            const data = await this.loadData();
            this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
            
            // Ensure generators is an array
            if (!Array.isArray(this.settings.generators)) {
                this.settings.generators = DEFAULT_SETTINGS.generators;
            }
            
            // Initialize custom CSS settings if they don't exist
            if (this.settings.customCSSEnabled === undefined) {
                this.settings.customCSSEnabled = false;
                this.settings.customCSSPath = '';
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.settings = Object.assign({}, DEFAULT_SETTINGS);
        }
    }

    async saveSettings() {
        try {
            await this.saveData(this.settings);
        } catch (error) {
            console.error('Failed to save settings:', error);
            new Notice('Failed to save settings');
        }
    }
    // Load CSS - either default or custom
    loadCSS() {
        try {
            // Remove any previously loaded stylesheets
            const oldStyleElement = document.getElementById('random-generator-styles');
            if (oldStyleElement) {
                oldStyleElement.remove();
            }
            
            const styleElement = document.createElement('style');
            styleElement.id = 'random-generator-styles';
            
            if (this.settings.customCSSEnabled && this.settings.customCSSPath) {
                // Try to load custom CSS
                try {
                    const adapter = this.app.vault.adapter;
                    adapter.read(this.settings.customCSSPath)
                        .then(css => {
                            styleElement.textContent = css;
                            document.head.appendChild(styleElement);
                        })
                        .catch(error => {
                            console.error('Failed to load custom CSS:', error);
                            // Fall back to default CSS
                            this.loadDefaultCSS(styleElement);
                        });
                } catch (error) {
                    console.error('Error trying to load custom CSS:', error);
                    this.loadDefaultCSS(styleElement);
                }
            } else {
                // Load default CSS
                this.loadDefaultCSS(styleElement);
            }
        } catch (error) {
            console.error('Error in loadCSS:', error);
        }
    }
    
    // Load the default CSS
    loadDefaultCSS(styleElement) {
        try {
            // Default CSS code
            styleElement.textContent = `
/* Random Generator Plugin - Default Style */
.random-generator-modal {
    padding: 1.5rem;
    max-width: 600px;
    margin: 0 auto;
}

.random-generator-modal h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--background-modifier-border);
    color: var(--text-normal);
    font-size: 1.5rem;
    font-weight: 600;
}

.random-generator-modal h3 {
    margin-top: 1rem;
    margin-bottom: 0.75rem;
    color: var(--text-normal);
    font-size: 1.2rem;
    font-weight: 500;
}

.generator-select-container {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
}

.generator-select-container span {
    font-weight: 500;
    margin-right: 0.75rem;
    color: var(--text-normal);
}

.generator-select {
    flex-grow: 1;
    background-color: var(--background-secondary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s ease;
    width: 100%; /* Ensure full width */
    height: auto; /* Allow height to adjust to content */
    min-height: 2.5rem; /* Minimum height to prevent cut-off */
    text-overflow: ellipsis; /* Show ellipsis for overflow text */
}

.generator-select:hover {
    border-color: var(--interactive-accent);
}

.generator-select:focus {
    border-color: var(--interactive-accent);
    box-shadow: 0 0 0 2px rgba(var(--interactive-accent-rgb), 0.2);
}

.generator-result-container {
    margin-bottom: 1.5rem;
}

.generator-result {
    background-color: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    padding: 1rem;
    min-height: 20rem; /* 5x taller than before (~4rem) */
    color: var(--text-normal);
    line-height: 1.5;
    font-size: 0.95rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: background-color 0.2s ease;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
}

.generator-result:hover {
    background-color: var(--background-secondary-alt);
}

.generator-button-container {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

.generator-button-container button {
    background-color: var(--interactive-normal);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.generator-button-container button:hover {
    background-color: var(--interactive-hover);
}

.generator-button-container button:first-child {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
    border-color: var(--interactive-accent);
}

.generator-button-container button:first-child:hover {
    filter: brightness(1.1);
}

@keyframes highlight-result {
    0% {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
    }
    100% {
        background-color: var(--background-secondary);
        color: var(--text-normal);
    }
}

.highlight-new-result {
    animation: highlight-result 1s ease;
}

/* Settings styles */
.field-settings {
    margin-left: 20px;
    margin-bottom: 10px;
    padding-left: 10px;
    border-left: 2px solid var(--background-modifier-border);
}

.field-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 4px;
}

.field-actions button {
    font-size: 0.8rem;
    padding: 2px 8px;
}

.generator-settings {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--background-modifier-border);
}
    
/* Improved Field Settings Styles */
.generator-settings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--background-modifier-border);
}

.field-settings {
    display: grid;
    grid-template-columns: auto 1fr 200px;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.5rem;
}

.field-settings label {
    color: var(--text-muted);
    text-align: right;
    white-space: nowrap;
}

.field-settings textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.5rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-secondary);
    color: var(--text-normal);
    resize: vertical;
    font-family: inherit;
}

.field-settings textarea:focus {
    outline: 2px solid var(--interactive-accent);
    border-color: var(--interactive-accent);
}

.field-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.field-actions button {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.field-actions .rename-field-button {
    background-color: var(--background-secondary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
}

.field-actions .delete-field-button {
    background-color: var(--text-accent);
    color: white;
    border: none;
}

.field-actions button:hover {
    filter: brightness(1.1);
}

.generator-settings .setting-name {
    font-weight: 600;
    color: var(--text-normal);
}

.generator-settings .setting-description {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

/* Styling for generator-level settings */
.generator-settings-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

.generator-settings-header label {
    color: var(--text-muted);
    text-align: right;
    white-space: nowrap;
}

.generator-settings-header input,
.generator-settings-header textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-secondary);
    color: var(--text-normal);
}

.generator-settings-header input:focus,
.generator-settings-header textarea:focus {
    outline: 2px solid var(--interactive-accent);
    border-color: var(--interactive-accent);
}

/* Buttons at the bottom of generator settings */
.generator-bottom-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
}

.generator-bottom-actions button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.generator-duplicate-btn {
    background-color: var(--background-secondary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
}

.generator-remove-btn {
    background-color: var(--text-accent);
    color: white;
    border: none;
}

.generator-bottom-actions button:hover {
    filter: brightness(1.1);
}

/* Styles for Add Generator Modal */
.add-generator-modal {
    max-width: 500px;
    width: 100%;
}

.add-generator-modal .modal-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.add-generator-modal .setting-row {
    display: grid;
    grid-template-columns: 150px 1fr;
    align-items: center;
    gap: 1rem;
}

.add-generator-modal .setting-row label {
    text-align: right;
    color: var(--text-muted);
}

.add-generator-modal .setting-control {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-secondary);
    color: var(--text-normal);
}

.add-generator-modal .setting-control:focus {
    outline: 2px solid var(--interactive-accent);
    border-color: var(--interactive-accent);
}

.add-generator-modal .fields-section {
    border-top: 1px solid var(--background-modifier-border);
    padding-top: 1rem;
    margin-top: 1rem;
}

.add-generator-modal .field-row {
    display: grid;
    grid-template-columns: 150px 1fr 100px;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.5rem;
}

.add-generator-modal .field-row input,
.add-generator-modal .field-row textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    background-color: var(--background-secondary);
    color: var(--text-normal);
}

.add-generator-modal .field-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
}

.add-generator-modal .add-field-btn {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.add-generator-modal .add-field-btn:hover {
    filter: brightness(1.1);
}

.add-generator-modal .remove-field-btn {
    background-color: var(--text-accent);
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.add-generator-modal .remove-field-btn:hover {
    filter: brightness(1.1);
}

.add-generator-modal .modal-button-container {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
}

.add-generator-modal .modal-button-container button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.add-generator-modal .create-btn {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
    border: none;
}

.add-generator-modal .cancel-btn {
    background-color: var(--background-secondary);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
}

.add-generator-modal .create-btn:hover,
.add-generator-modal .cancel-btn:hover {
    filter: brightness(1.1);
}`;
            document.head.appendChild(styleElement);
        } catch (error) {
            console.error('Error in loadDefaultCSS:', error);
        }
    }

    generateFromTemplate(generator) {
        if (!generator || !generator.fields || !generator.format) {
            return "Error: Invalid generator format";
        }
        
        try {
            // Select random items from each field
            const selections = {};
            
            for (const [fieldName, items] of Object.entries(generator.fields)) {
                if (Array.isArray(items) && items.length > 0) {
                    const randomIndex = Math.floor(Math.random() * items.length);
                    selections[fieldName] = items[randomIndex];
                } else {
                    selections[fieldName] = '[Empty]';
                }
            }
            
            // Format the result using the format string
            let result = generator.format;
            for (const [fieldName, value] of Object.entries(selections)) {
                result = result.replace(`{${fieldName}}`, value);
            }
            
            return result;
        } catch (error) {
            console.error('Error generating from template:', error);
            return "Error generating content";
        }
    }
}

class GeneratorModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.selectedGenerator = "";
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('random-generator-modal');

        try {
            // Create header
            contentEl.createEl('h2', { text: 'Random Generator' });

            // Create generator selection dropdown
            const selectContainer = contentEl.createDiv({ cls: 'generator-select-container' });
            selectContainer.createEl('span', { text: 'Select Generator: ' });
            const selectEl = selectContainer.createEl('select', { cls: 'generator-select' });
            
            // Make sure we have generators before trying to populate dropdown
            if (this.plugin.settings.generators && this.plugin.settings.generators.length > 0) {
                this.plugin.settings.generators.forEach(generator => {
                    selectEl.createEl('option', { value: generator.name, text: generator.name });
                });
                
                // Set initial selection
                this.selectedGenerator = this.plugin.settings.generators[0].name;
            } else {
                selectEl.createEl('option', { value: "", text: "No generators available" });
                this.selectedGenerator = "";
            }

            selectEl.addEventListener('change', (e) => {
                this.selectedGenerator = e.target.value;
            });

            // Create result container
            const resultContainer = contentEl.createDiv({ cls: 'generator-result-container' });
            resultContainer.createEl('h3', { text: 'Generated Result:' });
            this.resultEl = resultContainer.createDiv({ cls: 'generator-result' });

            // Create button container
            const buttonContainer = contentEl.createDiv({ cls: 'generator-button-container' });
            
            // Generate button
            const generateButton = buttonContainer.createEl('button', { text: 'Generate' });
            generateButton.addEventListener('click', () => {
                this.generateResult();
            });
            
            // Insert button
            const insertButton = buttonContainer.createEl('button', { text: 'Insert' });
            insertButton.addEventListener('click', () => {
                this.insertResult();
            });

            // Generate an initial result if we have generators
            if (this.selectedGenerator) {
                this.generateResult();
            }
        } catch (error) {
            console.error('Error in modal onOpen:', error);
            contentEl.createEl('p', { text: 'An error occurred. Please check the console for details.' });
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    generateResult() {
        try {
            if (this.selectedGenerator && this.plugin.settings.generators) {
                const generator = this.plugin.settings.generators.find(g => g.name === this.selectedGenerator);
                if (generator) {
                    const result = this.plugin.generateFromTemplate(generator);
                    this.resultEl.setText(result);
                    
                    // Add animation class
                    this.resultEl.addClass('highlight-new-result');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        this.resultEl.removeClass('highlight-new-result');
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error generating result:', error);
            this.resultEl.setText('Error generating content');
        }
    }

    insertResult() {
        try {
            // Get the active editor and insert the text at cursor position
            const activeLeaf = this.app.workspace.activeLeaf;
            if (activeLeaf && activeLeaf.view && this.resultEl.textContent) {
                const editor = activeLeaf.view.editor;
                if (editor) {
                    editor.replaceSelection(this.resultEl.textContent);
                    this.close();
                }
            }
        } catch (error) {
            console.error('Error inserting result:', error);
            new Notice('Error inserting result');
        }
    }
}

class RandomGeneratorSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        try {
            containerEl.empty();

            containerEl.createEl('h2', { text: 'Random Generator Settings' });
            
            // Appearance section
            containerEl.createEl('h3', { text: 'Appearance' });
            
            // Custom CSS toggle
            new Setting(containerEl)
                .setName('Use Custom CSS')
                .setDesc('Enable using a custom CSS file for styling the generator')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.customCSSEnabled)
                    .onChange(async (value) => {
                        this.plugin.settings.customCSSEnabled = value;
                        await this.plugin.saveSettings();
                        this.plugin.loadCSS();
                    }));
                    
            // Custom CSS file path
            new Setting(containerEl)
                .setName('Custom CSS Path')
                .setDesc('Path to your custom CSS file in the vault (relative to vault root)')
                .addText(text => text
                    .setPlaceholder('path/to/custom-style.css')
                    .setValue(this.plugin.settings.customCSSPath)
                    .onChange(async (value) => {
                        this.plugin.settings.customCSSPath = value;
                        await this.plugin.saveSettings();
                        if (this.plugin.settings.customCSSEnabled) {
                            this.plugin.loadCSS();
                        }
                    }));
            
            // Generators section
            containerEl.createEl('h3', { text: 'Generators' });

// Create a section for each generator
if (this.plugin.settings.generators && Array.isArray(this.plugin.settings.generators)) {
    this.plugin.settings.generators.forEach((generator, index) => {
        const generatorEl = containerEl.createEl('div', { cls: 'generator-settings' });
        
        // Generator Name and Description
        const nameRow = generatorEl.createDiv({ cls: 'generator-settings-header' });
        nameRow.createEl('label', { text: 'Generator Name:' });
        const nameInput = nameRow.createEl('input', { 
            type: 'text', 
            value: generator.name || '' 
        });
        nameInput.addEventListener('change', async (e) => {
            this.plugin.settings.generators[index].name = e.target.value;
            await this.plugin.saveSettings();
        });
        
        const descRow = generatorEl.createDiv({ cls: 'generator-settings-header' });
        descRow.createEl('label', { text: 'Description:' });
        const descInput = descRow.createEl('textarea', { 
            value: generator.description || '' 
        });
        descInput.addEventListener('change', async (e) => {
            this.plugin.settings.generators[index].description = e.target.value;
            await this.plugin.saveSettings();
        });
        
        // Format Template
        const formatRow = generatorEl.createDiv({ cls: 'generator-settings-header' });
        formatRow.createEl('label', { text: 'Format Template:' });
        const formatInput = formatRow.createEl('input', { 
            type: 'text', 
            value: generator.format || '' 
        });
        formatInput.addEventListener('change', async (e) => {
            this.plugin.settings.generators[index].format = e.target.value;
            await this.plugin.saveSettings();
        });
        
        // Fields section
        generatorEl.createEl('h4', { text: 'Fields', cls: 'setting-name' });
        
        // Display each field
        if (generator.fields) {
            Object.entries(generator.fields).forEach(([fieldName, items]) => {
                const fieldEl = generatorEl.createEl('div', { cls: 'field-settings' });
                
                fieldEl.createEl('label', { text: `Field: ${fieldName}` });
                
                const fieldValuesInput = fieldEl.createEl('textarea', { 
                    text: Array.isArray(items) ? items.join('\n') : '' 
                });
                fieldValuesInput.addEventListener('change', async (e) => {
                    // Split by new lines and filter empty entries
                    const newItems = e.target.value.split('\n').filter(item => item.trim() !== '');
                    this.plugin.settings.generators[index].fields[fieldName] = newItems;
                    await this.plugin.saveSettings();
                });
                
                // Field actions container
                const fieldActions = fieldEl.createEl('div', { cls: 'field-actions' });
                
                // Rename button
                const renameBtn = fieldActions.createEl('button', { 
                    text: 'Rename', 
                    cls: 'rename-field-button' 
                });
                renameBtn.addEventListener('click', async () => {
                    const newName = prompt('Enter new name for field:', fieldName);
                    if (newName && newName.trim() !== '' && newName !== fieldName) {
                        // Check if the new name already exists
                        if (generator.fields[newName]) {
                            new Notice(`Field "${newName}" already exists`);
                            return;
                        }
                        
                        // Create new field with same items
                        const fieldItems = generator.fields[fieldName];
                        generator.fields[newName] = fieldItems;
                        
                        // Update format string to use new field name
                        generator.format = generator.format.replace(
                            new RegExp(`{${fieldName}}`, 'g'), 
                            `{${newName}}`
                        );
                        
                        // Delete old field
                        delete generator.fields[fieldName];
                        
                        await this.plugin.saveSettings();
                        this.display(); // Refresh to show changes
                    }
                });
                
                // Delete button
                const deleteBtn = fieldActions.createEl('button', { 
                    text: 'Delete', 
                    cls: 'delete-field-button' 
                });
                deleteBtn.addEventListener('click', async () => {
                    if (confirm(`Delete field "${fieldName}"?`)) {
                        // Remove the field
                        delete generator.fields[fieldName];
                        
                        // Warn about template format
                        new Notice(`Field removed. Don't forget to update the format if it uses {${fieldName}}.`);
                        
                        await this.plugin.saveSettings();
                        this.display(); // Refresh to show changes
                    }
                });
            });
        }
        
        // Add Field button
        const addFieldBtn = generatorEl.createEl('button', { 
            text: 'Add Field', 
            cls: 'mod-cta' 
        });
        addFieldBtn.addEventListener('click', async () => {
            const fieldName = prompt('Enter name for the new field:');
            if (fieldName && fieldName.trim() !== '') {
                // Ensure fields object exists
                if (!this.plugin.settings.generators[index].fields) {
                    this.plugin.settings.generators[index].fields = {};
                }
                
                // Create the new field if it doesn't exist
                if (!this.plugin.settings.generators[index].fields[fieldName]) {
                    this.plugin.settings.generators[index].fields[fieldName] = ['Item 1', 'Item 2', 'Item 3'];
                    await this.plugin.saveSettings();
                    this.display(); // Refresh the display
                    
                    // Suggest updating the format
                    new Notice(`Field added. Update your format to include {${fieldName}}.`);
                } else {
                    new Notice('A field with that name already exists');
                }
            }
        });
        
        // Bottom action buttons
        const bottomActions = generatorEl.createEl('div', { cls: 'generator-bottom-actions' });
        
        // Duplicate Generator button
        const duplicateBtn = bottomActions.createEl('button', { 
            text: 'Duplicate', 
            cls: 'generator-duplicate-btn' 
        });
        duplicateBtn.addEventListener('click', async () => {
            // Deep copy the generator
            const newGenerator = JSON.parse(JSON.stringify(generator));
            newGenerator.name = `${generator.name} (Copy)`;
            
            this.plugin.settings.generators.push(newGenerator);
            await this.plugin.saveSettings();
            this.display(); // Refresh the display
            
            new Notice(`Duplicated generator "${generator.name}"`);
        });
        
        // Remove Generator button
        const removeBtn = bottomActions.createEl('button', { 
            text: 'Delete', 
            cls: 'generator-remove-btn' 
        });
        removeBtn.addEventListener('click', async () => {
            if (confirm(`Delete generator "${generator.name}"?`)) {
                this.plugin.settings.generators.splice(index, 1);
                await this.plugin.saveSettings();
                this.display(); // Refresh the display
            }
        });
        
        generatorEl.createEl('hr');
    });
}

// Add Generator button (replacement method)
new Setting(containerEl)
    .setName('Add New Generator')
    .setDesc('Create a new generator')
    .addButton(button => button
        .setButtonText('Add Generator')
        .onClick(async () => {
            // Create a modal for detailed generator creation
            const modal = new Modal(this.app);
            modal.setTitle('Add New Generator');
            
            modal.onOpen = () => {
                const { contentEl } = modal;
                contentEl.empty();
                contentEl.addClass('add-generator-modal');
                
                const modalContent = contentEl.createDiv({ cls: 'modal-content' });
                
                // Name input
                const nameRow = modalContent.createDiv({ cls: 'setting-row' });
                nameRow.createEl('label', { text: 'Generator Name:' });
                const nameInput = nameRow.createEl('input', { 
                    type: 'text', 
                    cls: 'setting-control', 
                    placeholder: 'Enter generator name' 
                });
                
                // Description input
                const descRow = modalContent.createDiv({ cls: 'setting-row' });
                descRow.createEl('label', { text: 'Description:' });
                const descInput = descRow.createEl('textarea', { 
                    cls: 'setting-control', 
                    placeholder: 'Brief description of the generator' 
                });
                
                // Format input
                const formatRow = modalContent.createDiv({ cls: 'setting-row' });
                formatRow.createEl('label', { text: 'Format Template:' });
                const formatInput = formatRow.createEl('input', { 
                    type: 'text', 
                    cls: 'setting-control', 
                    placeholder: 'Template with {Field} placeholders' 
                });
                
                // Initial fields section
                const fieldsSection = modalContent.createDiv({ cls: 'fields-section' });
                fieldsSection.createEl('h3', { text: 'Initial Fields' });
                
                // Dynamic field inputs
                const dynamicFieldsContainer = fieldsSection.createDiv();
                
                // Button to add more fields
                const addFieldBtn = fieldsSection.createEl('button', { 
                    text: 'Add Field', 
                    cls: 'add-field-btn' 
                });
                
                // Track dynamic fields
                const fieldInputs = [];
                
                // Add field button functionality
                addFieldBtn.addEventListener('click', () => {
                    const fieldRow = dynamicFieldsContainer.createDiv({ cls: 'field-row' });
                    
                    const fieldNameInput = fieldRow.createEl('input', { 
                        type: 'text', 
                        placeholder: 'Field Name' 
                    });
                    
                    const fieldValuesInput = fieldRow.createEl('textarea', { 
                        placeholder: 'Enter items (one per line)' 
                    });
                    
                    const removeBtn = fieldRow.createEl('button', { 
                        text: 'Remove', 
                        cls: 'remove-field-btn' 
                    });
                    removeBtn.addEventListener('click', () => {
                        fieldRow.remove();
                        const index = fieldInputs.findIndex(f => f.row === fieldRow);
                        if (index !== -1) {
                            fieldInputs.splice(index, 1);
                        }
                    });
                    
                    fieldInputs.push({ 
                        row: fieldRow, 
                        nameInput: fieldNameInput, 
                        valuesInput: fieldValuesInput 
                    });
                });
                
                // Add an initial field
                addFieldBtn.click();
                
                // Button container for actions
                const buttonContainer = modalContent.createDiv({ cls: 'modal-button-container' });
                
                // Create button
                const createBtn = buttonContainer.createEl('button', { 
                    text: 'Create Generator', 
                    cls: 'create-btn' 
                });
                
                createBtn.addEventListener('click', async () => {
                    // Validate inputs
                    const name = nameInput.value.trim();
                    const description = descInput.value.trim();
                    const format = formatInput.value.trim();
                    
                    if (!name) {
                        new Notice('Generator name is required');
                        return;
                    }
                    
                    // Check for duplicate names
                    if (this.plugin.settings.generators.some(g => g.name === name)) {
                        new Notice('A generator with this name already exists');
                        return;
                    }
                    
                    // Collect fields
                    const fields = {};
                    let hasValidFields = false;
                    
                    fieldInputs.forEach(input => {
                        const fieldName = input.nameInput.value.trim();
                        const fieldValues = input.valuesInput.value.split('\n')
                            .map(v => v.trim())
                            .filter(v => v !== '');
                        
                        if (fieldName && fieldValues.length > 0) {
                            fields[fieldName] = fieldValues;
                            hasValidFields = true;
                        }
                    });
                    
                    if (!hasValidFields) {
                        new Notice('At least one field with items is required');
                        return;
                    }
                    
                    // Create new generator
                    const newGenerator = {
                        name,
                        description,
                        format,
                        fields
                    };
                    
                    // Ensure generators array exists
                    if (!Array.isArray(this.plugin.settings.generators)) {
                        this.plugin.settings.generators = [];
                    }
                    
                    this.plugin.settings.generators.push(newGenerator);
                    await this.plugin.saveSettings();
                    
                    // Close modal and refresh display
                    modal.close();
                    this.display();
                    
                    new Notice(`Created new generator "${name}"`);
                });
                
                // Cancel button
                const cancelBtn = buttonContainer.createEl('button', { 
                    text: 'Cancel', 
                    cls: 'mod-secondary' 
                });
                cancelBtn.addEventListener('click', () => modal.close());
            };
            
            modal.open();
        }));
                    
            // Export/Import Section
            containerEl.createEl('h3', { text: 'Import/Export' });
            
            // Export all generators
            new Setting(containerEl)
                .setName('Export All Generators')
                .setDesc('Export all generators to a JSON file')
                .addButton(button => button
                    .setButtonText('Export')
                    .onClick(async () => {
                        try {
                            // Create a JSON string of all generators
                            const exportData = JSON.stringify(this.plugin.settings.generators, null, 2);
                            
                            // Create filename with date
                            const date = new Date();
                            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            const exportPath = `random-generators-export-${dateStr}.json`;
                            
                            // Write to file
                            const adapter = this.plugin.app.vault.adapter;
                            await adapter.write(exportPath, exportData);
                            
                            new Notice(`Generators exported to ${exportPath}`);
                        } catch (error) {
                            console.error('Failed to export generators:', error);
                            new Notice('Failed to export generators');
                        }
                    }));
                    // Import generators
            new Setting(containerEl)
            .setName('Import Generators')
            .setDesc('Import generators from a JSON file (will append to existing generators)')
            .addText(text => text
                .setPlaceholder('path/to/import-file.json')
                .setValue(''))
            .addButton(button => button
                .setButtonText('Import')
                .onClick(async (evt) => {
                    try {
                        // Find the input element for the file path
                        const settingItem = evt.target.closest('.setting-item');
                        const importPathEl = settingItem.querySelector('input');
                        const importPath = importPathEl.value.trim();
                        
                        if (!importPath) {
                            new Notice('Please enter a file path');
                            return;
                        }
                        
                        // Read the file
                        const adapter = this.plugin.app.vault.adapter;
                        
                        const fileExists = await adapter.exists(importPath);
                        if (!fileExists) {
                            new Notice(`File not found: ${importPath}`);
                            return;
                        }
                        
                        const importData = await adapter.read(importPath);
                        
                        try {
                            const importedGenerators = JSON.parse(importData);
                            
                            if (!Array.isArray(importedGenerators)) {
                                new Notice('Invalid import file: not an array of generators');
                                return;
                            }
                            
                            // Count valid generators
                            let validCount = 0;
                            
                            // Process each generator
                            importedGenerators.forEach(generator => {
                                // Basic validation
                                if (generator.name && generator.format && generator.fields) {
                                    // Ensure no duplicate names by adding a suffix if needed
                                    let baseName = generator.name;
                                    let nameCounter = 1;
                                    let finalName = baseName;
                                    
                                    // Check if name already exists
                                    while (this.plugin.settings.generators.some(g => g.name === finalName)) {
                                        finalName = `${baseName} (${nameCounter})`;
                                        nameCounter++;
                                    }
                                    
                                    // Update name if it was changed
                                    generator.name = finalName;
                                    
                                    // Add to settings
                                    this.plugin.settings.generators.push(generator);
                                    validCount++;
                                }
                            });
                            
                            if (validCount > 0) {
                                await this.plugin.saveSettings();
                                this.display(); // Refresh the display
                                new Notice(`Imported ${validCount} generators`);
                            } else {
                                new Notice('No valid generators found in import file');
                            }
                            
                        } catch (jsonError) {
                            console.error('Failed to parse import file:', jsonError);
                            new Notice('Failed to parse import file: invalid JSON');
                        }
                        
                    } catch (error) {
                        console.error('Import error:', error);
                        new Notice('Failed to import generators');
                    }
                }));
    } catch (error) {
        console.error('Error in settings display:', error);
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Error loading settings' });
        containerEl.createEl('p', { text: 'Check the console for more information.' });
    }
}
}

module.exports = RandomGeneratorPlugin;
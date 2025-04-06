# Random Generator for Obsidian

This Obsidian plugin allows you to generate random content based on fully customizable templates. Perfect for RPGs, writing prompts, worldbuilding, and creative projects.

## Features

- **Multiple Pre-configured Generators**: Comes with ready-to-use generators for:
  - Tavern Names
  - Fantasy Characters
  - Quest Hooks
- **Fully Customizable**: 
  - Edit existing generators
  - Create new generators with custom fields
  - Modify format templates
- **Flexible Content Generation**:
  - Generate random content with a single click
  - Insert generated content directly into your notes
- **Easy Management**:
  - Add, edit, rename, and delete generators
  - Export and import generator configurations
- **Customizable Appearance**:
  - Option to use custom CSS for styling

## How to Use

### Generating Content

1. Access the Random Generator:
   - Click the dice icon in the left ribbon
   - Use the command palette (Ctrl/Cmd+P)
   - Use the "Insert Random Generation" command

2. In the generator modal:
   - Select a generator from the dropdown
   - Click "Generate" to create random content
   - Click "Insert" to add the content to your current note

### Managing Generators

1. Go to Settings > Random Generator

2. For Existing Generators:
   - Edit generator name and description
   - Modify format templates
   - Add, rename, or delete fields
   - Duplicate or remove entire generators

3. Creating a New Generator:
   - Click "Add Generator"
   - Enter a name and description
   - Define a format template using {Field} placeholders
   - Add fields with possible values
   - Example format: `A {Adjective} {Noun} who {Action}`

### Export and Import

- **Export**: Save your custom generators to a JSON file
- **Import**: Add generators from previously exported files

## Example Generators

### Tavern Generator
Format: `{Beginning Name} {Ending Name}, known for {Known For}.`
- Generates names like "The Rusty Anchor, known for its strong ale"

### Fantasy Character Generator
Format: `A {Personality} {Race} {Class} who was once a {Background}.`
- Generates characters like "A brave and reckless Half-Orc Barbarian who was once a Pirate"

### Quest Generator
Format: `{Quest Giver} needs you to {Task} {Location}, {Complication}.`
- Generates quests like "A mysterious wizard needs you to retrieve a stolen artifact in a haunted forest, but supernatural forces are interfering"

## Customization

### Custom CSS

- Enable custom styling by providing a path to a CSS file
- Customize the appearance of generators and modals

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings
2. Navigate to Community Plugins
3. Browse and search for "Random Generator"
4. Click Install, then Enable

### Manual Installation

1. Download the latest release from the GitHub repository
2. Extract files into your Obsidian vault's `.obsidian/plugins/` directory
3. Enable the plugin in Obsidian settings

## Development

### Prerequisites
- Node.js
- npm or yarn

### Setup
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` for development mode

### Building
Run `npm run build` to create a production build

## License

MIT License - see the LICENSE file for details.

## Support

Encounter an issue or have a suggestion? Please file an issue on the GitHub repository.

---

Create, generate, and inspire with random content in your Obsidian vault!
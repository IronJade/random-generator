# Random Generator Plugin for Obsidian

A powerful plugin for [Obsidian](https://obsidian.md) that allows you to generate random content based on customizable templates. Perfect for RPG games, creative writing, worldbuilding, or any situation where you need random but structured content.

## Features

- Generate random content with customizable templates
- Pre-configured generators for taverns, fantasy characters, quests, and more
- Create and customize your own generators with simple syntax
- Import and export generators to share with others
- Customize appearance with CSS
- Insert generated content directly into your notes
- Supports variables, conditional logic, and weighted options

## Usage

1. Open the Random Generator by clicking on the dice icon in the ribbon or using the command palette (`Ctrl+P` and search for "Random Generator")
2. Select the generator you want to use from the dropdown menu
3. Click "Generate" to create random content based on your template
4. Click "Insert" to add the content into your note at the cursor position
5. Use the "Copy" button to copy the content to your clipboard

## Creating Custom Generators

1. Go to the plugin settings
2. Click "Add Generator"
3. Fill in the name, description, and format template
4. Add fields with their possible values
5. The format template uses field names in curly braces (e.g., `{Character} is from {Location}`)
6. For advanced templates, you can use:
   - Nested fields: `{Character.Name}`, `{Character.Class}`
   - Conditional logic: `{if:Condition}{Result}{else}{Alternative}{endif}`
   - Weighted options: `{Field:3:Common Option|1:Uncommon Option|0.5:Rare Option}`

## Installation

### From Obsidian Community Plugins

1. Open Obsidian
2. Go to Settings > Community Plugins
3. Disable Safe Mode
4. Click "Browse" and search for "Random Generator"
5. Install the plugin and enable it

### Manual Installation

1. Download the latest release from the [GitHub repository](https://github.com/yourusername/obsidian-random-generator/releases)
2. Extract the files into your Obsidian vault's `.obsidian/plugins/random-generator` directory
3. Restart Obsidian and enable the plugin in Settings > Community Plugins

## Examples

### Simple Character Generator
```
{Name} is a {Race} {Class} who carries a {Weapon} and seeks to {Goal}.
```

### Tavern Generator
```
The {TavernAdjective} {TavernNoun} is run by {OwnerName}, a {OwnerDescription}. 
The specialty is {FoodType} and the atmosphere is {Atmosphere}.
```

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Obsidian](https://obsidian.md)

### Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server with hot-reload

### Building

Run `npm run build` to create a production build.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have feature requests, please file an issue on the [GitHub repository](https://github.com/yourusername/obsidian-random-generator/issues).
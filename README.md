# License Generator

An interactive CLI tool to quickly generate open-source licenses for your projects.

## Demo

https://github.com/user-attachments/assets/25d4a68b-4cb3-4570-ac57-88d955bbcb53

## Features

- 🚀 Interactive license selection from GitHub's license API
- 📝 Automatic copyright holder and year detection from git config
- ✨ Beautiful terminal UI powered by @clack/prompts and inquirer
- 🔄 Overwrite protection for existing LICENSE files

## Installation

```bash
pnpm add -g @anth0nycodes/license-generator
```

Or using npm:

```bash
npm install -g @anth0nycodes/license-generator
```

## Usage

```bash
generate-license
```

The CLI will guide you through:

1. **Select a license** - Choose from popular open-source licenses (MIT, Apache-2.0, GPL, etc.)
2. **Enter copyright holder** - Defaults to your git username
3. **Enter copyright year** - Defaults to the current year
4. **Confirm** - The LICENSE file will be created in your current directory

## Supported Licenses

This tool uses the GitHub Licenses API, which includes:

- GNU Affero General Public License v3.0
- Apache License 2.0
- BSD 2-Clause "Simplified" License
- BSD 3-Clause "New" or "Revised" License
- Boost Software License 1.0
- Creative Commons Zero v1.0 Universal
- Eclipse Public License 2.0
- GNU General Public License v2.0
- GNU General Public License v3.0
- GNU Lesser General Public License v2.1
- MIT License
- Mozilla Public License 2.0
- The Unlicense

## Requirements

- Node.js 20.x or higher

## Development

```bash
# Clone the repository
git clone https://github.com/anth0nycodes/license-generator.git
cd license-generator

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build
pnpm build

# Run built version
pnpm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For detailed guidelines on how to contribute, please see our [Contributing Guide](CONTRIBUTING.md).

## Author

**Anthony Hoang**

- GitHub: [@anth0nycodes](https://github.com/anth0nycodes)

## Links

- [npm package](https://www.npmjs.com/package/@anth0nycodes/license-generator)
- [GitHub repository](https://github.com/anth0nycodes/license-generator)
- [Report issues](https://github.com/anth0nycodes/license-generator/issues)

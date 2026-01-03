# License Generator

Interactive CLI tool to quickly generate open-source licenses for your projects.

## Demo

![demo](https://us-east-1.tixte.net/uploads/anth0nycodes.tixte.co/license-demo.mp4)

<p align="center"><img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/%40anth0nycodes%2Flicense-generator?style=plastic"></p>

## Features

- Interactive license selection from GitHub's license API
- Automatic copyright holder and year detection from git config
- Beautiful terminal UI with overwrite protection

## Installation

```bash
npm install -g @anth0nycodes/license-generator
```

## Usage

### Interactive Mode (Default)

```bash
generate-license
```

Select a license, enter copyright holder (defaults to git username) and year (defaults to current year), then confirm.

### Options

#### Quick Mode

Generate a license instantly using saved defaults:

```bash
generate-license -q
```

#### Set Default License

```bash
generate-license --sl <license-key>

# Example:
generate-license --sl mit
```

#### Set Default Author

```bash
generate-license --sa <author>

# Example:
generate-license --sa "anth0nycodes"
```

#### List Available Licenses

```bash
generate-license --ls
```

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
- Git

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

## Links

- [npm package](https://www.npmjs.com/package/@anth0nycodes/license-generator)
- [GitHub repository](https://github.com/anth0nycodes/license-generator)
- [Report issues](https://github.com/anth0nycodes/license-generator/issues)

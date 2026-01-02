# Contributing to License Generator

Thank you for your interest in contributing to License Generator! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate in your interactions with other contributors.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm (recommended) or npm

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/license-generator.git
   cd license-generator
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Project Locally

```bash
# Run in development mode with hot reload
pnpm dev

# Build the project
pnpm build

# Run the built version
pnpm start
```

### Making Changes

1. Make your changes in your feature branch
2. Test your changes thoroughly:
   - Run `pnpm dev` and test interactively
   - Test with different license types
   - Test edge cases (existing LICENSE file, etc.)
3. Ensure your code follows the existing style
4. Update documentation if needed

## Submitting Changes

### Pull Request Process

1. Commit your changes with clear, descriptive commit messages:

   ```bash
   git commit -m "Add feature: description of your changes"
   ```

2. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request on GitHub:
   - Fill out the PR template completely
   - Link any related issues
   - Describe what you changed and why
   - Include screenshots or examples if applicable

4. Wait for review:
   - Address any feedback from maintainers
   - Make requested changes if needed
   - Keep your PR updated with the main branch

### Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 72 characters
- Reference issues and pull requests where appropriate

## Reporting Bugs

If you find a bug, please create an issue using the bug report template. Include:

- A clear description of the bug
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, Node.js version, package version)
- Error messages or screenshots

## Suggesting Features

We welcome feature suggestions! Please create an issue using the feature request template. Include:

- A clear description of the feature
- The problem it solves or use case
- How you envision it working
- Any examples or references

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with your question
- Check existing issues and discussions

## License

By contributing to License Generator, you agree that your contributions will be licensed under the same license as the project (MIT License).

Thank you for contributing!

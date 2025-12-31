# Contributing to Outlook MCP Server

Thank you for your interest in contributing to Outlook MCP Server! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

When creating a bug report, include:
- Node.js version (`node --version`)
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Relevant error messages or logs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) when opening an issue.

### Suggesting Features

Feature requests are welcome! Please use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:
- Clear description of the feature
- Use case / problem it solves
- Proposed implementation (if any)
- Alternatives considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following the code style below
4. **Add tests** for new functionality
5. **Run tests**: `npm test`
6. **Update documentation** if needed
7. **Submit a pull request** using the PR template

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/outlook-mcp.git
cd outlook-mcp

# Install dependencies
npm install

# Run tests
npm test

# Start in test mode (no real API calls)
npm run test-mode

# Interactive testing with MCP Inspector
npm run inspect
```

## Code Style

- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions focused and small
- Handle errors appropriately

## Project Structure

When adding new tools:

1. Create a new module directory if needed (e.g., `contacts/`)
2. Implement tool handlers in separate files
3. Export tool definitions from the module's `index.js`
4. Add tools to the `TOOLS` array in main `index.js`
5. Add tests in the `test/` directory
6. Update `docs/quickrefs/tools-reference.md`

## Testing

- Write tests for new functionality
- Ensure existing tests pass: `npm test`
- Use test mode for development: `USE_TEST_MODE=true npm start`

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add conversation export to MBOX format
fix: resolve folder stats API error
docs: update installation instructions
test: add tests for contacts module
```

## Questions?

If you have questions, feel free to open an issue for discussion.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

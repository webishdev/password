# Password Generator

A secure, customizable password generator built with React, TypeScript, and Material-UI. Generate cryptographically secure passwords with customizable length and character sets.

## Features

- **Cryptographically Secure**: Uses `crypto.getRandomValues()` for secure random generation
- **Customizable**: Choose password length (4-64 characters) and character types
- **Modern UI**: Built with Material-UI components
- **Responsive**: Works seamlessly on desktop and mobile devices
- **One-Click Copy**: Easy clipboard integration
- **Accessible**: Proper ARIA labels and keyboard navigation

## Character Options

- **Lowercase**: a-z
- **Uppercase**: A-Z
- **Digits**: 0-9
- **Special**: !$%&#?
- **Avoid ambiguous**: Option to exclude easily confused characters

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

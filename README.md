# Weather Alert Application

A React TypeScript application for managing weather alerts and monitoring current weather conditions.

## Features

- **Home**: Display current weather data for selected locations
- **Alerts**: Create and manage weather alerts with custom thresholds
- **Current State**: Real-time monitoring of triggered alerts

## Tech Stack

- React 19.1.1
- TypeScript 5.9.2
- Tailwind CSS (via CDN)
- ESLint for code quality

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tomorrow.io-HW-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Available Scripts

- `npm start` - Starts the development server
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run lint` - Runs ESLint to check code quality
- `npm run lint:fix` - Automatically fixes ESLint issues

## Project Structure

```
src/
├── App.tsx          # Main application component
├── index.tsx        # Application entry point
└── index.css        # Global styles
```

## API Integration

This frontend application is designed to work with a backend API located in the `tomorrow.io-HW-backend` folder. The application will make HTTP requests to the backend for:

- Weather data retrieval
- Alert management (create, read, update, delete)
- Real-time alert status monitoring

## Development

The project uses:
- **TypeScript** for type safety
- **Tailwind CSS** for styling (loaded via CDN)
- **ESLint** for code quality and consistency

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Ensure all tests pass with `npm test`

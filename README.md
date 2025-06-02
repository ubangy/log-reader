# Log Reader

A Node.js application for reading and processing log files, written in TypeScript.

## Setup

1. Install node:
```bash
brew install nvm
nvm install 22
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run the application:
```bash
npm start
```

5. Run tests:
```bash
npm run test:unit
npm run test:unit:cov
```

## Available Scripts

- `npm start` - Run the compiled log reader script
- `npm run build` - Compile TypeScript to JavaScript
- `npm run test:unit` - Run unit tests
- `npm run test:unit:cov` - Run unit tests with coverage report

## Project Structure

```
log-reader/
├── src/           # TypeScript source code
├── dist/          # Compiled JavaScript output
├── tests/         # Test files
├── jest.config.ts # Jest configuration
├── package.json   # Project configuration
├── tsconfig.json  # TypeScript configuration
└── README.md      # Project documentation
```

## Assumptions

- There is only 1 log messgae per line

- Top 3's ties might need to be adjusted depending on requirements. For example, `getTop3MostVisitedUrls()` sorts by count and then alphabetical. It always returns 3 and not ties. This could be improved later.

- No linting or formatting. Can be done later.

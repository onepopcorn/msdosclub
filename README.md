# MS-DOS CLUB PODCAST WEB APP

![build](https://github.com/onepopcorn/msdosclub/actions/workflows/ci.yml/badge.svg)

This is a React web app to listen MS-DOS club podcasts while navigating through its contents.

## Development

This project has been created with [create-react-app](https://create-react-app.dev/) and [NodeJS](https://nodejs.org/en/) is needed to develop and build.

## Available Scripts

### `npm start`

Starts development environment and watches for file changes.

### `npm test`

Starts testing environment and watches for file changes. Can be runned alongside `npm start` in a separated terminal window.

### `npm test`

Runs all tests and creates a test coverage report.

### `npm run build`

Creates a production build in ./build folder.

### `npm run serve`

Runs a local server to test the production build. Note that `npm run build` must be runned before this command.

### `npm run test:e2e`

Opens up e2e testing suite (cypress).

### `npm run lint`

Runs linter. Note this script is runned automatically on each commit via Husky pre-commit hooks.

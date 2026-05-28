# TeleWidget

A communication widget that allows users to chat via Telegram directly from your website.

## Project Structure

This project is organized as an NPM monorepo:

- `/client`: Preact/Vite frontend for the widget.
- `/server`: Node.js/Express backend that handles communication with Telegram.
- `/conductor`: Development plans and documentation.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

Install dependencies for all workspaces:

```bash
npm install
```

### Development

Run both client and server in development mode:

```bash
npm run dev
```

Or run them individually:

```bash
npm run client:dev
npm run server:dev
```

## License

ISC

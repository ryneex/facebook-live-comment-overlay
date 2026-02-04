# Facebook Live Comment Overlay

A real-time comment overlay server for Facebook Live streams. This server receives comments from the [Facebook Live Comment Bridge](https://github.com/ryneex/facebook-live-comment-bridge) browser extension and displays them in a beautiful, customizable overlay interface via WebSocket.

## Features

- 🚀 **Real-time Updates**: WebSocket-based live comment streaming
- 🔒 **Secure**: Optional API key authentication
- 🔌 **Extension Compatible**: Fully compatible with [facebook-live-comment-bridge](https://github.com/ryneex/facebook-live-comment-bridge)
- 🐳 **Docker Ready**: Pre-built Docker image available
- 📡 **RESTful API**: Standard HTTP endpoints for comment submission

## Quick Start with Docker

The easiest way to run the server is using the pre-built Docker image:

```bash
docker pull ghcr.io/ryneex/facebook-live-comment-overlay:latest
docker run -p 3000:3000 ghcr.io/ryneex/facebook-live-comment-overlay:latest
```

### Docker with Custom Configuration

```bash
docker run -p 3000:3000 \
  -e SECRET_KEY=your-secret-key \
  -e BASE_URL=http://localhost:3000 \
  ghcr.io/ryneex/facebook-live-comment-overlay:latest
```

Or with custom port:

```bash
docker run -p 8080:8080 \
  ghcr.io/ryneex/facebook-live-comment-overlay:latest \
  --port 8080
```

## Installation

### Prerequisites

- Node.js >= 18
- pnpm >= 10.28.0

### Local Installation

1. Clone the repository:

```bash
git clone https://github.com/ryneex/facebook-live-comment-overlay.git
cd facebook-live-comment-overlay
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the project:

```bash
pnpm build
```

4. Start the server:

```bash
cd apps/server
node dist/index.js
```

## Configuration

### Environment Variables

- `SECRET_KEY` (optional): Secret key for API authentication. If provided, all API requests must include a valid API key.
- `BASE_URL` (optional): Base URL for the server. Defaults to `http://0.0.0.0:3000`.

### Command Line Options

- `--port, -p`: Port to listen on (default: 3000)
- `--host, -h`: Host to listen on (default: 0.0.0.0)
- `--secret, -s`: Secret key for API authentication (optional)

Example:

```bash
node dist/index.js --port 8080 --host 0.0.0.0 --secret my-secret-key
```

## Usage

### 1. Start the Server

Start the server using Docker or locally:

```bash
# Docker
docker run -p 3000:3000 ghcr.io/ryneex/facebook-live-comment-overlay:latest

# Local
cd apps/server && node dist/index.js
```

### 2. Configure the Browser Extension

This server is **fully compatible** with the [Facebook Live Comment Bridge](https://github.com/ryneex/facebook-live-comment-bridge) browser extension.

1. Install the [Facebook Live Comment Bridge](https://github.com/ryneex/facebook-live-comment-bridge) extension
2. Open the extension settings
3. Set your API endpoint URL to: `http://localhost:3000/api` (or your server URL)
4. If you've set a `SECRET_KEY`, enter it in the extension's API key field

### 3. Access the Overlay

Once the server is running, you'll see output like:

```
✓ Overlay server is running

  Host: 0.0.0.0
  Port: 3000
  Overlay URL: http://localhost:3000
  API URL: http://localhost:3000/api
  WebSocket URL: http://localhost:3000/api/ws
```

Open the **Overlay URL** in a browser (or OBS browser source) to display the live comments.

If authentication is enabled, the overlay URL will include an API key:

```
  Overlay URL: http://localhost:3000?key=your-generated-api-key
```

## API Documentation

### POST `/api/`

Submit comments to the server. This endpoint is used by the browser extension.

**Headers:**

- `Content-Type: application/json`
- `x-api-key: <api-key>` (required if `SECRET_KEY` is set)

**Request Body:**

```json
[
  {
    "image": "https://example.com/profile.jpg",
    "author": "John Doe",
    "comment": "Great stream!"
  }
]
```

**Response:**

Returns the same array of comments that was submitted.

### GET `/api/health`

Health check endpoint.

**Response:**

```json
{
  "status": "OK"
}
```

### WebSocket `/api/ws`

Real-time WebSocket connection for receiving comment updates.

**Connection URL:**

- Without auth: `ws://localhost:3000/api/ws`
- With auth: `ws://localhost:3000/api/ws?key=<api-key>`

**Message Format:**

```json
{
  "type": "comments",
  "data": [
    {
      "image": "https://example.com/profile.jpg",
      "author": "John Doe",
      "comment": "Great stream!"
    }
  ]
}
```

## Development

### Project Structure

This is a Turborepo monorepo containing:

- `apps/server`: Node.js server application
- `apps/overlay`: React overlay frontend
- `packages/ui`: Shared UI components
- `packages/config`: Shared configuration (ESLint, Prettier, TypeScript)

### Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build all packages
pnpm build

# Format code
pnpm format

# Lint code
pnpm lint

# Type check
pnpm check-types
```

### Running Individual Apps

```bash
# Server only
cd apps/server
pnpm dev

# Overlay only
cd apps/overlay
pnpm dev
```

## Tech Stack

- **Server**: Node.js, TypeScript, oRPC
- **Frontend**: React, Vite, Tailwind CSS
- **WebSocket**: ws
- **Build Tool**: Turborepo, esbuild
- **Package Manager**: pnpm

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Related Projects

- [Facebook Live Comment Bridge](https://github.com/ryneex/facebook-live-comment-bridge) - Browser extension for scraping Facebook Live comments

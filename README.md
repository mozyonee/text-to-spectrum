# Spectrotyper

Spectrotyper is an application that converts text into audio files where the text's shape is visible in the audio's spectrogram. It renders text as pixels and maps those pixels to specific audio frequencies.

## Project Structure

This project is an npm workspaces monorepo:

- [**`apps/client`**](./apps/client): A Next.js (React) frontend for text input and audio visualization.
- [**`apps/server`**](./apps/server): An Express.js backend for audio synthesis.
- [**`packages/shared`**](./packages/shared): A shared package containing constants used by both the client and server.

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm

### Installation

Install dependencies for the entire monorepo:

```bash
npm install
```

### Development

Run the client and server in separate terminals from the project root:

```bash
# Start the Next.js frontend
npm run dev:client

# Start the Express backend
npm run dev:server
```

The client will be available at [http://localhost:3000](http://localhost:3000) and the server at [http://localhost:3001](http://localhost:3001).

### Other Commands

- `npm run build`: Build all workspaces.
- `npm run lint`: Lint all workspaces.
- `npm run format`: Format code using Prettier.
- `npm run tsc`: Run type-checking across all workspaces.

## How it Works

1. **Text Rendering**: The server renders input text into a pixel grid using a 7x7 font.
2. **Frequency Mapping**: Each row in the pixel grid corresponds to a frequency between 1000Hz and 3000Hz.
3. **Synthesis**: Each column in the grid is converted into a segment of audio by summing sine waves of the "lit" pixels' frequencies.
4. **Visualization**: The resulting audio file, when viewed in a spectrogram (like the one in the client), reveals the original text.

## License

MIT

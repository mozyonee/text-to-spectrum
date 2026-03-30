# Spectrotyper: Client

The `@spectrotyper/client` package is the frontend of the Spectrotyper application, built with Next.js. It provides an interface to input text and play back the resulting audio with a visualized spectrogram.

## Technologies

- **Framework**: Next.js (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Audio Visualization**: Custom Canvas-based Spectrogram
- **API Client**: Axios

## Getting Started

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Build

Build the production-ready application:

```bash
npm run build
```

### Other Commands

- `npm run lint`: Run ESLint.
- `npm run format`: Format code using Prettier.
- `npm run typecheck`: Run TypeScript type-checking.

## Features

- **Text-to-Spectrum Conversion**: Enter text and play it as an audio file.
- **Real-time Visualization**: See the spectrogram generated from your text.
- **Custom UI**: Built with a custom, minimalist design.

## API Integration

The client communicates with the server's `/convert` endpoint to receive a WAV file. The API URL is configured in `src/lib/api.ts`.

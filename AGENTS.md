# Spectrotyper: Text-to-Spectrum Generator

Spectrotyper is a monorepo application that converts text into audio files where the text's shape is visible in the audio's spectrogram. It achieves this by rendering text as pixels and mapping those pixels to specific audio frequencies.

## Architecture & Technologies

The project is structured as an npm workspaces monorepo:

- **`apps/client`**: A Next.js (React) frontend.
  - **Technologies**: Next.js, TypeScript, Tailwind CSS, Axios.
  - **Purpose**: Provides a user interface to input text, triggers audio generation, and visualizes the resulting spectrogram.
- **`apps/server`**: An Express.js backend.
  - **Technologies**: Express, TypeScript, `node-wav`, `js-pixel-fonts`.
  - **Purpose**: Renders input text into a pixel grid and synthesizes a WAV file where lit pixels correspond to sine waves at specific frequencies.
- **`packages/shared`**: A shared library containing constants used by both the client and server.
  - **Constants**: `SAMPLE_RATE`, `FREQ_MIN`, `FREQ_MAX`, `SAMPLES_PER_COL`.

## Key Commands

Run these commands from the project root:

- **Development**:
  - `npm run dev:client`: Starts the Next.js development server for the frontend.
  - `npm run dev:server`: Starts the Express development server with hot-reloading.
- **Maintenance**:
  - `npm run build`: Builds all workspaces.
  - `npm run lint`: Runs ESLint across all workspaces.
  - `npm run format`: Formats code using Prettier.
  - `npm run tsc`: Performs type-checking across all workspaces.
- **Setup**:
  - `npm install`: Installs dependencies for the entire monorepo and sets up Husky.

## Development Conventions

- **Code Style**: Standardized across the project using Prettier (configured in the root `prettier.config.js`).
- **Typing**: Strict TypeScript is used in all packages. Type-checking should be performed before pushing changes.
- **Component Structure**: The client uses a feature-based directory structure (e.g., `src/features/convert`).
- **API**: The client communicates with the server via the `/convert` POST endpoint, which returns a `Blob` of type `audio/wav`.

## Technical Logic

1.  **Text Rendering**: The server uses `js-pixel-fonts` to turn text into a 7-row pixel grid.
2.  **Synthesis**: 
    - Each row in the grid maps to a frequency between `FREQ_MIN` (1000Hz) and `FREQ_MAX` (3000Hz).
    - Rows are inverted for the spectrogram (row 0 is the highest frequency).
    - Each column is synthesized into `SAMPLES_PER_COL` (1024) audio samples.
    - A Hann window is applied to each column to prevent clicking sounds.
3.  **Output**: The resulting PCM data is encoded into a standard WAV format using `node-wav`.

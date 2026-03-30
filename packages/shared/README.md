# Spectrotyper: Shared

The `@spectrotyper/shared` package is a small utility library containing constants used by both the client and server.

## Constants

- **`SAMPLE_RATE`**: The default audio sample rate (44100Hz).
- **`SAMPLES_PER_COL`**: The number of audio samples per pixel column (1024).
- **`FREQ_MIN`**: The minimum frequency (bottom row) of the spectrogram (1000Hz).
- **`FREQ_MAX`**: The maximum frequency (top row) of the spectrogram (3000Hz).

## Usage

This package is intended for internal use within the Spectrotyper monorepo.

```typescript
import { SAMPLE_RATE, FREQ_MIN, FREQ_MAX } from "@spectrotyper/shared";
```

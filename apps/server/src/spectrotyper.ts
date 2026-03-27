import { FREQ_MAX, FREQ_MIN, SAMPLE_RATE, SAMPLES_PER_COL } from "@spectrotyper/shared";
import { getGlyph, GLYPH_HEIGHT } from "./font";

// Convert a pixel row index (0 = top of glyph) to a frequency in Hz.
// Row 0 maps to the highest frequency; the last row maps to the lowest.
// This mirrors how spectrograms are usually drawn: high pitch at top, low pitch at bottom.
function rowToFreq(row: number): number {
	return FREQ_MAX - (row * (FREQ_MAX - FREQ_MIN)) / (GLYPH_HEIGHT - 1);
}

// Turn a string of text into a sequence of pixel columns.
// Each column is an array of booleans — true means "this pixel is ON (play a tone here)".
// Think of it as a piano-roll: each column is a moment in time,
// each row is a musical note (frequency), and true = the note is playing.
function buildColumns(text: string): boolean[][] {
	const columns: boolean[][] = [];
	// A blank column (all pixels off) used as a visual gap between characters.
	const blank: boolean[] = new Array(GLYPH_HEIGHT).fill(false);

	for (const char of text) {
		// Look up the pixel bitmap for this character from the font.
		const pixels = getGlyph(char);
		const glyphWidth = pixels[0]?.length ?? 1;

		// Each column of the glyph bitmap becomes one time slice in our audio.
		for (let col = 0; col < glyphWidth; col++) {
			const frame: boolean[] = [];
			for (let row = 0; row < GLYPH_HEIGHT; row++) {
				// 1 in the font bitmap = lit pixel = we want a tone here.
				frame.push((pixels[row]?.[col] ?? 0) === 1);
			}
			columns.push(frame);
		}
		// Insert a silent gap after each character so letters don't blur together.
		columns.push(blank);
	}

	return columns;
}

// Convert the pixel columns into actual audio samples (PCM = Pulse-Code Modulation).
// For each column (time slice) we add together sine waves for every lit pixel row,
// creating a chord whose notes encode the visual shape of the letter.
function synthesize(columns: boolean[][]): Float64Array {
	const totalSamples = columns.length * SAMPLES_PER_COL;
	// PCM buffer: each entry is one audio sample (a pressure value at one instant).
	const pcm = new Float64Array(totalSamples);

	for (let colIdx = 0; colIdx < columns.length; colIdx++) {
		const frame = columns[colIdx];

		// Collect the frequencies (pitches) that should sound during this time slice.
		const activeFreqs: number[] = [];
		for (let row = 0; row < GLYPH_HEIGHT; row++) {
			if (frame[row]) activeFreqs.push(rowToFreq(row));
		}
		// Nothing lit in this column — leave the samples as silence (0).
		if (activeFreqs.length === 0) continue;

		const offset = colIdx * SAMPLES_PER_COL;
		for (let s = 0; s < SAMPLES_PER_COL; s++) {
			// Convert sample index to time in seconds.
			const t = s / SAMPLE_RATE;
			// Hann window: tapers signal to 0 at both ends, eliminating discontinuity noise.
			// Without this, jumping abruptly from silence to sound causes a click.
			const window = 0.5 * (1 - Math.cos((2 * Math.PI * s) / (SAMPLES_PER_COL - 1)));
			// Sum all the active sine waves together to form the chord for this sample.
			let sum = 0;
			for (const freq of activeFreqs) {
				sum += Math.sin(2 * Math.PI * freq * t);
			}
			// Apply the window to soften the attack and release of each column.
			pcm[offset + s] = sum * window;
		}
	}

	// Normalize: find the loudest sample, then scale the whole buffer so that
	// peak loudness is 90% of the maximum a 16-bit audio file can hold.
	// This prevents clipping while keeping the volume as high as possible.
	let peak = 0;
	for (let i = 0; i < pcm.length; i++) {
		if (Math.abs(pcm[i]) > peak) peak = Math.abs(pcm[i]);
	}
	if (peak > 0) {
		const scale = (32767 * 0.9) / peak;
		for (let i = 0; i < pcm.length; i++) {
			pcm[i] *= scale;
		}
	}

	return pcm;
}

// Package the raw audio samples into a WAV file (the simplest audio format).
// WAV = a short header that describes the audio, followed by the samples themselves.
function encodeWav(pcm: Float64Array): Buffer {
	// Each sample is stored as a 16-bit (2-byte) integer.
	const dataLen = pcm.length * 2;
	// The WAV header is always exactly 44 bytes.
	const header = Buffer.alloc(44);

	// "RIFF" marks this as a RIFF container file.
	header.write("RIFF", 0, "ascii");
	// Total file size minus the 8 bytes used by "RIFF" + this size field itself.
	header.writeUInt32LE(36 + dataLen, 4);
	// "WAVE" identifies the RIFF type as audio.
	header.write("WAVE", 8, "ascii");
	// "fmt " chunk: describes the audio format.
	header.write("fmt ", 12, "ascii");
	header.writeUInt32LE(16, 16);       // fmt chunk size (always 16 for PCM)
	header.writeUInt16LE(1, 20);        // audio format: 1 = uncompressed PCM
	header.writeUInt16LE(1, 22);        // number of channels: 1 = mono
	header.writeUInt32LE(SAMPLE_RATE, 24);          // samples per second (e.g. 44100 Hz)
	header.writeUInt32LE(SAMPLE_RATE * 2, 28);      // bytes per second = sampleRate × 2 bytes
	header.writeUInt16LE(2, 32);        // block align: bytes per sample frame (2 bytes for 16-bit mono)
	header.writeUInt16LE(16, 34);       // bits per sample
	// "data" chunk: the actual audio samples follow immediately after.
	header.write("data", 36, "ascii");
	header.writeUInt32LE(dataLen, 40);  // size of the audio data in bytes

	// Convert our floating-point samples to 16-bit integers, clamping to valid range.
	const samples = Buffer.alloc(dataLen);
	for (let i = 0; i < pcm.length; i++) {
		const clamped = Math.max(-32768, Math.min(32767, Math.round(pcm[i])));
		samples.writeInt16LE(clamped, i * 2);
	}

	return Buffer.concat([header, samples]);
}

// Main entry point: takes a string and returns a WAV file as a Buffer.
// The audio, when viewed in a spectrogram app, will visually spell out the input text.
export function textToWav(text: string): Buffer {
	const columns = buildColumns(text);  // text → pixel grid
	const pcm = synthesize(columns);     // pixel grid → audio samples
	return encodeWav(pcm);               // audio samples → WAV file bytes
}

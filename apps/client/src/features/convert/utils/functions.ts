import { FREQ_MAX, FREQ_MIN, SAMPLES_PER_COL } from "@spectrotyper/shared";

// Draws a spectrogram of the given audio blob onto the canvas.
// A spectrogram is a picture of sound: time runs left-to-right, pitch (frequency)
// runs bottom-to-top, and brightness shows how loud each pitch is at each moment.
export const render = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, blob: Blob) => {
	// Each audio "column" is drawn this many pixels wide so the image isn't too narrow.
	const horizontalScale = 5;

	// AudioContext is the browser's built-in audio engine.
	const ac = new AudioContext();
	// Decode the audio file (WAV/MP3/etc.) into raw sound samples — a long list of
	// numbers where each number is the air-pressure value at one tiny moment in time.
	const buf = await ac.decodeAudioData(await blob.arrayBuffer());
	// We only needed it for decoding; close it to free resources.
	ac.close();

	// Get the raw sound samples for the first (and only) audio channel.
	const pcm = buf.getChannelData(0);

	// The image will have this many rows, one per frequency band we want to display.
	const rows = 50;
	// Split the audio into time slices; each slice becomes one column in the image.
	const cols = Math.floor(pcm.length / SAMPLES_PER_COL);

	// Set the canvas size to fit all columns and rows exactly.
	canvas.width = cols * horizontalScale;
	canvas.height = rows;

	// Walk through every time slice (column) and every frequency band (row).
	for (let col = 0; col < cols; col++) {
		for (let row = 0; row < rows; row++) {
			// Map the row index to a frequency in Hz.
			// Row 0 (top) = highest pitch, last row (bottom) = lowest pitch.
			const freq = FREQ_MAX - (row / (rows - 1)) * (FREQ_MAX - FREQ_MIN);

			// Measure how much of this specific frequency is present in this time slice.
			// This is the Goertzel / DFT idea: we "tune" a virtual radio receiver to
			// exactly `freq` Hz and see how strongly the signal resonates with it.
			// `re` and `im` together form a 2D arrow whose length = strength of that frequency.
			let re = 0, im = 0;
			for (let n = 0; n < SAMPLES_PER_COL; n++) {
				// The angle advances by 2π*freq each second; at sample n it is proportional to n.
				const a = (2 * Math.PI * freq * n) / buf.sampleRate;
				// Multiply the audio sample by a cosine wave (real part) and accumulate.
				re += pcm[col * SAMPLES_PER_COL + n] * Math.cos(a);
				// Multiply by a sine wave (imaginary part) and accumulate.
				im -= pcm[col * SAMPLES_PER_COL + n] * Math.sin(a);
			}

			// The length of the (re, im) arrow is the amplitude (loudness) at this frequency.
			// Divide by window size to normalize, multiply by 20 to brighten, cap at 1.
			const v = Math.min(1, Math.sqrt(re * re + im * im) / SAMPLES_PER_COL * 20);

			// Pick a color: silent = blue (hue 240), loud = red/orange (hue 0).
			// Lightness goes from 0% (black / silence) up to 50% (full color / loud).
			ctx.fillStyle = `hsl(${(1 - v) * 240},100%,${v * 50}%)`;

			// Paint a thin horizontal rectangle for this frequency band at this time position.
			ctx.fillRect(col * horizontalScale, row, horizontalScale, 1);
		}
	}
};

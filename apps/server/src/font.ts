// @ts-ignore
import { fonts } from "js-pixel-fonts";

// Use the "sevenPlus" pixel font — a tiny bitmap font where each character is
// drawn on a 7-row grid, like old LED displays or early video game text.
const font = fonts.sevenPlus as {
	lineHeight: number;
	glyphs: Record<string, { pixels: number[][]; }>;
};

// The number of pixel rows every glyph occupies (7 for this font).
// This also determines how many distinct frequency bands the audio will have.
export const GLYPH_HEIGHT = font.lineHeight; // 7

// Return the pixel bitmap for a single character.
// The bitmap is a 2D array: pixels[row][col] === 1 means that pixel is ON (filled),
// and 0 means it is OFF (empty).
// If the character isn't in the font, fall back to a space (blank glyph).
export function getGlyph(char: string): number[][] {
	const glyph = font.glyphs[char] ?? font.glyphs[" "];

	// Some glyphs (e.g. punctuation) are shorter than the full line height.
	// Center them vertically by padding with empty rows above and below
	// so every glyph is exactly GLYPH_HEIGHT rows tall.
	const h = glyph.pixels.length;
	if (h === GLYPH_HEIGHT) return glyph.pixels;

	const padTop = Math.floor((GLYPH_HEIGHT - h) / 2);
	const padBottom = GLYPH_HEIGHT - h - padTop;
	const emptyRow = (w: number) => new Array(w).fill(0);
	const w = glyph.pixels[0]?.length ?? 1;
	return [
		...Array.from({ length: padTop }, () => emptyRow(w)),    // blank rows above
		...glyph.pixels,                                          // the actual glyph
		...Array.from({ length: padBottom }, () => emptyRow(w)), // blank rows below
	];
}

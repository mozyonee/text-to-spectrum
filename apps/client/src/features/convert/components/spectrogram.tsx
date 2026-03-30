'use client';

import { useEffect, useRef } from 'react';
import { render } from '../utils/functions';

interface Props {
	blob?: Blob;
}

export default function Spectrogram({ blob }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!blob || !canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d')!;

		render(canvas, ctx, blob);
	}, [blob]);

	if (!blob) return null;
	return (
		<div className="w-full max-w-2xl border border-zinc-700 overflow-x-auto p-2">
			<canvas ref={canvasRef} className="block" style={{ height: 75 }} />
		</div>
	);
}

"use client";

import api from "@/lib/api";
import { debounce } from "lodash";
import { useMemo, useState } from "react";

interface Props {
	onConvert: (blob: Blob) => void;
}

export default function ConvertForm({ onConvert }: Props) {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

	const convert = useMemo(() => debounce(async (value: string) => {
		if (!value.trim()) return;
		setLoading(true);
		try {
			const res = await api.post("/convert", { text: value }, { responseType: "blob" });
			const url = URL.createObjectURL(res.data);
			setAudio(new Audio(url));
			onConvert(res.data);
		} finally {
			setLoading(false);
		}
	}, 250), [onConvert]);

	function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		setText(e.target.value);
		convert(e.target.value);
	}

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
				Text to Spectrogram
			</h1>
			<input
				type="text"
				value={text}
				onChange={handleTextChange}
				placeholder="Enter text..."
				className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-black outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500"
			/>
			<button
				onClick={() => audio?.play()}
				disabled={!text.trim() || loading}
				className={`transition duration-250 flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-90 dark:bg-white dark:text-black dark:hover:bg-zinc-200 ${loading ? "cursor-wait" : "cursor-pointer"}`}
			>
				{loading ? "Generating..." : "Play"}
			</button>
		</div>
	);
}

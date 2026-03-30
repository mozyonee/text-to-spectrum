"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";
import useConvert from "../hooks/use-convert";

interface Props {
	setBlob: Dispatch<SetStateAction<Blob | undefined>>;
}

export default function ConvertForm({ setBlob }: Props) {
	const { loading, audio, text, setText } = useConvert(setBlob);

	return (
		<div className="flex w-full max-w-md flex-col gap-3">
			<p className="text-xs tracking-widest" style={{ color: "var(--muted)" }}>
				text → spectrum
			</p>
			<Input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="enter text..."
			/>
			<Button
				onClick={() => audio?.play()}
				disabled={!text.trim() || loading}
				style={{
					cursor: loading ? "wait" : undefined,
				}}
			>
				{loading ? "generating..." : "play"}
			</Button>
		</div>
	);
}

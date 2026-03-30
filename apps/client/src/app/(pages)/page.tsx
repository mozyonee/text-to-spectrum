"use client";

import ConvertForm from "@/features/convert/components/convert-form";
import Spectrogram from "@/features/convert/components/spectrogram";
import { useState } from "react";

export default function Home() {
	const [blob, setBlob] = useState<Blob>();

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16" style={{ background: "var(--bg)" }}>
			<ConvertForm setBlob={setBlob} />
			<Spectrogram blob={blob} />
		</div>
	);
}

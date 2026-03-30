import api from "@/lib/api";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

const useConvert = (setBlob: Dispatch<SetStateAction<Blob | undefined>>) => {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

	const convert = useCallback(async () => {
		try {
			const res = await api.post("/convert", { text }, { responseType: "blob" });
			const url = URL.createObjectURL(res.data);
			setAudio(new Audio(url));
			setBlob(res.data);
		} finally {
			setLoading(false);
		}
	}, [text, setBlob]);

	useEffect(() => {
		if (!text.trim()) return;
		setLoading(true);

		const timer = setTimeout(convert, 250);
		return () => clearTimeout(timer);
	}, [text, convert]);

	return {
		loading,
		audio,
		text,
		setText,
	};
};

export default useConvert;
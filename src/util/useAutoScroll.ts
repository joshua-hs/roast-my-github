import { useEffect, useRef, useCallback, useState } from "react";

export function useScrollToBottom(dependencies = []) {
	const [pageHeight, setPageHeight] = useState(0);
	const isUserNearBottom = useRef(true);

	const scrollToBottom = useCallback(() => {
		if (typeof window !== "undefined") {
			window.scrollTo({
				top: document.body.scrollHeight,
				behavior: "smooth",
			});
		}
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;

		setPageHeight(document.body.scrollHeight);

		const handleScroll = () => {
			const scrollPos = window.innerHeight + window.scrollY;
			const isNearBottom = scrollPos >= document.body.scrollHeight - 100;
			isUserNearBottom.current = isNearBottom;
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const observer = new MutationObserver(() => {
			const newHeight = document.body.scrollHeight;
			if (newHeight > pageHeight) {
				setPageHeight(newHeight);
				if (isUserNearBottom.current) {
					scrollToBottom();
				}
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });

		return () => observer.disconnect();
	}, [pageHeight, scrollToBottom, ...dependencies]);

	return scrollToBottom;
}

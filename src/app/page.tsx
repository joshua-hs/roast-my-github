"use client";
import { useEffect, useState } from "react";
import { Title, Text, Button, Container, SegmentedControl } from "@mantine/core";
import { InputValidation } from "../components/InputValidation/InputValidation";
import useAutoScroll from "@/util/useAutoScroll";
import LoadingGif from "@/components/LoadingGif/LoadingGif";
import { useMediaQuery } from "@mantine/hooks";
import queryGeminiMock from "@/pages/api/queryGeminiMock";

export default function Home() {
	const [username, setUsername] = useState<string>("");
	const [response, setResponse] = useState("");
	const [displayedText, setDisplayedText] = useState("");
	const [intensity, setIntensity] = useState<string>("medium");
	const [loading, setLoading] = useState(false);
	const [inputError, setInputError] = useState<string>("");
	const [showLoadingGif, setShowLoadingGif] = useState(false);

	useAutoScroll(true);

	const isMobile = useMediaQuery("(max-width: 550px)");

	useEffect(() => {
		let currentIndex = 0;

		const intervalId = setInterval(() => {
			if (loading) {
				if (currentIndex <= response.length) {
					setDisplayedText(response.slice(0, currentIndex));
					currentIndex++;
				} else {
					clearInterval(intervalId);
					if (loading && currentIndex > 1) {
						setShowLoadingGif(false);
						setLoading(false);
					}
				}
			}
		}, 15);

		return () => clearInterval(intervalId);
	}, [response, loading]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (response !== displayedText) {
			return;
		}
		if (username === "") {
			setInputError("Gotta enter a GitHub account!");
			return;
		}
		setLoading(true);
		setResponse("");
		setDisplayedText("");
		try {
			const githubResponse = await fetch(`/api/getGitHubUserActivity/?username=${username}`);
			if (!githubResponse.ok) {
				const errorData = await githubResponse.json();
				if (errorData.error === "USER NOT FOUND") {
					throw new Error("USER NOT FOUND");
				}
			}
			const githubUserData = await githubResponse.text();
			setInputError("");
			setShowLoadingGif(true);
			const geminiResponse = await fetch("/api/queryGemini", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					intensity,
					githubUserData,
				}),
			});
			if (!geminiResponse.ok) {
				throw new Error("GEMINI DID THIS");
			}
			const data = await geminiResponse.text();
			// const data = await queryGeminiMock();
			setResponse(data);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "USER NOT FOUND") {
					setInputError("Hmm, seems like that GitHub account doesn't exist");
				} else if (error.message === "GEMINI DID THIS") {
					setInputError("Somehow, Gemini failed us. Thanks google.");
				} else {
					setInputError(
						"Something weird happened and I'm not sure what. Perhaps we'll never know.",
					);
				}
			}
			setLoading(false);
		}
	};

	return (
		<>
			<main>
				<div className="items-center justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)]">
					<Container className="py-10 text-center">
						<Title
							className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500"
							size="h1"
							styles={{
								root: {
									minHeight: "5rem",
									maxHeight: "12rem",
								},
							}}
						>
							Roast my GitHub
						</Title>
						<Text className="mt-4 text-lg text-gray-300">Aren't LLMs amazing?</Text>
						<form onSubmit={handleSubmit}>
							<div className="mt-10 place-items-center">
								<InputValidation error={inputError} value={username} setValue={setUsername} />
								<div className="mt-10">
									<div className="flex justify-center">
										<Text>Choose Roast level</Text>{" "}
									</div>
									<SegmentedControl
										value={intensity}
										onChange={setIntensity}
										orientation={isMobile ? "vertical" : "horizontal"}
										radius="xl"
										size="md"
										transitionDuration={200}
										withItemsBorders={false}
										className="mt-2"
										data={[
											{ label: "Praise me instead", value: "praise" },
											{ label: "Roast me a bit...", value: "medium" },
											{ label: "Roast me hard!", value: "high" },
										]}
										styles={{
											root: {
												backgroundColor: "black",
												border: `2px solid ${intensity === "praise" ? "cyan" : intensity === "medium" ? "violet" : "var(--mantine-color-red-filled)"}`,
											},
											indicator: {
												backgroundImage:
													intensity === "praise"
														? `linear-gradient(to right, var(--mantine-color-green-filled),var(--mantine-color-cyan-filled)
												)`
														: intensity === "medium"
															? `linear-gradient(to right, var(--mantine-color-pink-filled),var(--mantine-color-violet-filled)
												)`
															: `linear-gradient(to right, var(--mantine-color-red-filled),var(--mantine-color-pink-filled)
												)`,
											},
											label: {
												color: "white",
											},
										}}
									/>
								</div>
								<div className="mt-10 flex gap-4">
									<Button loading={loading} size="lg" color="pink" onClick={handleSubmit}>
										{intensity === "praise" ? "Praise me" : "Roast me"}
									</Button>
								</div>
							</div>
						</form>
						{showLoadingGif && !displayedText ? (
							<div className="mt-10 justify-items-center">
								<LoadingGif />
							</div>
						) : (
							<Text className="mt-20 text-2xl text-gray-300 whitespace-pre-line">
								{displayedText}
								<span className="animate-blink">|</span>
							</Text>
						)}
					</Container>
				</div>
			</main>
		</>
	);
}

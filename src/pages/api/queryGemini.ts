import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default async function queryGemini(req: NextApiRequest, res: NextApiResponse) {
	const { intensity, githubUserData } = req.body;

	let prompt = "";

	const promptOpening = "This is someone's github information. Pretend it's mine.";

	// For some reason Gemini seems to think we're not in 2025 yet (perhaps due to training data cut off?) and sometimes mentioned time travel regarding commits or forks that happened this year
	const promptEnding = `Don't just list bulletpoints, collate the data and write a few paragraphs. Also, don't talk about time travel. Make your response between 1300 and 1400 characters. ${githubUserData}`;

	const constructPrompt = (text: string) => {
		return `${promptOpening} ${text} ${promptEnding}`;
	};

	if (intensity === "praise") {
		prompt = constructPrompt(
			"I want you to commend and praise me. Tell me how well I'm doing. End with an encouraging remark.",
		);
	} else if (intensity === "medium") {
		prompt = constructPrompt(
			"I want you to roast and make fun of me in a humorous, snarky yet light-hearted and somewhat cheerful manner. End with a small note of encouragement.",
		);
	} else {
		prompt = constructPrompt(
			"I want you to rebuke and severely criticize me. Be brutally sarcastic and sardonic. Sneak in a joke that references popular internet culture. Don't hold back, I want you to attack me very harshly. End with a scathing, cruel insult.",
		);
	}

	try {
		const result = await model.generateContent(prompt);
		const text = result.response.text();
		return res.status(200).send(text);
	} catch (error) {
		return res.status(500).send({ error: "GEMINI DID THIS" });
	}
}

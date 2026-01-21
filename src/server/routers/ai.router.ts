import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc/init";

const googleGenAIAPIKey =
	process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
	(() => {
		throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
	})();
const genAI = new GoogleGenerativeAI(googleGenAIAPIKey);

export const aiRouter = createTRPCRouter({
	generateDescription: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				currentDescription: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
			const model = genAI.getGenerativeModel({ model: modelName });

			const prompt = `        You are a productivity expert. Help me write a professional and concise task description for a task management app.
        Task Title: ${input.title}
        ${input.currentDescription ? `Current context/notes: ${input.currentDescription}` : ""}

        Requirements:
        - Detect the language of the Task Title and respond in that SAME language.
        - Output ONLY the description in HTML format (suitable for Tiptap editor).
        - Use <ul> or <ol> for lists if necessary.
        - Use <p> for paragraphs.
        - Keep it actionable and clear.
        - Avoid filler text like "Here is your description".
      `;

			const result = await model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			// Clean markdown if Gemini accidentally included it
			const html = text.replace(/```html|```/g, "").trim();

			return { description: html };
		}),
});

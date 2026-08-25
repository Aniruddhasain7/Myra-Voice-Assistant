import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
];

export async function run(prompt) {
  for (const model of MODELS) {
    try {
      const response = await genAI.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction:
            "You are Myra, a friendly and intelligent female voice assistant. Keep your responses short, natural, concise (1-2 sentences), and easy to speak aloud.",
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (error) {
      console.warn(`Model ${model} failed, trying next fallback:`, error);
      if (model === MODELS[MODELS.length - 1]) {
        console.error("All Gemini models failed:", error);
      }
    }
  }

  return "I'm having trouble connecting right now. Please try again in a moment.";
}

export default run;

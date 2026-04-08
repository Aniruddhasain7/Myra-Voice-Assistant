import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export async function run(prompt) {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt
    });

    return response.text;

  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong";
  }
}

export default run;
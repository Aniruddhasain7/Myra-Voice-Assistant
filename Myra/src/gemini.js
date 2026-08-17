import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function run(prompt) {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are Myra, a friendly and intelligent female voice assistant. Keep your responses short, natural, concise (1-2 sentences), and easy to speak aloud.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something went wrong";
  }
}

export default run;

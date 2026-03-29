import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 100,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite", 
    generationConfig, 
  });

  const chatSession = model.startChat({
    history: [], 
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

export default run;
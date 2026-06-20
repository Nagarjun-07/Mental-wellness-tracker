import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({
  apiKey: apiKey || "dummy-key-to-allow-build",
});

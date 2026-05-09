
import { GoogleGenAI } from "@google/genai";
import { loadEnv } from 'vite';

// Mocking Vite's loadEnv behavior to read from .env.local
const env = loadEnv('', process.cwd(), '');
const API_KEY = env.GEMINI_API_KEY;

async function list() {
    if (!API_KEY) {
        console.error("No GEMINI_API_KEY found in .env.local");
        return;
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        const models = await ai.models.list();
        console.log("AVAILABLE MODELS:");
        for await (const m of models) {
            console.log(`- ${m.name}`);
        }
    } catch (e: any) {
        console.error("Error listing models:", e.message);
    }
}
list();

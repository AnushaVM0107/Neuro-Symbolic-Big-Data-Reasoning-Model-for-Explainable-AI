
import { GoogleGenAI } from "@google/genai";
import type { AIInsightsData } from "../types";

/* =========================
   ENV VARIABLES
========================= */
const API_KEY = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "";

/* =========================
   MODELS TO TRY
========================= */
const MODELS = [
    { name: 'gemini-2.0-flash', version: 'v1beta' },
    { name: 'gemini-1.5-flash', version: 'v1' },
    { name: 'gemini-1.5-flash-8b', version: 'v1' },
    { name: 'gemini-1.5-pro', version: 'v1' }
];

export async function getAIInsights(
    csvContent: string
): Promise<AIInsightsData> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set. Please check your .env.local file.");
    }

    const prompt = `
Analyze the following CSV data and return a structured analysis.

Rules:
- Return ONLY valid JSON
- No markdown formatting (no \`\`\`json blocks)
- No explanations outside JSON

JSON format structure:
{
  "summary": "string",
  "keyObservations": ["string"],
  "dataQualityIssues": ["string"]
}

CSV Data:
${csvContent.substring(0, 15000)}
`;

    let lastError = "";

    for (const modelInfo of MODELS) {
        try {
            console.log(`Attempting analysis with ${modelInfo.name} (${modelInfo.version})...`);
            const ai = new GoogleGenAI({ apiKey: API_KEY, apiVersion: modelInfo.version as any });

            const response = await ai.models.generateContent({
                model: modelInfo.name,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });

            const content = response.text;
            if (!content) continue;

            const cleaned = content
                .trim()
                .replace(/^```json/i, "")
                .replace(/^```/, "")
                .replace(/```$/, "")
                .trim();

            const parsed = JSON.parse(cleaned) as AIInsightsData;

            if (
                typeof parsed.summary === "string" &&
                Array.isArray(parsed.keyObservations) &&
                Array.isArray(parsed.dataQualityIssues)
            ) {
                return parsed;
            }
        } catch (err: any) {
            lastError = err.message || JSON.stringify(err);
            console.warn(`${modelInfo.name} failed:`, lastError);
            // If it's a 403 (Invalid Key), don't bother trying other models
            if (lastError.includes("403") || lastError.includes("API key")) {
                throw new Error("Invalid Gemini API Key. Please check your .env.local file.");
            }
        }
    }

    throw new Error(`AI Analysis failed after trying multiple models. Last error: ${lastError}`);
}

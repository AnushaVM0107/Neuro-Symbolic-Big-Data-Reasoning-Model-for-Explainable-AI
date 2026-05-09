
import { GoogleGenAI } from "@google/genai";
import type { AIInsightsData } from "../types";

/* =========================
   KEYS (from .env.local)
========================= */
const GEMINI_KEY = (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) || import.meta.env.VITE_GEMINI_API_KEY || "";
const OPENROUTER_KEY = (typeof process !== "undefined" && process.env?.VITE_OPENROUTER_API_KEY) || import.meta.env.VITE_OPENROUTER_API_KEY || "";

/* =========================
   CONFIG
========================= */
const SITE_URL = "http://localhost:3000";
const SITE_NAME = "Explainable AI Dashboard";

/**
 * A Unified service that tries multiple providers (Google and OpenRouter)
 * to ensure we ALWAYS generate insights, even if one model or key fails.
 */
export async function getAIInsights(csvContent: string): Promise<AIInsightsData> {
    const prompt = `
Analyze the following CSV data and return a structured analysis.
Rules:
- Return ONLY valid JSON
- No markdown formatting
- No explanations outside JSON

JSON format structure:
{
  "summary": "string",
  "keyObservations": ["string"],
  "dataQualityIssues": ["string"]
}

CSV Data:
${csvContent.substring(0, 10000)}
`;

    let lastError = "";

    // --- STRATEGY 1: GOOGLE GEMINI (Direct) ---
    if (GEMINI_KEY && GEMINI_KEY.length > 10) {
        try {
            console.log("Strategy 1: Attempting Google Gemini...");
            const genAI = new GoogleGenAI({ apiKey: GEMINI_KEY });
            // Direct call using SDK 2.0 style
            const result = await genAI.models.generateContent({
                model: "gemini-1.5-flash",
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                config: { responseMimeType: "application/json" }
            });
            const content = result.text;
            return parseAndValidate(content);
        } catch (err: any) {
            lastError = `Gemini failed: ${err.message}`;
            console.warn(lastError);
        }
    }

    // --- STRATEGY 2: OPENROUTER (Gemma 2 9B) ---
    if (OPENROUTER_KEY) {
        const orModels = [
            "google/gemma-2-9b-it:free",
            "google/gemma-2-9b-it", // Without :free as suggested
            "mistralai/mistral-7b-instruct:free",
            "openai/gpt-4o-mini" // User recommendation
        ];

        for (const modelId of orModels) {
            try {
                console.log(`Strategy 2: Attempting OpenRouter (${modelId})...`);
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_KEY}`,
                        "HTTP-Referer": SITE_URL,
                        "X-Title": SITE_NAME,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: modelId,
                        messages: [{ role: "user", content: prompt }],
                        response_format: { type: "json_object" }
                    })
                });

                if (!response.ok) {
                    const error = await response.text();
                    console.warn(`OpenRouter model ${modelId} failed: ${error}`);
                    continue;
                }

                const data = await response.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) return parseAndValidate(content);
            } catch (err: any) {
                console.warn(`OpenRouter ${modelId} error: ${err.message}`);
            }
        }
    }

    throw new Error(`Failed to generate insights. ${lastError || "No valid API keys found."}`);
}

function parseAndValidate(content: string): AIInsightsData {
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
    throw new Error("Invalid JSON structure received from AI.");
}

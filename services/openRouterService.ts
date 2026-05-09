import type { AIInsightsData } from "../types";

/* =========================
   ENV VARIABLES
========================= */
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
const SITE_NAME = import.meta.env.VITE_SITE_NAME || "CSV Dashboard";

/* =========================
   FALLBACK MODELS (ORDER MATTERS)
========================= */
const MODELS = [
  "google/gemma-2-9b-it:free",
  "meta-llama/llama-3-8b-instruct:free",
  "microsoft/phi-3-medium-128k-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "huggingfaceh4/zephyr-7b-beta:free"
];

/* =========================
   MAIN FUNCTION
========================= */
export async function getAIInsights(
  csvContent: string
): Promise<AIInsightsData> {
  if (!API_KEY) {
    throw new Error("VITE_OPENROUTER_API_KEY is not set");
  }

  /* =========================
     PROMPT (STRICT JSON ONLY)
  ========================= */
  const prompt = `
Analyze the following CSV data and return a structured analysis.

Rules:
- Return ONLY valid JSON
- No markdown
- No explanations outside JSON
- No code blocks

JSON format:
{
  "summary": "string",
  "keyObservations": ["string"],
  "dataQualityIssues": ["string"]
}

CSV Data:
${csvContent.substring(0, 15000)}
`;

  let lastError = "Unknown error";

  /* =========================
     TRY MODELS ONE BY ONE
  ========================= */
  for (const model of MODELS) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Model failed: ${model}`, errText);
        lastError = errText;
        continue; // try next model
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (!content) continue;

      /* =========================
         CLEAN & PARSE JSON
      ========================= */
      const cleaned = content
        .trim()
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      const parsed = JSON.parse(cleaned) as AIInsightsData;

      // Validate structure
      if (
        typeof parsed.summary === "string" &&
        Array.isArray(parsed.keyObservations) &&
        Array.isArray(parsed.dataQualityIssues)
      ) {
        return parsed;
      }

      lastError = "Invalid JSON structure received";
    } catch (err) {
      console.warn(`Model failed: ${model}`, err);
      lastError =
        err instanceof Error ? err.message : "Unexpected parsing error";
    }
  }

  throw new Error(`Failed to get insights from AI. Last error: ${lastError}`);
}

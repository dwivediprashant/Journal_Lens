import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Primary + fallbacks: Gemini 503-overload spikes are common, so rotate.
const PRIMARY = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const FALLBACKS = (process.env.GEMINI_FALLBACKS || "gemini-3.8-flash")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
export const GEMINI_MODEL_LIST = [
  PRIMARY,
  ...FALLBACKS.filter((m) => m !== PRIMARY),
];

const cache = new Map();
export function getGeminiModel(name) {
  const modelName = name || PRIMARY;
  if (cache.has(modelName)) return cache.get(modelName);
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (!key) throw new Error("GEMINI_API_KEY (or GOOGLE_API_KEY) is missing.");
  const m = new ChatGoogleGenerativeAI({
    model: modelName,
    apiKey: key,
    temperature: 0,
    maxOutputTokens: 2000,
  });
  cache.set(modelName, m);
  return m;
}
export const GEMINI_MODEL = PRIMARY;

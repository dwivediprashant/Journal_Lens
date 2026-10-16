import { z } from "zod";
import { getGeminiModel, GEMINI_MODEL_LIST } from "../models/geminiModel.js";

// Single structured-output schema: the LLM returns JSON, never raw text.
const QueryParseSchema = z.object({
  isValid: z.boolean().describe("True only if the query is a valid academic research request with a detectable field of interest."),
  intent: z.enum(["academic", "random", "chitchat"]).describe("academic = research-related; random = gibberish/invalid format; chitchat = non-research conversation."),
  publisher: z.string().optional().describe("Publisher name if mentioned (IEEE, Elsevier, Springer, ACM, Wiley, etc.)."),
  count: z.number().int().min(0).max(10).optional().describe("Number of papers requested. 0 = invalid (reject). 1-10 valid. Not mentioned = default 5."),
  field: z.string().optional().describe("Field/subject of interest (AIML, GenAI, civil, mechanical, quantum, etc.). Required for valid academic queries."),
  reason: z.string().optional().describe("Reason if invalid or field missing."),
});

const SYSTEM_PROMPT = `You are a query parser for an academic research search engine (OpenAlex).
Your ONLY job: parse the user's natural language query into structured JSON.

RULES:
1. Random gibberish (e.g. "859jsdb", "89437399ndnnnb heww343b c") -> isValid=false, intent="random", reason="Invalid query format."
2. Chit-chat (greetings, weather, jokes, non-research) -> isValid=false, intent="chitchat", reason="Not an academic research query."
3. Academic but NO field of interest mentioned -> isValid=false, intent="academic", reason="Please mention your field of interest (e.g., AIML, GenAI, civil, mechanical)."
4. Academic + field present -> isValid=true, intent="academic".
5. Detect publisher name if mentioned (IEEE, Elsevier, Springer, ACM, Wiley, Taylor & Francis, SAGE, etc.) -> publisher field.
6. Detect count requested (any integer). If user says 0 papers -> count=0 (will be rejected). Clamp to 1-10. Default 5 if not mentioned.
7. Detect field of interest (the subject/topic). Do NOT use a rigid list - accept any academic field.
8. Output ONLY valid JSON matching the schema. No markdown, no extra text.
`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function isRetryableLLMError(err) {
  return /503|502|429|overloaded|high demand|rate limit|temporar/i.test(String(err?.message || err || ""));
}

export async function parseNaturalQuery(query) {
  const text = (query || "").trim();
  if (!text) {
    return { ok: false, status: 400, error: "Please enter a search query." };
  }

  let lastErr = null;
  for (const modelName of GEMINI_MODEL_LIST) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = getGeminiModel(modelName).withStructuredOutput(QueryParseSchema);
        const result = await model.invoke([
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ]);
        return { ok: true, value: result };
      } catch (err) {
        lastErr = err;
        if (!isRetryableLLMError(err)) {
          return { ok: false, status: 502, fatal: true, error: err };
        }
        await sleep(1200 * attempt);
      }
    }
  }
  return { ok: false, status: 503, fatal: false, error: lastErr };
}
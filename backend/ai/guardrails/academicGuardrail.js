import { z } from "zod";
import { getGeminiModel, GEMINI_MODEL_LIST } from "../models/geminiModel.js";

const INVALID_MESSAGE = "Please provide a valid academic research topic, paper title, or author name.";

const IntentSchema = z.object({
  isAcademic: z.boolean().describe("True if about research topics, papers, authors, institutions, journals/sources, citations, scholarly topics."),
  reason: z.string().describe("Brief reason."),
});

const GREETING_ONLY = /^(hi|hello|hey|yo|greetings|good\s(morning|afternoon|evening)|thanks|thank\syou|bye|ok|okay)\s*[!.?]*$/i;
const GIBBERISH = /^[^a-zA-Z0-9]*$|^(.)\1{4,}$/;

// Offline academic-signal heuristic: if the query clearly contains
// research vocabulary, accept WITHOUT spending an LLM call (also immune
// to Gemini 503 spikes). Keep conservative to avoid false accepts.
const ACADEMIC_HINTS = ["paper", "papers", "research", "journal", "journals", "author", "authors", "study", "studies", "thesis", "publication", "publications", "citat", "doi", "issn", "isbn", "abstract", "conference", "proceedings", "elsevier", "springer", "ieee", "wiley", "university", "institute", "laboratory", "quantum", "neural", "cancer", "vaccine", "climate", "algorithm", "dataset"];
const CHITCHAT_HINTS = ["weather", "what time", "tell me a joke", "write code", "debug", "recipe", "movie", "song", "football", "cricket", "lottery", "horoscope"];

function quickReject(t) {
  if (!t || t.length < 3) return true;
  if (GREETING_ONLY.test(t)) return true;
  if (GIBBERISH.test(t)) return true;
  if (t.split(/\s+/).length === 1 && t.length < 4) return true;
  return false;
}

function offlinePass(text) {
  const low = text.toLowerCase();
  if (CHITCHAT_HINTS.some((h) => low.includes(h))) return false;
  if (ACADEMIC_HINTS.some((h) => low.includes(h))) return true;
  // "papers by <Name>" / "works on <topic>" patterns
  if (/\b(papers?|works|articles?)\s+(by|on|about|related to)\b/i.test(text)) return true;
  return null; // undecided -> ask the LLM
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function isRetryableLLMError(err) {
  const msg = String(err?.message || err || "");
  return /503|502|429|overloaded|high demand|rate limit|temporar/i.test(msg);
}

async function classifyWithRetry(text) {
  let lastErr = null;
  for (const modelName of GEMINI_MODEL_LIST) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const classifier = getGeminiModel(modelName).withStructuredOutput(IntentSchema);
        const result = await classifier.invoke([
          { role: "system", content: "Academic-query gatekeeper. isAcademic=true ONLY for scholarly research: topics, paper titles, authors, institutions, journals/sources, citations, abstracts, OpenAlex metadata (works/authors/sources/institutions/topics). False for publisher/funder queries, chit-chat, greetings alone, jokes, homework, coding, weather, lifestyle, gibberish." },
          { role: "user", content: text },
        ]);
        return { ok: true, value: result };
      } catch (err) {
        lastErr = err;
        console.warn(`[academicGuardrail] ${modelName} attempt ${attempt} failed:`, String(err?.message || err).slice(0, 200));
        if (!isRetryableLLMError(err)) return { ok: false, fatal: true, error: err };
        await sleep(1200 * attempt);
      }
    }
  }
  return { ok: false, fatal: false, error: lastErr };
}

async function checkAcademicIntent(query) {
  const text = (query || "").trim();
  if (!text) return { ok: false, message: INVALID_MESSAGE };
  if (quickReject(text)) return { ok: false, message: INVALID_MESSAGE };
  const fast = offlinePass(text);
  if (fast === true) return { ok: true, fastPath: true };
  if (fast === false) return { ok: false, message: INVALID_MESSAGE };
  const cls = await classifyWithRetry(text);
  if (cls.ok) {
    if (!cls.value?.isAcademic) return { ok: false, message: INVALID_MESSAGE };
    return { ok: true };
  }
  if (cls.fatal) {
    console.warn("[academicGuardrail] non-retryable classifier error, fail-open:", cls.error?.message);
    return { ok: true, degraded: true };
  }
  // All models 503/overloaded: fail OPEN for longer descriptive queries
  // (likely research), fail CLOSED for short chit-chat-like inputs.
  console.warn("[academicGuardrail] all models unavailable, heuristic fallback:", cls.error?.message);
  const words = text.split(/\s+/).filter(Boolean);
  const looksResearchy = words.length >= 4 && /[a-zA-Z]{3,}/.test(text);
  if (looksResearchy) return { ok: true, degraded: true };
  return { ok: false, message: INVALID_MESSAGE };
}

export { checkAcademicIntent, INVALID_MESSAGE };

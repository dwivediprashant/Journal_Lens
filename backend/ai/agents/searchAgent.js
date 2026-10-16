import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getGeminiModel, GEMINI_MODEL_LIST } from "../models/geminiModel.js";
import { openAlexSearchTool } from "../tools/openAlexTool.js";
import { AGENTIC_SEARCH_SYSTEM_INSTRUCTIONS } from "../prompts/openAlexDocs.js";
import { checkAcademicIntent, INVALID_MESSAGE } from "../guardrails/academicGuardrail.js";

const MAX_RETRIES = 3;
const OVERLOADED_MSG = "The AI model is temporarily overloaded. Please try again in a minute.";

// ---- Publisher resolution: map "IEEE publisher" -> source ID filter ----
const PUBLISHER_NAMES = [
  "ieee","elsevier","springer","springer nature","acm","wiley","wiley-blackwell",
  "taylor & francis","taylor and francis","sage","oxford","cambridge","mit press",
  "nature publishing group","emerald","kluwer","wolters kluwer","ieeexplore"
];

function detectPublisher(q) {
  const lower = q.toLowerCase();
  for (const p of PUBLISHER_NAMES) if (lower.includes(p)) return p;
  return null;
}

async function resolveSourceId(publisherName) {
  try {
    const raw = await openAlexSearchTool.invoke({
      entity: "sources", search: publisherName, per_page: 5, page: 1,
      open_access_only: false,
    });
    const parsed = JSON.parse(raw);
    if (parsed.ok && parsed.results && parsed.results.length > 0) {
      const id = parsed.results[0].id || "";
      const m = id.match(/([A-Z]\d+)$/);
      return m ? m[1] : null;
    }
  } catch { /* ignore */ }
  return null;
}

const prompt = ChatPromptTemplate.fromMessages([
  ["system", AGENTIC_SEARCH_SYSTEM_INSTRUCTIONS],
  ["placeholder", "{messages}"],
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function isRetryableLLMError(err) {
  return /503|502|429|overloaded|high demand|rate limit|temporar/i.test(String(err?.message || err || ""));
}

// Invoke the tool-bound chain, rotating fallback models + backoff on 503/429.
async function invokeChainResilient(messages) {
  let lastErr = null;
  for (const modelName of GEMINI_MODEL_LIST) {
    const chain = prompt.pipe(getGeminiModel(modelName).bindTools([openAlexSearchTool]));
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await chain.invoke({ messages });
      } catch (err) {
        lastErr = err;
        console.warn(`[searchAgent] ${modelName} attempt ${attempt} failed:`, String(err?.message || err).slice(0, 200));
        if (!isRetryableLLMError(err)) throw err;
        await sleep(1500 * attempt);
      }
    }
  }
  const e = new Error(OVERLOADED_MSG);
  e.status = 503;
  e.cause = lastErr;
  throw e;
}

function getToolCalls(aiMsg) {
  const tc = aiMsg?.tool_calls || aiMsg?.additional_kwargs?.tool_calls || [];
  return tc.map((c) => {
    if (c?.name && c?.args !== undefined) return { name: c.name, args: c.args, id: c.id };
    const fn = c?.function || {};
    let args = {};
    try { args = typeof fn.arguments === "string" ? JSON.parse(fn.arguments) : fn.arguments || {}; } catch { args = {}; }
    return { name: fn.name, args, id: c?.id };
  }).filter((c) => c.name);
}

function relaxFilter(filter) {
  if (!filter) return undefined;
  const parts = String(filter).split(",").map((s) => s.trim()).filter(Boolean);
  // NEVER drop the open-access guard during relaxation.
  const droppable = parts.filter((p) => !/^is_oa\s*:/i.test(p) && !/^open_access\.is_oa\s*:/i.test(p));
  if (droppable.length === 0) return undefined;
  if (parts.length <= 1) return undefined;
  droppable.pop();
  const keptOA = parts.filter((p) => /^is_oa\s*:/i.test(p) || /^open_access\.is_oa\s*:/i.test(p));
  return [...keptOA, ...droppable].join(",");
}

// A works result is only "real" if OpenAlex gave it an id + title.
// Anything else means the agent fabricated it — reject and retry.
function worksLookReal(results) {
  if (!Array.isArray(results) || results.length === 0) return false;
  const real = results.filter((r) => r?.id && r?.display_name && String(r.display_name).trim().length > 1);
  return real.length >= Math.max(1, Math.ceil(results.length / 2));
}

// Deterministic page fetch: re-executes a validated plan on any page
// WITHOUT invoking the LLM. Used by the pagination endpoint.
export async function fetchSearchPage(plan, page) {
  const { OpenAlexSearchSchema } = await import("../tools/openAlexTool.js");
  const parsed = OpenAlexSearchSchema.safeParse({ ...plan, page: Math.max(1, Number(page) || 1) });
  if (!parsed.success) {
    return { ok: false, status: 400, error: "Invalid saved search plan." };
  }
  const args = { ...parsed.data, per_page: Math.min(10, Number(parsed.data.count_requested ?? parsed.data.per_page ?? 10) || 10) };
  let raw = "";
  try {
    raw = await openAlexSearchTool.invoke(args);
  } catch (e) {
    return { ok: false, status: 502, error: String(e?.message || e) };
  }
  let out = {};
  try { out = JSON.parse(raw); } catch { out = { ok: false, status: 502, error: raw }; }
  if (!out.ok) return out;
  const perPage = args.per_page;
  return {
    ...out,
    page: args.page, perPage,
    totalPages: perPage > 0 ? Math.ceil((out.count ?? 0) / perPage) : 1,
    plan: { ...parsed.data, per_page: perPage },
  };
}

export async function runAgenticSearch(query, opts = {}) {
  const q = (query || "").trim();
  const requestedPage = Math.max(1, Number(opts.page) || 1);
  if (!q) return { ok: false, status: 400, error: INVALID_MESSAGE };

  // Reject negative numbers anywhere in the query (paper IDs are alphanumeric,
  // never negative, so this is safe for paper-id searches).
  if (/(^|\s)-\d+/.test(q)) {
    return { ok: false, status: 400, error: "Negative numbers are not allowed in search queries." };
  }

  // Reject explicit "N papers / articles / results" requests above 10.
  // This pattern requires a number immediately followed by a count word, so
  // standalone paper IDs like W2745879816 or "paper W2745879816" are NOT blocked.
  // Match "N papers" / "N articles" / "N results" allowing up to 3 words
  // between the number and the count word (e.g. "100 research papers",
  // "62767 papers"). Paper IDs like W2745879816 start with a letter so \b\d+\b
  // never matches them.
  const countMatch = q.match(/\b(\d+)\b(?:\s+\w+){0,3}\s*(papers|articles|records|results?)\b/i);
  if (countMatch) {
    const n = parseInt(countMatch[1], 10);
    if (n > 10) {
      return { ok: false, status: 400, error: "Maximum 10 papers allowed per search." };
    }
  }

  const gate = await checkAcademicIntent(q);
  if (!gate.ok) return { ok: false, status: 400, error: gate.message };
  const messages = [new HumanMessage(q)];
  let lastEndpoint = null;
  let attempts = 0;
  // Winning plan captured from the LLM's successful tool call, so page 2+
  // re-executes deterministically WITHOUT another LLM invocation.
  let plan = null;
  try {
    while (attempts <= MAX_RETRIES) {
      attempts += 1;
      const aiMsg = await invokeChainResilient(messages);
      messages.push(aiMsg);
      const calls = getToolCalls(aiMsg);
      if (calls.length === 0) {
        const text = String(aiMsg?.content || "").slice(0, 2000);
        return { ok: false, status: 422, error: text || "Agent did not emit a search tool call.", endpoint: lastEndpoint, attempts };
      }
      const call = calls[0];

      // Publisher enforcement: if the user asked for papers from a publisher
      // (IEEE, Elsevier, Springer, ACM, ...), force the works query to be
      // scoped to that publisher's OpenAlex source ID so results are NOT
      // broad keyword matches across all publishers.
      const publisher = detectPublisher(q);
      if (publisher && call.args?.entity === "works") {
        const hasSourceFilter = /(^|,)primary_location\.source\.(id|display_name)\s*:/i.test(call.args.filter || "");
        if (!hasSourceFilter) {
          const sourceId = await resolveSourceId(publisher);
          const sourceFilter = sourceId
            ? `primary_location.source.id:${sourceId}`
            : `primary_location.source.display_name.search:${publisher}`;
          call.args.filter = call.args.filter
            ? `${call.args.filter},${sourceFilter}`
            : sourceFilter;
          // Strip the publisher name from keywords so search stays topical.
          call.args.search = String(call.args.search || "").replace(new RegExp(publisher, "gi"), "").trim() || undefined;
        }
      }

      let raw = "";
      try {
        raw = await openAlexSearchTool.invoke(call.args);
      } catch (e) {
        raw = JSON.stringify({ ok: false, status: 0, endpoint: lastEndpoint, error: String(e?.message || e) });
      }
      messages.push(new ToolMessage(raw, call.id || `call-${attempts}`));
      let parsed = {};
      try { parsed = JSON.parse(raw); } catch { parsed = { ok: false, status: 0, error: raw }; }
      lastEndpoint = parsed.endpoint || lastEndpoint;
      const zero = parsed.ok && (parsed.count ?? 0) === 0;
      const httpErr = !parsed.ok;
      const lastTry = attempts > MAX_RETRIES;
      // Entity guard: paper requests must resolve to works. If the model
      // queried sources/authors/etc for a papers question, force a retry
      // on works instead of showing journals as "papers".
      const wantsPapers = /\b(papers?|articles?|publications?|titles?)\b/i.test(q);
      const gotNonWorks = parsed.ok && call.args?.entity && call.args.entity !== "works";
      if (parsed.ok && (parsed.count ?? 0) > 0 && wantsPapers && gotNonWorks && !lastTry) {
        messages.push(new HumanMessage(`Wrong entity: the user asked for PAPERS but you queried entity="${call.args.entity}" (${parsed.endpoint}). Re-emit openalex_search with entity="works", open_access_only=true, search keywords from "${q}", and per_page/count_requested matching any requested count. Attempt ${attempts}/${MAX_RETRIES + 1}.`));
        continue;
      }
      if (parsed.ok && (parsed.count ?? 0) > 0) {
        // Realness check for works: reject fabricated titles.
        if (call.args?.entity === "works" && !worksLookReal(parsed.results) && !lastTry) {
          messages.push(new HumanMessage(`Result validation failed: works results lack real OpenAlex id/display_name titles (${parsed.endpoint}). Do NOT invent titles. Re-query works with corrected search/filter and return only real tool results. Attempt ${attempts}/${MAX_RETRIES + 1}.`));
          continue;
        }
        // Capture the winning plan (strip page so pagination is explicit).
        plan = { ...call.args };
        delete plan.page;
        // Small-count requests (<=10): single fetch is the whole answer.
        const totalCount = parsed.count ?? 0;
        const perPage = Math.min(10, Number(plan.count_requested ?? plan.per_page ?? 10) || 10);
        const totalWanted = plan.count_requested ? Math.min(plan.count_requested, 100) : null;
        // Deterministic final fetch on the requested page.
        const finalArgs = { ...plan, per_page: perPage, page: requestedPage };
        let finalRaw = raw;
        if (requestedPage !== Number(call.args?.page || 1) || Number(call.args?.per_page) !== perPage) {
          try {
            finalRaw = await openAlexSearchTool.invoke(finalArgs);
          } catch (e) {
            finalRaw = JSON.stringify({ ok: false, status: 0, endpoint: lastEndpoint, error: String(e?.message || e) });
          }
        }
        let finalParsed = {};
        try { finalParsed = JSON.parse(finalRaw); } catch { finalParsed = { ok: false, status: 0, error: finalRaw }; }
        if (!finalParsed.ok) {
          return { ok: false, status: finalParsed.status || 502, error: finalParsed.error || "OpenAlex request failed.", endpoint: finalParsed.endpoint || lastEndpoint, attempts };
        }
        const totalPages = perPage > 0 ? Math.ceil((finalParsed.count ?? 0) / perPage) : 1;
        return {
          ok: true, status: 200,
          endpoint: finalParsed.endpoint, count: finalParsed.count, meta: finalParsed.meta,
          results: finalParsed.results, attempts,
          page: requestedPage, perPage,
          totalPages, totalWanted,
          plan,
        };
      }
      if (zero && !lastTry) {
        const relaxed = relaxFilter(call.args?.filter);
        messages.push(new HumanMessage(`Zero results (meta.count===0) at ${parsed.endpoint}. Relax: drop restrictive filters${relaxed ? ` (try filter=${relaxed})` : ""} or broaden keywords, then re-emit openalex_search. Attempt ${attempts}/${MAX_RETRIES + 1}.`));
        continue;
      }
      if (zero) return { ok: true, status: 200, endpoint: parsed.endpoint, count: 0, meta: parsed.meta, results: [], note: "No records found after relaxation.", attempts };
      if (httpErr && !lastTry) {
        messages.push(new HumanMessage(`HTTP ${parsed.status} error: ${parsed.error}. Endpoint: ${parsed.endpoint}. Original query: ${q}. Fix syntax per docs, re-emit openalex_search. Attempt ${attempts}/${MAX_RETRIES + 1}.`));
        continue;
      }
      return { ok: false, status: parsed.status || 502, error: parsed.error || "OpenAlex request failed.", endpoint: parsed.endpoint, attempts };
    }
  } catch (err) {
    // Gemini-wide outage -> clean 503, never a crash.
    return { ok: false, status: err?.status || 503, error: err?.status === 503 ? OVERLOADED_MSG : (err?.message || "Agent failure"), endpoint: lastEndpoint, attempts };
  }
  return { ok: false, status: 502, error: "Max retries exceeded.", endpoint: lastEndpoint, attempts };
}

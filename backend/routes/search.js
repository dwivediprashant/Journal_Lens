import express from "express";
const router = express.Router();

import { openAlexSearchTool } from "../ai/tools/openAlexTool.js";
import { parseNaturalQuery } from "../ai/parsers/queryParser.js";

// POST /api/search  { query, page? } -> validated, structured OpenAlex search.
// One AI call parses/validates the natural query; rules are enforced here;
// then the OpenAlex endpoint is built deterministically from the parsed JSON.
async function handleSearch(req, res) {
  const { query, page, plan } = req.body || {};
  const pageNum = Math.max(1, Number(req.query.page || page) || 1);

  // LLM-free pagination when a validated plan is supplied.
  if (plan && (!query || !String(query).trim())) {
    const { fetchSearchPage } = await import("../ai/agents/searchAgent.js");
    const result = await fetchSearchPage(plan, pageNum);
    if (!result.ok) {
      return res.status(result.status || 500).json({ success: false, error: result.error || "Agent failure" });
    }
    return res.status(200).json({
      success: true, endpoint: result.endpoint, count: result.count, meta: result.meta,
      papers: result.results, data: { results: result.results, meta: result.meta },
      page: result.page, perPage: result.perPage, totalPages: result.totalPages,
      plan: result.plan, cached: true,
    });
  }

  if (!query || !String(query).trim()) {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  try {
    // ── STEP 1: single AI call → structured JSON (validation + extraction) ──
    const parsed = await parseNaturalQuery(query);
    if (!parsed.ok) {
      const status = parsed.status || 500;
      return res.status(status).json({ success: false, error: parsed.error || "Query parsing failed" });
    }

    const p = parsed.value;

    // ── STEP 2: enforce rules on the structured JSON ──
    if (!p.isValid) {
      return res.status(400).json({
        success: false, error: p.reason || "Invalid query.",
        intent: p.intent, field: p.field, publisher: p.publisher,
      });
    }

    if (!p.field || !String(p.field).trim()) {
      return res.status(400).json({
        success: false, error: "Please mention your field of interest (e.g., AIML, GenAI, civil, mechanical).",
        intent: p.intent, publisher: p.publisher,
      });
    }

    if (p.count === 0) {
      return res.status(400).json({
        success: false, error: "Number of papers must be between 1 and 10.",
        intent: p.intent, field: p.field, publisher: p.publisher,
      });
    }
    const count = Math.min(10, Math.max(1, Number(p.count) || 5));

    // ── STEP 3: resolve publisher name → source ID if mentioned ──
    let sourceFilter = "";
    if (p.publisher && String(p.publisher).trim()) {
      const srcRaw = await openAlexSearchTool.invoke({
        entity: "sources",
        search: p.publisher,
        per_page: 1,
        page: 1,
        open_access_only: false,
      });
      const src = JSON.parse(srcRaw);
      if (src.ok && src.results?.[0]?.ids?.openalex) {
        const m = String(src.results[0].ids.openalex).match(/([A-Z]\d+)$/);
        if (m) sourceFilter = `primary_location.source.id:${m[1]}`;
      }
    }

    // ── STEP 4: build OpenAlex endpoint deterministically ──
    const filterParts = ["is_oa:true"];
    if (sourceFilter) filterParts.push(sourceFilter);

    const result = await openAlexSearchTool.invoke({
      entity: "works",
      search: p.field,
      filter: filterParts.join(","),
      per_page: count,
      page: pageNum,
      open_access_only: true,
      count_requested: count,
    });

    const data = JSON.parse(result);
    if (!data.ok) {
      return res.status(data.status || 500).json({
        success: false, error: data.error || "OpenAlex search failed",
        endpoint: data.endpoint,
      });
    }

    // ── STEP 5: return papers ──
    return res.status(200).json({
      success: true,
      endpoint: data.endpoint,
      count: data.count,
      meta: data.meta,
      papers: data.results,
      data: { results: data.results, meta: data.meta },
      page: data.page ?? pageNum,
      perPage: data.perPage ?? count,
      totalPages: Math.ceil((data.meta?.count ?? 0) / count),
      totalWanted: count,
      parsed: { publisher: p.publisher, field: p.field, count, intent: p.intent },
    });
  } catch (error) {
    console.log("[search]", error?.message || error);
    return res.status(500).json({ success: false, error: "Search failed" });
  }
}

router.post("/", handleSearch);
router.post("/page", handleSearch);

export default router;

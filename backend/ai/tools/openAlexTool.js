import axios from "axios";
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const BASE = process.env.OPENALEX_BASE_URL || "https://api.openalex.org";
const KEY = process.env.OPENALEX_API_KEY;

export const OpenAlexSearchSchema = z.object({
  entity: z.enum(["works", "authors", "sources", "institutions", "topics"]),
  search: z.string().max(300).optional(),
  filter: z.string().max(1000).optional(),
  sort: z.string().max(200).optional(),
  select: z.string().max(500).optional(),
  per_page: z.number().int().min(1).max(25).default(10),
  page: z.number().int().min(1).default(1),
  group_by: z.string().max(200).optional(),
  // When entity=works: only open-access works are returned unless the user
  // explicitly asks otherwise (open_access_only=false).
  open_access_only: z.boolean().default(true),
  // Honour "I need N papers" style requests. Capped by per_page max (25).
  count_requested: z.number().int().min(1).max(10).optional(),
});

export function buildOpenAlexUrl(p) {
  const url = new URL(`${BASE}/${p.entity}`);
  if (p.search) url.searchParams.set("search", p.search);
  // Default open-access enforcement for paper queries. The LLM is told the
  // same rule, but the backend merges it in so it holds even if the model
  // forgets — unless open_access_only=false is passed explicitly.
  let filter = p.filter || "";
  if (p.entity === "works" && p.open_access_only !== false) {
    const hasOA = /(^|,)is_oa\s*:/i.test(filter) || /(^|,)open_access\.is_oa\s*:/i.test(filter);
    if (!hasOA) filter = filter ? `${filter},is_oa:true` : "is_oa:true";
  }
  if (filter) url.searchParams.set("filter", filter);
  if (p.sort) url.searchParams.set("sort", p.sort);
  if (p.select) url.searchParams.set("select", p.select);
  if (p.group_by) url.searchParams.set("group_by", p.group_by);
  // Honour "I need N papers" — per_page follows count_requested when set,
  // but page-sized fetches are capped at 10 so navigation stays 10 per page.
  const perPage =
    p.entity === "works"
      ? Math.min(10, p.count_requested ?? p.per_page ?? 10)
      : p.per_page ?? 10;
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(p.page ?? 1));
  if (KEY) url.searchParams.set("api_key", KEY);
  return url.toString();
}

export function redactApiKey(url) {
  try {
    const u = new URL(url);
    if (u.searchParams.has("api_key")) u.searchParams.set("api_key", "***");
    return u.toString();
  } catch { return url; }
}

function slim(r, entity) {
  if (entity === "works") {
    return { id: r.id, display_name: r.display_name, title: r.title ?? r.display_name, publication_year: r.publication_year, publication_date: r.publication_date, cited_by_count: r.cited_by_count, doi: r.doi, type: r.type, open_access: r.open_access, primary_location: r.primary_location, authorships: (r.authorships || []).slice(0, 10).map((a) => ({ author: { id: a?.author?.id, display_name: a?.author?.display_name }, institutions: (a?.institutions || []).map((i) => i?.display_name).filter(Boolean) })), primary_topic: r.primary_topic ? { id: r.primary_topic.id, display_name: r.primary_topic.display_name } : undefined, abstract_inverted_index: r.abstract_inverted_index };
  }
  return { id: r.id, display_name: r.display_name, works_count: r.works_count, cited_by_count: r.cited_by_count, ids: r.ids };
}

export const openAlexSearchTool = tool(
  async (input) => {
    const parsed = OpenAlexSearchSchema.parse(input);
    const url = buildOpenAlexUrl(parsed);
    try {
      const res = await axios.get(url, { timeout: 25000 });
      const data = res.data;
      const results = data?.results ?? (data?.id ? [data] : []);
      const count = data?.meta?.count ?? results.length;
      return JSON.stringify({ ok: true, status: 200, endpoint: redactApiKey(url), count, meta: data?.meta ?? null, results: results.slice(0, 25).map((r) => slim(r, parsed.entity)) });
    } catch (err) {
      const status = err?.response?.status ?? 0;
      const raw = err?.response?.data?.error || err?.response?.data?.message || err?.response?.data || err?.message || "network error";
      const msg = typeof raw === "string" ? raw.slice(0, 2000) : JSON.stringify(raw).slice(0, 2000);
      return JSON.stringify({ ok: false, status, endpoint: redactApiKey(url), error: msg });
    }
  },
  {
    name: "openalex_search",
    description: "Query OpenAlex academic API base https://api.openalex.org. Params: entity works|authors|sources|institutions|topics, search keywords, filter e.g. publication_year:>2023,is_oa:true, sort e.g. cited_by_count:desc, select, per_page 1-25, page. Rules: default works; resolve NAMES to IDs first via entity search then filter works by ID (authorships.author.id:A...). Comma AND pipe OR ! NOT. Never /text concepts host_venue author_name. Backend executes HTTPS and returns ok/status/endpoint/count/results or ok:false/status/endpoint/error for self-correction.",
    schema: OpenAlexSearchSchema,
  }
);

import { useState } from "react";
import styles from "./AIJournalFinder.module.css";
import apiClient from "../../../configs/apiClient.js";
import RotatingSquareLoader from "../../loaders/RotatingSquareLoader.jsx";
import DetailCard from "../../researchCard/DetailCard";
import JournalCard from "../Providers_journals/Providers_papers/journal_card/JournalCard";
import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";

const PER_PAGE = 10;

// Backend returns { endpoint, count, papers, page, perPage, totalPages, plan }
// plus legacy aiResponse string. Normalise every shape.
function parsePayload(data, fallbackPage) {
  if (!data) return null;
  const papers = data.papers || data?.data?.results || [];
  if (
    Array.isArray(papers) &&
    (papers.length > 0 || data.endpoint || data.count !== undefined)
  ) {
    return {
      endpoint: data.endpoint || "",
      count: data.count ?? papers.length,
      papers,
      page: data.page ?? fallbackPage ?? 1,
      perPage: data.perPage ?? PER_PAGE,
      totalPages: data.totalPages ?? 1,
      totalWanted: data.totalWanted ?? null,
      plan: data.plan || null,
    };
  }
  if (
    typeof data.aiResponse === "string" &&
    data.aiResponse.trim().startsWith("{")
  ) {
    try {
      const j = JSON.parse(data.aiResponse);
      const pj = j.results || j.papers || [];
      if (Array.isArray(pj))
        return {
          endpoint: j.endpoint || "",
          count: j.count ?? pj.length,
          papers: pj,
          page: fallbackPage ?? 1,
          perPage: PER_PAGE,
          totalPages: 1,
          totalWanted: null,
          plan: null,
        };
    } catch {
      /* fall through to raw */
    }
  }
  if (typeof data.aiResponse === "string") return { raw: data.aiResponse };
  return null;
}

function isWork(item) {
  return Boolean(
    item?.authorships ||
    item?.primary_location ||
    item?.publication_year !== undefined ||
    item?.abstract_inverted_index,
  );
}

function isSource(item) {
  return Boolean(
    item?.ids?.issn_l ||
    item?.issn_l ||
    (item?.works_count !== undefined && !item?.authorships),
  );
}

function SourceCard({ item }) {
  const issn = item?.ids?.issn_l || item?.issn_l || "";
  const homepage = item?.homepage_url || "";
  return (
    <JournalCard
      display_name={item?.display_name || "Untitled"}
      searchTerm=""
      issn_l={issn}
      works_count={item?.works_count ?? 0}
      cited_by_count={item?.cited_by_count ?? 0}
      summary_stats={item?.summary_stats ?? {}}
      apc_usd={item?.apc_usd ?? ""}
      homepage_url={homepage}
      is_oa={item?.is_oa ?? false}
    />
  );
}

function renderItem(item, idx) {
  const key = item?.id || idx;
  if (isWork(item)) return <DetailCard key={key} paper={item} />;
  if (isSource(item)) return <SourceCard key={key} item={item} />;
  return <DetailCard key={key} paper={item} />;
}
// Reject negative numbers (paper IDs are alphanumeric, never negative).
const NEGATIVE_NUM = /(^|\s)-\d+/;
// Reject explicit "N papers / articles / results" requests above 10.
// Allows up to 3 words between the number and count word
// (e.g. "100 research papers", "62767 papers"). Paper IDs like
// W2745879816 start with a letter so \b\d+\b never matches them.
const COUNT_REQUEST = /\b(\d+)\b(?:\s+\w+){0,3}\s*(papers|articles|records|results?)\b/i;

function validateQuery(q) {
  const trimmed = q.trim();
  if (!trimmed) return "Please enter a search query.";
  if (NEGATIVE_NUM.test(trimmed)) return "Negative numbers are not allowed in search queries.";
  const m = trimmed.match(COUNT_REQUEST);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n === 0) return "Number of papers must be between 1 and 10.";
    if (n > 10) return "Maximum 10 papers allowed per search.";
  }
  return null;
}

export default function JournalFinder() {
  const { getToken } = useAuth();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [plan, setPlan] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const handleSearchButtonClick = async () => {
    const v = validateQuery(query);
    if (v) {
      setSubmitError(v);
      setSubmittedQuery("");
      return;
    }
    setSubmitError("");
    setPlan(null);
    setPageNum(1);
    setSubmittedQuery(query.trim());
  };

  // No caching for AI finder: every search fetches fresh from the backend.
  const searchQuery = useQuery({
    queryKey: ["ai-finder", submittedQuery, pageNum],
    queryFn: async () => {
      const token = await getToken();
      const isPaged = pageNum > 1 && plan;
      const res = await apiClient({
        method: "POST",
        url: isPaged ? "/aijournalfinder/page" : "/aijournalfinder",
        data: isPaged ? { plan, page: pageNum } : { query: submittedQuery },
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = parsePayload(res.data, pageNum);
      if (!parsed) throw new Error("No results returned.");
      if (parsed.plan) setPlan(parsed.plan);
      return parsed;
    },
    enabled: !!submittedQuery,
  });

  const result = searchQuery.data || null;
  const error = submitError || (searchQuery.isError ? searchQuery.error?.response?.data?.error || searchQuery.error?.message || "Request failed." : "");
  const loader = searchQuery.isLoading || searchQuery.isFetching;

  return (
    <div className={styles["journal-finder"]}>
      <div className={`${styles["search-input"]} p-2 w-full`}>
        <div className="w-[70%] flex">
          <textarea
            placeholder="What you want to find describe in your words ..."
            className="border outline-none px-4 w-[100%] rounded-md bg-white text-gray-800"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            cols={100}
            rows={5}
          />
        </div>
        <button
          disabled={loader}
          onClick={handleSearchButtonClick}
          className={styles.sendButton}
        >
          Find <i className="fa-solid fa-paper-plane ms-1"></i>
        </button>
      </div>

      <div className={`${styles["ai-chat-interface"]} w-full max-w-[1100px]`}>
        {searchQuery.isLoading || searchQuery.isFetching ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <RotatingSquareLoader />
            <span className="text-xs text-gray-500 uppercase tracking-wider">Searching…</span>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg border border-red-200 text-red-700 text-sm p-4 w-full text-center">
            {error}
          </div>
        ) : result?.papers ? (
          <div className="w-full flex flex-col gap-4">
            <div className={`${styles["results-scroll"]} w-full`}>
              {result.papers.length > 0 ? (
                result.papers.map(renderItem)
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-sm text-gray-500 italic">
                  No records found.
                </div>
              )}
            </div>
          </div>
        ) : result?.raw ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4 w-full">
            <div
              className={`${styles["results-scroll"]} text-sm text-gray-700 whitespace-pre-wrap break-words`}
            >
              {result.raw}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8">
            <img
              src="/media/fields/business.png"
              alt="Search illustration"
              className="w-32 h-32 object-cover rounded-lg opacity-90"
            />
            <span className="italic text-gray-500 text-sm">
              Results will appear here.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

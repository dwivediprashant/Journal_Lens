import React from "react";
import "./JournalCard.css";
import { useNavigate } from "react-router";
import TopHeader from "./top-header-journal-card/TopHeader";

export default function JournalCard({
  display_name,
  searchTerm = "",
  issn_l,
  works_count,
  cited_by_count,
  summary_stats,
  apc_usd,
  homepage_url,
  is_oa,
}) {
  const navigate = useNavigate();

  const handleSeePapersClick = () => {
    const params = new URLSearchParams({
      display_name: display_name || "",
      works_count: String(works_count ?? ""),
      cited_by_count: String(cited_by_count ?? ""),
      apc_usd: String(apc_usd ?? ""),
      is_oa: String(Boolean(is_oa)),
      summary_stats: JSON.stringify(summary_stats ?? {}),
    });

    navigate(`/providers/seepapers/${issn_l}?${params.toString()}`);
  };

  return (
    <>
      <div className="journal-card">
        <div>
          <TopHeader
            display_name={display_name}
            searchTerm={searchTerm}
            issn_l={issn_l}
            works_count={works_count}
            cited_by_count={cited_by_count}
            summary_stats={summary_stats}
            apc_usd={apc_usd}
            is_oa={is_oa}
          />
        </div>
        <div className="journal-card-footer">
          {homepage_url ? (
            <a
              className="journal-card-link"
              href={homepage_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to website
              <i className="fa-solid fa-arrow-up-right-from-square ms-3"></i>
            </a>
          ) : (
            <span className="journal-card-empty">Homepage not available</span>
          )}
          <button
            className="ms-6 journal-card-link"
            onClick={handleSeePapersClick}
          >
            See papers <i className="fa-solid fa-eye ms-3"></i>
          </button>
        </div>
      </div>
    </>
  );
}

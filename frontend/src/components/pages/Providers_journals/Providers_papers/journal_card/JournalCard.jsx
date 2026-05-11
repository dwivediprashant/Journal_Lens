import React from "react";
import "./JournalCard.css";

export default function JournalCard({
  display_name,
  issn_l,
  works_count,
  cited_by_count,
  summary_stats,
  apc_usd,
  homepage_url,
  is_oa,
}) {
  const summaryStatsList = Object.entries(summary_stats ?? {});

  return (
    <div className="journal-card">
      <div className="journal-card-header">
        <h4 className="journal-card-title">{display_name || "Untitled"}</h4>
        <span className="open-access-status-badge">
          {is_oa ? (
            <img src="/media/check.png" alt="yes-open-access" />
          ) : (
            <img src="/media/wrongcheck.png" alt="not-open-access" />
          )}
        </span>
      </div>

      <div className="journal-card-body">
        <div className="journal-card-row">
          <span className="journal-card-label">ISSN</span>
          <span className="journal-card-value">
            {issn_l || "Not available"}
          </span>
        </div>

        <div className="journal-card-row">
          <span className="journal-card-label">Works count</span>
          <span className="journal-card-value">{works_count ?? 0}</span>
        </div>

        <div className="journal-card-row">
          <span className="journal-card-label">Cited by</span>
          <span className="journal-card-value">{cited_by_count ?? 0}</span>
        </div>

        <div className="journal-card-row">
          <span className="journal-card-label">APC USD</span>
          <span className="journal-card-value">
            {apc_usd ? <span>&#36; {apc_usd}</span> : "Not available"}
          </span>
        </div>

        <div className="journal-card-section">
          <div className="journal-card-subtitle">Summary stats</div>
          {summaryStatsList.length > 0 ? (
            <div className="journal-summary-list">
              {summaryStatsList.map(([key, value]) => (
                <div className="journal-summary-item" key={key}>
                  <span className="journal-card-label">{key}</span>
                  <span className="journal-card-value">
                    {typeof value === "object" ? JSON.stringify(value) : value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="journal-card-empty">No summary stats available.</p>
          )}
        </div>
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
      </div>
    </div>
  );
}

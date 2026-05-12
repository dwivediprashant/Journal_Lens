import React from "react";
import "../JournalCard.css";

export default function TopHeader({
  display_name,
  searchTerm,
  issn_l,
  works_count,
  cited_by_count,
  summary_stats,
  apc_usd,
  is_oa,
}) {
  const twoYearMeanCitedness = summary_stats?.["2yr_mean_citedness"];
  const hIndex = summary_stats?.h_index;
  const i10Index = summary_stats?.i10_index;

  const renderHighlightedTitle = () => {
    const title = display_name || "Untitled";
    const term = searchTerm.trim();

    if (!term) {
      return title;
    }

    const lowerTitle = title.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const matchIndex = lowerTitle.indexOf(lowerTerm);

    if (matchIndex === -1) {
      return title;
    }

    const beforeMatch = title.slice(0, matchIndex);
    const matchedText = title.slice(matchIndex, matchIndex + term.length);
    const afterMatch = title.slice(matchIndex + term.length);

    return (
      <>
        {beforeMatch}
        <span className="journal-title-highlight">{matchedText}</span>
        {afterMatch}
      </>
    );
  };

  return (
    <div className="top-header">
      <div className="journal-card-header">
        <span className="journal-card-title">{renderHighlightedTitle()}</span>
        <span className="open-access-status-badge">
          {is_oa ? (
            <img src="/media/check.png" alt="yes-open-access" />
          ) : (
            <img src="/media/wrongcheck.png" alt="not-open-access" />
          )}
        </span>
      </div>

      <div className="journal-card-body">
        <table className="journal-card-table">
          <tbody>
            <tr>
              <td className="journal-card-label">ISSN :</td>
              <td className="journal-card-value">
                {issn_l || "Not available"}
              </td>
            </tr>
            <tr>
              <td className="journal-card-label">Works count :</td>
              <td className="journal-card-value">{works_count ?? 0}</td>
            </tr>
            <tr>
              <td className="journal-card-label">Cited by :</td>
              <td className="journal-card-value">{cited_by_count ?? 0}</td>
            </tr>
            <tr>
              <td className="journal-card-label">
                Article Processing charge :
              </td>
              <td className="journal-card-value">
                {apc_usd ? <span>&#36; {apc_usd}</span> : "Not available"}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="journal-card-section">
          {twoYearMeanCitedness !== undefined ||
          hIndex !== undefined ||
          i10Index !== undefined ? (
            <div className="journal-summary-list">
              <div className="journal-summary-item">
                <span className="journal-card-label">Influence :</span>
                <span className="journal-card-value journal-card-value-italic">
                  {twoYearMeanCitedness ?? "-"}
                </span>
              </div>
              <div className="journal-summary-item">
                <span className="journal-card-label">Impact score :</span>
                <span className="journal-card-value journal-card-value-italic">
                  {hIndex ?? "-"}
                </span>
              </div>
              <div className="journal-summary-item">
                <span className="journal-card-label">Cited papers :</span>
                <span className="journal-card-value journal-card-value-italic">
                  {i10Index ?? "-"}
                </span>
              </div>
            </div>
          ) : (
            <p className="journal-card-empty">No summary stats available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

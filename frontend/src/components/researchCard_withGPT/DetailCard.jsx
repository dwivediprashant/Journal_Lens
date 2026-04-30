import "./DetailCard.css";

export default function DetailCard({ paper, onOpenChat }) {
  const title = paper?.display_name ?? "Untitled";

  const authors =
    paper?.authorships
      ?.map((a) => a?.author?.display_name)
      .filter(Boolean)
      .join(", ") || "Authors unavailable";

  const year = paper?.publication_year ?? "";

  const source =
    paper?.primary_location?.source?.host_organization_lineage_name ??
    paper?.primary_location?.source?.host_organization_name ??
    "Unknown source";

  const websiteUrl = paper?.primary_location?.landing_page_url ?? "";

  const pdfUrl = paper?.open_access?.oa_url ?? "";

  const topics = [
    paper?.primary_topic?.display_name,
    paper?.primary_topic?.subfield?.display_name,
    paper?.primary_topic?.field?.display_name,
  ].filter(Boolean);

  return (
    <div className="detail-card-wrapper bg-gray-300">
      <div className="detail-wrap">
        <div className="field-block rounded-lg">
          <div className="title text-center">{title}</div>
        </div>

        <div className="px-3 bg-gray-100 py-3">
          <div className="field-block">
            <div className="field-label">Authors</div>
            <div className="authors">{authors}</div>
          </div>

          <div className="field-block">
            <div className="field-label">Publication Year</div>
            {year ? (
              <div className="year">{year}</div>
            ) : (
              <div className="year">Not available</div>
            )}
          </div>

          <div className="field-block">
            <div className="field-label">Source / Publisher</div>
            <div className="source">{source}</div>
          </div>

          <div className="field-block topics-block">
            <div className="field-label">Related Topics</div>
            <div className="topics">
              {topics.length > 0 ? (
                topics.map((t) => (
                  <span key={t} className="topic-pill">
                    {t}
                  </span>
                ))
              ) : (
                <span className="topic-pill empty">No topics</span>
              )}
            </div>
          </div>
        </div>

        <div className="detail-card-btn">
          <button id="robot" onClick={onOpenChat}>
            <i className="fa-solid fa-robot"></i>
          </button>

          <button
            disabled={!websiteUrl}
            onClick={() => {
              if (websiteUrl) {
                window.open(websiteUrl, "_blank", "noopener,noreferrer");
              }
            }}
          >
            Go to website
          </button>
          <button
            onClick={() => {
              if (pdfUrl) {
                window.open(pdfUrl, "_blank", "noopener,noreferrer");
              }
            }}
          >
            View pdf
          </button>
        </div>
      </div>
    </div>
  );
}

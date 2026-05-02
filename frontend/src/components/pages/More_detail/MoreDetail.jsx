import "./MoreDetail.css";
import { useState } from "react";
import { useLocation } from "react-router";
import ChatBot from "../../ChatBot/ChatBot";
export default function MoreDetail() {
  const location = useLocation();
  const paper = location.state?.paper;
  const logoUrl = location.state?.logoUrl;
  const parsedAbstract = location.state?.parsedAbstract;
  const [isChatOpen, setIsChatOpen] = useState(false);

  const title = paper?.display_name ?? "Untitled";
  const authors =
    paper?.authorships
      ?.map((author) => author?.author?.display_name)
      .filter(Boolean)
      .join(", ") || "Authors unavailable";
  const year = paper?.publication_year ?? "";
  const source =
    paper?.primary_location?.source?.host_organization_lineage_name ??
    paper?.primary_location?.source?.host_organization_name ??
    "Unknown source";
  const websiteUrl = paper?.primary_location?.landing_page_url ?? "";
  const pdfUrl =
    paper?.primary_location?.pdf_url || paper?.open_access?.oa_url || "";
  const isOpenAccess = paper?.open_access?.is_oa || "";
  const openAcessStatus = paper?.open_access?.oa_status || "";
  const topics = [
    paper?.primary_topic?.display_name,
    paper?.primary_topic?.subfield?.display_name,
    paper?.primary_topic?.field?.display_name,
  ].filter(Boolean);

  const handleOpenWebsite = () => {
    if (websiteUrl) {
      window.open(websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="more-detail-page">
      <div className="more-detail-shell">
        <div className="more-detail-card">
          <div className="more-detail-top">
            <div className="more-detail-logo-wrap">
              <img
                src={logoUrl}
                alt="source logo"
                className="more-detail-logo"
              />
            </div>

            <div className="flex flex-col">
              <div className="more-detail-header">
                <h1>{title}</h1>
              </div>
              <div>
                <span className="text-blue-800">
                  <i className="fa-solid fa-user "></i> Authors :
                </span>{" "}
                {authors}
              </div>
              <div>
                <span className="text-blue-800">
                  <i className="fa-solid fa-calendar-days "></i> Publication
                  year :
                </span>{" "}
                {year}
              </div>
              <div>
                <span className="text-blue-800">
                  <i className="fa-solid fa-globe"></i> Open access status :
                </span>{" "}
                {openAcessStatus ? openAcessStatus : ""}
              </div>
              <div>
                <span className="text-blue-800">
                  <i className="fa-solid fa-globe"></i> Open access :
                </span>{" "}
                {isOpenAccess ? "Yes" : "No"}
              </div>
              <div>
                <span className="text-blue-800">
                  <i className="fa-solid fa-tag"></i> Source / Publisher :
                </span>{" "}
                {source}
              </div>
            </div>
          </div>

          <div className="more-detail-abstract">
            <span className="font-semibold ">ABSTRACT : </span>
            <p>{parsedAbstract || "Abstract not available."}</p>
          </div>

          <div className="more-topics">
            <span className="font-semibold uppercase">Related topics : </span>
            <div className="topics-row">
              {topics.length > 0 ? (
                topics.map((topic) => (
                  <span key={topic} className="topic-pill">
                    {topic}
                  </span>
                ))
              ) : (
                <span className="topic-pill empty">No topics</span>
              )}
            </div>
          </div>

          <div className="more-detail-footer">
            <button onClick={handleOpenWebsite} disabled={!websiteUrl}>
              Go to website
              <i className="fa-solid fa-arrow-up-right-from-square ms-3"></i>
            </button>
            <button onClick={handleOpenPdf} disabled={!pdfUrl}>
              View pdf <i className="fa-solid fa-eye ms-3 fa-sm"></i>
            </button>
            <button onClick={() => setIsChatOpen(true)}>
              Ask AI<i className="fa-solid fa-robot ms-3 fa-lg"></i>
            </button>
          </div>
        </div>
      </div>
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

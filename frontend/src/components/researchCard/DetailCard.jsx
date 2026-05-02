import "./DetailCard.css";
import ParseAbstract from "../utils/ParseAbstract";
import getCompanyLogo from "../utils/CompanyLogo";
import { useNavigate, useParams } from "react-router";
import React from "react";

export default function DetailCard({
  paper,
  onOpenChat,
  backendAuthorName = "",
}) {
  const title = paper?.display_name ?? "Untitled";

  const abstract = paper?.abstract_inverted_index || "";
  const parsedAbstract = ParseAbstract(abstract);
  const authors =
    paper?.authorships?.map((a) => a?.author?.display_name).filter(Boolean) ||
    [];

  const year = paper?.publication_year ?? "";

  const source =
    paper?.primary_location?.source?.host_organization_lineage_name ??
    paper?.primary_location?.source?.host_organization_name ??
    "Unknown source";

  const websiteUrl = paper?.primary_location?.landing_page_url ?? "";

  const pdfUrl =
    paper?.primary_location?.pdf_url || paper?.open_access?.oa_url || "";
  const isOpenAccess = paper?.open_access?.is_oa || false;

  let domain = "";

  try {
    domain = pdfUrl.length > 0 ? new URL(pdfUrl).hostname : "";
  } catch {
    domain = "";
  }
  const logoUrl = getCompanyLogo({
    domain: domain.length > 0 ? domain : "openalex.org",
  });

  const topics = [
    paper?.primary_topic?.display_name,
    paper?.primary_topic?.subfield?.display_name,
    paper?.primary_topic?.field?.display_name,
  ].filter(Boolean);

  //handle more click
  const navigate = useNavigate();
  const { id } = useParams();

  const handleMoreClick = () => {
    navigate(`/journals/${id}/details`, {
      state: { paper, logoUrl, parsedAbstract },
    });
  };

  return (
    <div className="detail-card-wrapper bg-gray-300">
      <div className="detail-wrap">
        <div className="field-block rounded-lg">
          <div className="title text-center">
            <i className="fa-solid fa-tag fa-sm"></i> &nbsp;{title}
          </div>
        </div>
        <div className="field-block">
          <div className="field-label">
            <i className="fa-solid fa-book"></i> Source details
          </div>

          <div className="flex  w-full">
            <div>
              <img src={logoUrl} alt="company-logo" className="company-logo" />
              <div className=" text-gray-600 text-xs italic">HOST LOGO</div>
            </div>
            <div className="flex flex-col">
              <div className="ms-3">
                <span className="text-blue-800">Source</span> : {source}
              </div>
              <div className="ms-3">
                <span className="text-blue-800">Hosted at : </span>
                {domain.length > 0 ? (
                  <a
                    className="cursor-pointer underline hover:text-blue-600"
                    href={`https://${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {domain}{" "}
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                ) : (
                  <span className="text-red-600">Not found</span>
                )}
              </div>
              <div className="ms-3 oa-status mt-3">
                <span className="text-blue-800">Open access status : </span>
                {isOpenAccess ? (
                  <span className="">
                    <img src="/media/check.png" alt="" />
                  </span>
                ) : (
                  <span className="">
                    <img src="/media/wrongcheck.png" alt="" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="px-3 bg-gray-100 py-3 w-[100%]">
          <div className="field-block">
            <div className="field-label">
              <i className="fa-solid fa-user"></i> Authors
            </div>
            <div className="authors">
              {authors.map((name, index) => {
                return (
                  <React.Fragment key={index}>
                    <span
                      key={name}
                      className={
                        name.toLowerCase() === backendAuthorName.toLowerCase()
                          ? "highlight"
                          : ""
                      }
                    >
                      {name}
                    </span>
                    {index < authors.length - 1 && ", "}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="field-block">
            <div className="field-label">
              <i className="fa-solid fa-calendar-days"></i> Publication Year
            </div>
            {year ? (
              <div className="year">{year}</div>
            ) : (
              <div className="year">Not available</div>
            )}
          </div>

          <div className="field-block">
            <div className="field-label">
              <i className="fa-solid fa-link"></i> Linked Topics
            </div>
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
          <button
            disabled={!websiteUrl}
            onClick={() => {
              if (websiteUrl) {
                window.open(websiteUrl, "_blank", "noopener,noreferrer");
              }
            }}
          >
            Go to website{" "}
            <i className="fa-solid fa-arrow-up-right-from-square ms-3"></i>
          </button>
          <button
            onClick={() => {
              if (pdfUrl) {
                window.open(pdfUrl, "_blank", "noopener,noreferrer");
              }
            }}
          >
            View pdf<i className="fa-solid fa-eye ms-3"></i>
          </button>
          <button className="flex items-center" onClick={handleMoreClick}>
            More details <i className="fa-solid fa-arrow-right ms-3"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "./ProvidersJournals.css";
import apiClient from "../../../configs/apiClient";
import { useQuery } from "@tanstack/react-query";
import ProgressBarLoader from "../../loaders/ProgressBarLoader";
import { useAuth } from "@clerk/react";
import { getCompanyLogoByName } from "../../utils/CompanyLogo";

import CountsByYear from "../../CountsByYear/CountsByYear";
import ProvidersPaper from "./Providers_papers/ProvidersPaper";

export default function ProvidersJournals() {
  const [page, setPage] = useState(1);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [journalSearchTerm, setJournalSearchTerm] = useState("");
  const { getToken } = useAuth();

  const fetchProviders = async ({ queryKey }) => {
    const [, currentPage] = queryKey;

    try {
      const token = await getToken();
      const res = await apiClient({
        method: "GET",
        url: "/providers",
        params: {
          page: currentPage,
          per_page: 25,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["providers-journals", page],
    queryFn: fetchProviders,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const currentPage = data?.meta?.page ?? page;
  const totalPages =
    Math.ceil((data?.meta?.count ?? 0) / (data?.meta?.per_page ?? 25)) || 1;

  const handlePrevClick = () => {
    setSearchTerm("");
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    setSearchTerm("");
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const handlePublisherCardClick = (publisher) => {
    setSelectedPublisher(publisher);
  };

  const countsByYear = selectedPublisher?.counts_by_year ?? [];
  let logoUrl = selectedPublisher
    ? getCompanyLogoByName({ name: selectedPublisher.display_name })
    : undefined;
  const selectedPublisherImage =
    selectedPublisher?.image_thumbnail_url ??
    selectedPublisher?.image_url ??
    logoUrl ??
    "/media/fields/thinking.png";

  const twoYearMeanCitedness =
    selectedPublisher?.summary_stats?.["2yr_mean_citedness"];
  const hIndex = selectedPublisher?.summary_stats?.h_index;
  const i10Index = selectedPublisher?.summary_stats?.i10_index;

  const selectedPublisherId = selectedPublisher?.id?.split("/").pop();
  const filteredProviders = (data?.results ?? []).filter((publisher) =>
    (publisher?.display_name ?? "")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase()),
  );

  const renderHighlightedProviderName = (displayName) => {
    const name = displayName || "Untitled";
    const term = searchTerm.trim();

    if (!term) {
      return name;
    }

    const lowerName = name.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const matchIndex = lowerName.indexOf(lowerTerm);

    if (matchIndex === -1) {
      return name;
    }

    const beforeMatch = name.slice(0, matchIndex);
    const matchedText = name.slice(matchIndex, matchIndex + term.length);
    const afterMatch = name.slice(matchIndex + term.length);

    return (
      <>
        {beforeMatch}
        <span className="provider-title-highlight">{matchedText}</span>
        {afterMatch}
      </>
    );
  };

  return (
    <div className="providers-page">
      <div className="providers-controls">
        <div className="me-10 font-semibold">
          Page : {currentPage} / {totalPages}
        </div>
        <div>
          <button
            type="button"
            onClick={handlePrevClick}
            disabled={currentPage <= 1}
            className="me-5"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={handleNextClick}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <div className="providers-search-wrap">
        <input
          type="text"
          className="providers-search-input"
          placeholder="Type journal name"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {(isLoading || isFetching) && (
        <div className="providers-loader">
          <ProgressBarLoader />
        </div>
      )}

      <div className="providers-layout">
        <div className="providers-left">
          <div
            className="providers-carousel"
            aria-label="Publisher profile cards"
          >
            {filteredProviders.length > 0 ? (
              filteredProviders.map((publisher, idx) => {
                const logoUrl2 = getCompanyLogoByName({
                  name: publisher?.display_name,
                });
                const imageSrc =
                  publisher?.image_thumbnail_url ??
                  publisher?.image_url ??
                  logoUrl2 ??
                  "/media/publishers/openalex.png";

                return (
                  <div
                    className={`publisher-card ${
                      selectedPublisher?.id === publisher?.id ? "active" : ""
                    }`}
                    key={idx}
                    onClick={() => handlePublisherCardClick(publisher)}
                  >
                    <div className="publisher-card-image">
                      <img src={imageSrc} alt={publisher?.display_name} />
                    </div>
                    <div className="publisher-card-title">
                      {renderHighlightedProviderName(publisher?.display_name)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="fallback-image">
                <img
                  src="/media/fields/thinking.png"
                  alt="No matched journals"
                />
                <p className="italic text-red-600">
                  No matching journal found in this page use PREV and NEXT
                  button at top !
                </p>
              </div>
            )}
          </div>
          {!selectedPublisher && (
            <div className="fallback-image">
              <img src="/media/fields/thinking.png" alt="fallback-image" />
              <p className="italic text-gray-800">
                Select any one publisher from above to see information
              </p>
            </div>
          )}
          <div className="provider-journals-panel">
            <div className="provider-info-wrapper">
              <div className="provider-info-panel">
                {selectedPublisher && (
                  <>
                    <div className="provider-info-header">
                      <img
                        src={selectedPublisherImage}
                        alt={selectedPublisher?.display_name}
                      />
                      <div className="provider-info-content">
                        <h3 className="selected-provider-title">
                          {selectedPublisher?.display_name || "Provider Stats"}
                        </h3>

                        <div className="top-intro">
                          <div className="left ">
                            <div className="provider-stat-item">
                              <span>Works count :</span>&nbsp;
                              <strong>
                                {selectedPublisher?.works_count ?? "-"}
                              </strong>
                            </div>

                            <div className="provider-stat-item">
                              <span>Cited by : </span>&nbsp;
                              <strong>
                                {selectedPublisher?.cited_by_count ?? "-"}
                              </strong>
                            </div>
                          </div>

                          <div className="summary-stats-list">
                            {twoYearMeanCitedness !== undefined ||
                            hIndex !== undefined ||
                            i10Index !== undefined ? (
                              <>
                                <div className="summary-stats-item">
                                  <span>Influence :</span>&nbsp;
                                  <strong>{twoYearMeanCitedness ?? "-"}</strong>
                                </div>
                                <div className="summary-stats-item">
                                  <span>Impact score :</span>&nbsp;
                                  <strong>{hIndex ?? "-"}</strong>
                                </div>
                                <div className="summary-stats-item">
                                  <span>Cited papers :</span>&nbsp;
                                  <strong>{i10Index ?? "-"}</strong>
                                </div>
                              </>
                            ) : (
                              <p>No summary stats available.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="provider-papers-wrapper">
                      <div className="provider-papers ">
                        <div className="provider-papers-header">
                          <h4 className="provider-papers-title">
                            Journals under&nbsp;
                            <span className="text-red-800 italic">
                              {selectedPublisher.display_name}
                            </span>
                          </h4>
                          <input
                            type="text"
                            className="provider-papers-search-input"
                            placeholder="Type journal name"
                            value={journalSearchTerm}
                            onChange={(event) =>
                              setJournalSearchTerm(event.target.value)
                            }
                          />
                        </div>
                        <ProvidersPaper
                          providerId={selectedPublisherId}
                          searchTerm={journalSearchTerm}
                        />
                      </div>
                      <div className="provider-counts-block">
                        <h4 className="underline m-3 text-xl underline-offset-4">
                          Year wise stats
                        </h4>
                        <CountsByYear countsByYear={countsByYear} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "./ProvidersJournals.css";
import apiClient from "../../../configs/apiClient";
import { useQuery } from "@tanstack/react-query";
import ProgressBarLoader from "../../loaders/ProgressBarLoader";
import { useAuth } from "@clerk/react";

import CountsByYear from "../../CountsByYear/CountsByYear";
import ProvidersPaper from "./Providers_papers/ProvidersPaper";

export default function ProvidersJournals() {
  const [page, setPage] = useState(1);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
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
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const handlePublisherCardClick = (publisher) => {
    setSelectedPublisher(publisher);
  };

  const summaryStats = selectedPublisher?.summary_stats ?? {};
  const summaryStatsList = Object.entries(summaryStats);
  const countsByYear = selectedPublisher?.counts_by_year ?? [];
  const selectedPublisherImage =
    selectedPublisher?.image_thumbnail_url ??
    selectedPublisher?.image_url ??
    "/media/publishers/openalex.png";

  const selectedPublisherId = selectedPublisher?.id.split("/").pop();
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
            {data?.results?.map((publisher, idx) => {
              const imageSrc =
                publisher?.image_thumbnail_url ??
                publisher?.image_url ??
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
                    {publisher?.display_name}
                  </div>
                </div>
              );
            })}
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
                            {summaryStatsList.length > 0 ? (
                              summaryStatsList.map(([key, value]) => (
                                <div className="summary-stats-item" key={key}>
                                  <span>{key} : </span>&nbsp;
                                  <strong>{value}</strong>
                                </div>
                              ))
                            ) : (
                              <p>No summary stats available.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-2xl font-semibold m-4">
                      Journals under &nbsp;
                      <span className="text-red-800 italic">
                        {selectedPublisher.display_name}
                      </span>
                    </h4>
                    <div className="provider-papers-wrapper">
                      <div className="provider-papers ">
                        <ProvidersPaper providerId={selectedPublisherId} />
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

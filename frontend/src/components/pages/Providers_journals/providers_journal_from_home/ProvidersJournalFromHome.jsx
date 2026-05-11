import React, { useState } from "react";
import apiClient from "../../../../configs/apiClient";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ProgressBarLoader from "../../../loaders/ProgressBarLoader";
import CountsByYear from "../../../CountsByYear/CountsByYear";
import { useAuth } from "@clerk/react";
import "../ProvidersJournals.css";
import ProvidersPaper from "../Providers_papers/ProvidersPaper";

export default function ProvidersJournalFromHome() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [journalSearchTerm, setJournalSearchTerm] = useState("");

  const fetchProvider = async ({ queryKey }) => {
    const [, providerId] = queryKey;

    try {
      const token = await getToken();
      const res = await apiClient({
        method: "GET",
        url: `/providers/${providerId}`,
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
    queryKey: ["provider-detail", id],
    queryFn: fetchProvider,
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const selectedPublisherImage =
    data?.image_thumbnail_url ??
    data?.image_url ??
    "/media/publishers/openalex.png";
  const twoYearMeanCitedness = data?.summary_stats?.["2yr_mean_citedness"];
  const hIndex = data?.summary_stats?.h_index;
  const i10Index = data?.summary_stats?.i10_index;
  const countsByYear = data?.counts_by_year ?? [];

  return (
    <div className="providers-page">
      {(isLoading || isFetching) && (
        <div className="providers-loader">
          <ProgressBarLoader />
        </div>
      )}

      <div className="provider-journals-panel">
        <div className="provider-info-wrapper">
          <div className="provider-info-panel">
            {data && (
              <>
                <div className="provider-info-header">
                  <img src={selectedPublisherImage} alt={data?.display_name} />
                  <div className="provider-info-content">
                    <h3 className="selected-provider-title">
                      {data?.display_name || "Provider Stats"}
                    </h3>

                    <div className="top-intro">
                      <div className="left ">
                        <div className="provider-stat-item">
                          <span>Works count :</span>&nbsp;
                          <strong>{data?.works_count ?? "-"}</strong>
                        </div>

                        <div className="provider-stat-item">
                          <span>Cited by : </span>&nbsp;
                          <strong>{data?.cited_by_count ?? "-"}</strong>
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
                  <div className="provider-papers">
                    <div className="provider-papers-header">
                      <h4 className="provider-papers-title">
                        <span className="text-red-800 italic">
                          Journals list
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
                      providerId={id}
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
  );
}

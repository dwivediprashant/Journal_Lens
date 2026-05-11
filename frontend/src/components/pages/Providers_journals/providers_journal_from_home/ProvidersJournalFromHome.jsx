import React from "react";
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
  const summaryStatsList = Object.entries(data?.summary_stats ?? {});
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

                <div className="provider-papers-wrapper">
                  <div className="provider-papers">
                    <h4 className="text-2xl font-semibold m-4">
                      Journals under &nbsp;
                      <span className="text-red-800 italic">
                        {data?.display_name}
                      </span>
                    </h4>
                    <ProvidersPaper providerId={id} />
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

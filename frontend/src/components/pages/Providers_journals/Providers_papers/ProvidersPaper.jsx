import "./ProvidersPaper.css";
import React from "react";
import apiClient from "../../../../configs/apiClient";
import { useQuery } from "@tanstack/react-query";
import ProgressBarLoader from "../../../loaders/ProgressBarLoader";
import JournalCard from "./journal_card/JournalCard";

export default function ProvidersPaper({ providerId }) {
  const fetchProvidersPapers = async ({ queryKey }) => {
    const [, providerId] = queryKey;
    try {
      const res = await apiClient({
        method: "GET",
        url: `/providers/sources/${providerId}`,
      });

      return res.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["provider-papers", providerId],
    queryFn: fetchProvidersPapers,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    enabled: !!providerId,
  });
  return (
    <div>
      {(isLoading || isFetching) && (
        <div className="progress-loader">
          <ProgressBarLoader />
        </div>
      )}
      {!(isLoading || isFetching) && !(data?.results?.length > 0) && (
        <p className="italic text-gray-600 text-md">
          No open access journals provided by this provider
        </p>
      )}
      {data?.results?.length > 0 &&
        data?.results.map((journal) => {
          return (
            <JournalCard
              key={journal.id ?? journal.display_name}
              display_name={journal.display_name}
              issn_l={journal.issn_l}
              works_count={journal.works_count}
              cited_by_count={journal.cited_by_count}
              summary_stats={journal.summary_stats}
              apc_usd={journal.apc_usd}
              homepage_url={journal.homepage_url}
              is_oa={journal.is_oa}
            />
          );
        })}
    </div>
  );
}

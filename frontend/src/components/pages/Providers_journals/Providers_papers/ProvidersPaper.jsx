import "./ProvidersPaper.css";
import React, { useState } from "react";
import apiClient from "../../../../configs/apiClient";
import { useQuery } from "@tanstack/react-query";
import ProgressBarLoader from "../../../loaders/ProgressBarLoader";
import JournalCard from "./journal_card/JournalCard";
import { useAuth } from "@clerk/react";

export default function ProvidersPaper({ providerId, searchTerm = "" }) {
  const { getToken } = useAuth();

  const fetchProvidersPapers = async ({ queryKey }) => {
    const [, providerId] = queryKey;

    try {
      const token = await getToken();
      const res = await apiClient({
        method: "GET",
        url: `/providers/sources/${providerId}`,
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
    queryKey: ["provider-papers", providerId],
    queryFn: fetchProvidersPapers,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    enabled: !!providerId,
  });

  const filteredJournals = (data?.results ?? []).filter((journal) =>
    (journal?.display_name ?? "")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase()),
  );
  const hasSearchTerm = searchTerm.trim().length > 0;

  return (
    <div className="provider-papers-search-wrap">
      {(isLoading || isFetching) && (
        <div className="progress-loader">
          <ProgressBarLoader />
        </div>
      )}

      {!(isLoading || isFetching) &&
        hasSearchTerm &&
        filteredJournals.length === 0 && (
          <div className="provider-papers-empty-state">
            <img src="/media/fields/thinking.png" alt="No matched journals" />
            <p className="italic text-gray-600 text-md">
              No matching journal found
            </p>
          </div>
        )}

      {!(isLoading || isFetching) &&
        !hasSearchTerm &&
        data?.results?.length === 0 && (
          <p className="italic text-gray-600 text-md">
            No open access journals provided by this provider
          </p>
        )}

      {filteredJournals.length > 0 &&
        filteredJournals.map((journal) => {
          return (
            <JournalCard
              key={journal.id ?? journal.display_name}
              display_name={journal.display_name}
              searchTerm={searchTerm}
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

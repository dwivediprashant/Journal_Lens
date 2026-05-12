import React from "react";
import "./ISSNPapers.css";
import ListPapers from "../Detail/ListPapers/ListPapers";
import { useSearchParams, useParams } from "react-router";
import TopHeader from "../Providers_journals/Providers_papers/journal_card/top-header-journal-card/TopHeader";

export default function ISSNPapers() {
  const { issnId } = useParams();
  const [searchParams] = useSearchParams();

  const display_name = searchParams.get("display_name") || "";
  const works_count = Number(searchParams.get("works_count") || 0);
  const cited_by_count = Number(searchParams.get("cited_by_count") || 0);
  const apc_usd = searchParams.get("apc_usd") || "";
  const is_oa = searchParams.get("is_oa") === "true";
  const summary_stats = JSON.parse(searchParams.get("summary_stats") || "{}");

  return (
    <div className="issn-paper-wrapper">
      <div className="head-wrapper">
        <div>
          <TopHeader
            display_name={display_name}
            searchTerm=""
            issn_l={issnId}
            works_count={works_count}
            cited_by_count={cited_by_count}
            summary_stats={summary_stats}
            apc_usd={apc_usd}
            is_oa={is_oa}
          />
        </div>
      </div>
      <ListPapers issnId={issnId} />
    </div>
  );
}

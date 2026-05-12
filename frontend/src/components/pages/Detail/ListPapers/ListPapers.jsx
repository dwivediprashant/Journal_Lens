import React from "react";
import "../Detail.css";
import apiClient from "../../../../configs/apiClient";
import MainContext from "../../../../Contexts/MainContext";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import ChatBot from "../../../ChatBot/ChatBot";
import MagnifyGlassLoader from "../../../loaders/MagnifyGlassLoader";
import DetailCard from "../../../researchCard/DetailCard";

export default function ListPapers({ issnId, field }) {
  const { callResearchApi } = useContext(MainContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [author, setAuthor] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [backendAuthorName, setBackendAuthorName] = useState("");

  //auth token
  const { getToken } = useAuth();

  const papersQuery = useQuery({
    queryKey: ["papers", pageNum, issnId, field, authorId],
    queryFn: () => callResearchApi(pageNum, issnId, field, authorId),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const data = papersQuery.data?.results ?? [];
  const totalPages = papersQuery.data?.meta?.per_page
    ? Math.ceil(papersQuery.data.meta.count / papersQuery.data.meta.per_page)
    : 1;

  const handleNextBtnClick = () => {
    if (pageNum >= totalPages) return;
    setPageNum((curr) => curr + 1);
  };

  const handlePrevBtnClick = () => {
    if (pageNum === 1) return;
    setPageNum((curr) => curr - 1);
  };

  const handleFilteredSearchClick = async (e) => {
    e.preventDefault();
    if (!author) return;

    try {
      const token = await getToken();
      const res = await apiClient({
        method: "GET",
        url: "/author/id",
        params: { author },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 200) return;
      const resolvedAuthorId =
        res.data.ids?.openalex || res.data.ids?.orcid || "";
      if (!resolvedAuthorId) return;
      setAuthorId(resolvedAuthorId);
      setBackendAuthorName(res.data.author);
      setPageNum(1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearFilteredSearch = () => {
    if (!backendAuthorName) {
      setAuthor("");
      return;
    }
    setAuthorId("");
    setBackendAuthorName("");
    setAuthor("");
    setPageNum(1);
  };

  return (
    <div className="list-outer">
      <div className="list-wrapper">
        <div className="list">
          <div className="detailcard-main">
            {/* Filters + Pagination */}
            <div className="pagination-btn-filters">
              <div className="filters flex items-center gap-4 ms-[5rem] flex-nowrap">
                <div className="input-field flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Enter author name"
                    className="border rounded-md px-3 py-2 outline-none "
                    onChange={(e) => setAuthor(e.target.value)}
                    value={author}
                  />
                  {backendAuthorName && (
                    <span className="italic flex flex-wrap text-gray-400 text-xs">
                      Showing Results for author name ={" "}
                      <span className="text-black bg-yellow-200">
                        {backendAuthorName}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleClearFilteredSearch}
                    className="text-red-600 p-2 cursor-pointer hover:text-red-700"
                  >
                    <i className="fa-solid fa-trash fa-xl"></i>
                  </button>

                  <button
                    onClick={handleFilteredSearchClick}
                    className="search-btn rounded-lg"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="pagination-btn">
                <button
                  className={`prev-btn ${pageNum === 1 ? "disabled" : ""}`}
                  disabled={pageNum === 1 || papersQuery.isFetching}
                  onClick={handlePrevBtnClick}
                >
                  <i className="fa-solid fa-chevron-left"></i> prev
                </button>
                <button
                  className={`next-btn ${pageNum >= totalPages ? "disabled" : ""}`}
                  onClick={handleNextBtnClick}
                  disabled={pageNum >= totalPages || papersQuery.isFetching}
                >
                  next <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            {/* Papers List */}
            {papersQuery.isLoading ? (
              <div className="loader-container">
                <MagnifyGlassLoader />
              </div>
            ) : data.length > 0 ? (
              <div className="detailcard-container">
                {data.map((paper, index) => (
                  <DetailCard
                    key={paper?.id ?? index}
                    paper={paper}
                    onOpenChat={() => {
                      setSelectedPaper(paper);
                      setIsChatOpen(true);
                    }}
                    backendAuthorName={backendAuthorName}
                  />
                ))}
              </div>
            ) : (
              <div className="fallback-image">
                <img src="/media/fields/thinking.png" alt="fallback-img" />
                <span className="italic">
                  No papers found for author name = {author}
                </span>
              </div>
            )}
          </div>
        </div>

        <ChatBot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          journalId={
            selectedPaper?.primary_location?.pdf_url ||
            selectedPaper?.open_access?.oa_url ||
            selectedPaper?.id ||
            null
          }
          pdfUrl={
            selectedPaper?.primary_location?.pdf_url ||
            selectedPaper?.open_access?.oa_url ||
            null
          }
          abstract={
            selectedPaper?.abstract ||
            selectedPaper?.abstract_inverted_index ||
            null
          }
          title={selectedPaper?.display_name || null}
          authors={
            selectedPaper?.authorships
              ?.map((a) => a?.author?.display_name)
              .filter(Boolean)
              .join(", ") || null
          }
        />
      </div>
    </div>
  );
}

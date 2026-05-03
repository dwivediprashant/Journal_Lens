import "./CustomJournal.css";
import { useContext, useState } from "react";
import MainContext from "../../../Contexts/MainContext";
import DetailCard from "../../researchCard/DetailCard";
import MagnifyGlassLoader from "../../loaders/MagnifyGlassLoader";
import { useQuery } from "@tanstack/react-query";
export default function CustomJournal() {
  const [searchVal, setSearchVal] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { callResearchApi } = useContext(MainContext);

  const query = searchVal.trim();
  const searchQuery = useQuery({
    queryKey: ["custom-search-papers", pageNum, submittedQuery],
    queryFn: () => callResearchApi(pageNum, submittedQuery),
    enabled: hasSearched && !!submittedQuery,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const data = searchQuery.data?.results ?? [];
  const totalPages = searchQuery.data?.meta?.per_page
    ? Math.ceil(searchQuery.data.meta.count / searchQuery.data.meta.per_page)
    : 1;

  const handleSearchClick = async (e) => {
    e.preventDefault();
    if (!query) return;

    setHasSearched(true);
    setSubmittedQuery(query);
    setPageNum(1);
  };

  const handleNextBtnClick = () => {
    if (pageNum >= totalPages || !submittedQuery) return;
    setPageNum((currentPage) => currentPage + 1);
  };

  const handlePrevBtnClick = () => {
    if (pageNum === 1 || !submittedQuery) return;
    setPageNum((currentPage) => currentPage - 1);
  };

  return (
    <div className="main">
      <div className="search-main p-2 ">
        <form className="w-[50%] flex" onSubmit={handleSearchClick}>
          <input
            type="text"
            placeholder="Search papers using simple text ..."
            className="border outline-none px-4 w-[100%]"
            onChange={(e) => setSearchVal(e.target.value)}
            value={searchVal}
          />
          <button className=" bg-blue-800 hover:cursor-pointer">
            <i className="fa-solid fa-magnifying-glass m-5 text-white"></i>
          </button>
        </form>
      </div>

      <div className="journal-details m-5 w-[100%]">
        <div className="list">
          {!hasSearched || !query ? (
            <div className="fallback-image">
              <img src="/media/Idea.png" alt="fallback-img" />
              <span className="italic">You have not searched yet !</span>
            </div>
          ) : searchQuery.isFetching ? (
            <div className="loader-container">
              <MagnifyGlassLoader />
            </div>
          ) : data?.length > 0 ? (
            <div className="detailcard-main">
              <div className="pagination-btn ms-auto">
                <button
                  className={`prev-btn ${pageNum === 1 ? "disabled" : ""}`}
                  disabled={pageNum === 1 || searchQuery.isFetching}
                  onClick={handlePrevBtnClick}
                >
                  <i className="fa-solid fa-chevron-left"></i> prev
                </button>
                <button
                  className={`next-btn ${pageNum >= totalPages ? "disabled" : ""}`}
                  onClick={handleNextBtnClick}
                  disabled={pageNum >= totalPages || searchQuery.isFetching}
                >
                  next <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>

              <div className="detailcard-container">
                {data.map((paper, index) => (
                  <DetailCard key={paper?.id ?? index} paper={paper} />
                ))}
              </div>
            </div>
          ) : (
            <div className="fallback-image">
              <img src="/media/fields/thinking.png" alt="fallback-img" />
              <span className="italic">No papers found for this search.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

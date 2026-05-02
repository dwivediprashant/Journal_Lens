import "./CustomJournal.css";
import { useContext, useState } from "react";
import MainContext from "../../../Contexts/MainContext";
import DetailCard from "../../researchCard/DetailCard";
import MagnifyGlassLoader from "../../loaders/MagnifyGlassLoader";

export default function CustomJournal() {
  const [searchVal, setSearchVal] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [loader, setLoader] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { callResearchApi, data, metaData, setData, setMetaData } =
    useContext(MainContext);

  const totalPages = metaData?.per_page
    ? Math.ceil(metaData.count / metaData.per_page)
    : 1;
  const query = searchVal.trim();

  const handleSearchClick = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoader(true);
    setHasSearched(true);
    setPageNum(1);
    setData([]);
    setMetaData({});

    try {
      await callResearchApi(1, query);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleNextBtnClick = async () => {
    if (pageNum >= totalPages || !query) return;

    const nextPage = pageNum + 1;
    setLoader(true);
    try {
      setPageNum(nextPage);
      await callResearchApi(nextPage, query);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handlePrevBtnClick = async () => {
    if (pageNum === 1 || !query) return;

    const prevPage = pageNum - 1;
    setLoader(true);
    try {
      setPageNum(prevPage);
      await callResearchApi(prevPage, query);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
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
          ) : loader ? (
            <div className="loader-container">
              <MagnifyGlassLoader />
            </div>
          ) : data?.length > 0 ? (
            <div className="detailcard-main">
              <div className="pagination-btn ms-auto">
                <button
                  className={`prev-btn ${pageNum === 1 ? "disabled" : ""}`}
                  disabled={pageNum === 1 || loader}
                  onClick={handlePrevBtnClick}
                >
                  <i className="fa-solid fa-chevron-left"></i> prev
                </button>
                <button
                  className={`next-btn ${pageNum >= totalPages ? "disabled" : ""}`}
                  onClick={handleNextBtnClick}
                  disabled={pageNum >= totalPages || loader}
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
              <img src="/media/Idea.png" alt="fallback-img" />
              <span className="italic">No papers found for this search.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

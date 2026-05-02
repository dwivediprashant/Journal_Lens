import "./Detail.css";
import React, { useState } from "react";
import DetailCard from "../../researchCard/DetailCard";
import ChatBot from "../../ChatBot/ChatBot";
import apiClient from "../../../configs/apiClient";
import { useParams, useSearchParams } from "react-router";
import { useContext } from "react";
import MainContext from "../../../Contexts/MainContext";

import MagnifyGlassLoader from "../../loaders/MagnifyGlassLoader";

export default function Detail() {
  //hook

  const { callResearchApi, data, metaData } = useContext(MainContext);
  const [searchParams] = useSearchParams();
  const field = searchParams.get("field");
  const desc = searchParams.get("desc");
  const src = searchParams.get("src");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShowBtn, setisShowBtn] = useState(true);
  const [loader, setLoader] = useState(false);

  const [author, setAuthor] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const totalPages = metaData?.per_page
    ? Math.ceil(metaData.count / metaData.per_page)
    : 1;

  // author name returned by backend
  const [backendAuthorName, setBackendAuthorName] = useState("");
  //show-button click handling
  const handleisShowBtnClick = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      await callResearchApi(pageNum, field);
      setisShowBtn(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  //next button click
  const handleNextBtnClick = async () => {
    if (pageNum >= totalPages) return;
    setLoader(true);
    try {
      const nextPage = pageNum + 1;
      setPageNum(nextPage);
      await callResearchApi(nextPage, field, authorId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  //prev button click
  const handlePrevBtnClick = async () => {
    if (pageNum === 1) {
      return;
    }
    try {
      setLoader(true);
      const prevPage = pageNum - 1;
      setPageNum(prevPage);
      await callResearchApi(prevPage, field, authorId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  //search filter click

  const handleFilteredSearchClick = async (e) => {
    e.preventDefault();
    if (!author) return;
    setLoader(true);
    try {
      //first get id of author then retrieve papers of authors
      const res = await apiClient({
        method: "GET",
        url: "/author/id",
        params: {
          author: author,
        },
      });
      if (res.status !== 200) {
        return;
      }
      // console.log(res.data);
      const resolvedAuthorId =
        res.data.ids?.openalex || res.data.ids?.orcid || "";
      if (!resolvedAuthorId) return;

      setAuthorId(resolvedAuthorId);

      //set BackendAuthorName to "show results for" feature
      setBackendAuthorName(res.data.author);
      //now if ids fetched successfully then proceeed to fetch author works
      await callResearchApi(pageNum, field, resolvedAuthorId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  //clear filtered author work and display results without author filter
  const handleClearFilteredSearch = async () => {
    if (!backendAuthorName) {
      setAuthor("");
      return;
    }
    setLoader(true);
    try {
      await callResearchApi(pageNum, field);
      setBackendAuthorName("");
      setAuthor("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  //render
  return (
    <div className="journal-details m-5 ">
      <div className="top-details">
        <div className="detail-img">
          <img src={src} alt="" />
        </div>
        <div className="italic text-gray-600">
          <span className="font-bold">Field of research : </span>
          {field}
        </div>
        <div className="desc ">
          <span className=" text-3xl text-gray-700 font-bold">" </span>
          <span>{desc}</span>{" "}
          <span className=" text-3xl text-gray-700 font-bold">" </span>
        </div>
      </div>
      <div className="detail-list-title text-3xl m-3">
        <div>
          <span className="text-blue-700">{field}'s</span> research papers
        </div>
      </div>
      <div className="list">
        {isShowBtn ? (
          <div className="detail-list-cta">
            {loader ? (
              <MagnifyGlassLoader />
            ) : (
              <button
                className="detail-list-button text-white rounded-lg"
                onClick={handleisShowBtnClick}
              >
                Show papers
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="detailcard-main">
              {!isShowBtn && (
                <div className=" pagination-btn-filters">
                  <div className="filters flex items-start gap-4 ms-[5rem] flex-wrap">
                    <div className="flex flex-col min-w-[28rem]  gap-1">
                      <input
                        type="text"
                        placeholder="Enter author name"
                        className="border rounded-md px-3 py-2 outline-none min-w-[220px]"
                        onChange={(e) => setAuthor(e.target.value)}
                        value={author}
                      />
                      {backendAuthorName && (
                        <span className="italic text-gray-400 text-xs">
                          Showing Results for author name ={" "}
                          <span className="text-black bg-yellow-200">
                            {backendAuthorName}
                          </span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleClearFilteredSearch}
                      className="text-red-600 p-2 cursor-pointer hover:text-red-700"
                    >
                      <i className="fa-solid fa-trash  fa-xl"></i>
                    </button>

                    <button
                      onClick={handleFilteredSearchClick}
                      className="search-btn rounded-lg"
                    >
                      Search
                    </button>
                  </div>
                  <div>
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
                </div>
              )}
              {loader ? (
                <div className="loader-container">
                  <MagnifyGlassLoader />
                </div>
              ) : (
                <div className="detailcard-container">
                  {data.map((paper, index) => (
                    <DetailCard
                      key={paper?.id ?? index}
                      paper={paper}
                      onOpenChat={() => setIsChatOpen(true)}
                      backendAuthorName={backendAuthorName}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

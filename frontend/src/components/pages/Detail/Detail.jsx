import "./Detail.css";
import React, { useState } from "react";
import DetailCard from "../../researchCard/DetailCard";
import ChatBot from "../../ChatBot/ChatBot";
import apiClient from "../../../configs/apiClient";
import { useParams, useSearchParams } from "react-router";

import MagnifyGlassLoader from "../../loaders/MagnifyGlassLoader";

export default function Detail() {
  //hook

  const [searchParams] = useSearchParams();
  const field = searchParams.get("field");
  const desc = searchParams.get("desc");
  const src = searchParams.get("src");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShowBtn, setisShowBtn] = useState(true);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const totalPages = metaData?.per_page
    ? Math.ceil(metaData.count / metaData.per_page)
    : 1;

  //research api call
  const callResearchApi = async (pageNum) => {
    setLoader(true);
    try {
      const res = await apiClient({
        method: "GET",
        url: "/researchpapers",
        params: {
          field: field,
          pageNum: pageNum,
        },
      });

      return res;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  //show-button click handling
  const handleisShowBtnClick = async (e) => {
    e.preventDefault();
    try {
      const res = await callResearchApi(pageNum);
      setData(res?.data?.data?.results);
      setMetaData(res?.data?.data?.meta);
      // console.log(res.data.data);
      setisShowBtn(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  //next button click
  const handleNextBtnClick = async () => {
    try {
      const nextPage = pageNum + 1;
      setPageNum(nextPage);
      const res = await callResearchApi(nextPage);
      setData(res?.data?.data?.results);
      setMetaData(res?.data?.data?.meta);
      // console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  //prev button click
  const handlePrevBtnClick = async () => {
    try {
      if (pageNum === 1) {
        return;
      }
      const prevPage = pageNum - 1;
      setPageNum(prevPage);
      const res = await callResearchApi(prevPage);
      setData(res?.data?.data?.results);
      setMetaData(res?.data?.data?.meta);
      // console.log(res.data.data);
    } catch (error) {
      console.log(error);
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

import "./Detail.css";
import React, { useState } from "react";
import DetailCard from "../../researchCard_withGPT/DetailCard";
import ChatBot from "../../ChatBot/ChatBot";
import VortexLoader from "../../loaders/Vortex";
import apiClient from "../../../configs/apiClient";
import { useSearchParams } from "react-router";

export default function Detail() {
  const [searchParams] = useSearchParams();
  const field = searchParams.get("field");
  const desc = searchParams.get("desc");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [isShowBtn, setisShowBtn] = useState(true);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);

  const handleisShowBtnClick = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await apiClient({
        method: "GET",
        url: "/researchpapers",
        params: {
          field: field,
        },
      });
      setData(res.data.data);
      console.log(res.data.data);
      setisShowBtn(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="journal-details m-5 ">
      <div className="top-details">
        <div className="detail-img">
          <img
            src="https://www.stonewallco.com/hubfs/Construction%20civil%20engineer%20technician%20and%20architect%20working.png"
            alt=""
          />
        </div>
        <div className="desc ">
          <span className=" text-3xl text-gray-700 font-bold">" </span>
          <span>{desc}</span>{" "}
          <span className=" text-3xl text-gray-700 font-bold">" </span>
        </div>
      </div>
      <span className="detail-list-title text-3xl m-3">
        <span className="text-blue-700">{field}'s</span> research papers
      </span>
      <div className="list">
        {isShowBtn ? (
          <div className="detail-list-cta">
            {loader ? (
              <VortexLoader />
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
              <div className="detailcard-container">
                {data.map((paper, index) => (
                  <DetailCard
                    key={paper?.id ?? index}
                    paper={paper}
                    onOpenChat={() => setIsChatOpen(true)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

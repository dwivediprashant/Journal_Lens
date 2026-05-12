import "./Detail.css";
import React, { useState } from "react";
import DetailCard from "../../researchCard/DetailCard";
import ChatBot from "../../ChatBot/ChatBot";
import apiClient from "../../../configs/apiClient";
import { useSearchParams } from "react-router";
import { useContext } from "react";
import MainContext from "../../../Contexts/MainContext";
import { useQuery } from "@tanstack/react-query";
import MagnifyGlassLoader from "../../loaders/MagnifyGlassLoader";
import { useAuth } from "@clerk/react";
import ListPapers from "./ListPapers/ListPapers";

export default function Detail() {
  const [searchParams] = useSearchParams();
  const field = searchParams.get("field");
  const desc = searchParams.get("desc");
  const src = searchParams.get("src");

  return (
    <div className="journal-details m-5">
      <div className="top-details">
        <div className="detail-img">
          <img src={src} alt="" />
        </div>
        <div className="italic text-gray-600">
          <span className="font-bold">Field of research : </span>
          {field}
        </div>
        <div className="desc">
          <span className="text-3xl text-gray-700 font-bold">" </span>
          <span>{desc}</span>
          <span className="text-3xl text-gray-700 font-bold"> "</span>
        </div>
      </div>

      <div className="detail-list-title text-3xl m-3">
        <span className="text-blue-700 me-2">{field}'s</span> research papers
      </div>

      <>
        <ListPapers field={field} />
      </>
    </div>
  );
}

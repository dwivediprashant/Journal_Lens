import "./ShowMoreCard.css";
import React from "react";
import { Link } from "react-router";
export default function ShowMoreCard() {
  return (
    <Link to={`/providers`} className="flex flex-col items-center">
      <div className="show-more-card">
        <span>
          <i className="fa-solid fa-angles-right fa-beat fa-xl"></i>
        </span>
      </div>
      <p className="mt-8">Show All Providers</p>
    </Link>
  );
}

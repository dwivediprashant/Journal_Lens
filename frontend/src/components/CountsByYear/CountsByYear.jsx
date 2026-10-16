import React from "react";
import "./CountsByYear.css";

export default function CountsByYear({ countsByYear }) {
  return (
    <div className="count-by-year-wrapper">
      {countsByYear?.map((year, idx) => {
        return (
          <div key={idx} className="year-info-card">
            <p>
              <span className="label">Year :</span> {year?.year}
            </p>
            <p>
              <span className="label">Total works :</span> {year?.works_count}
            </p>
            <p>
              <span className="label">Total citations :</span>{" "}
              {year?.cited_by_count}
            </p>
          </div>
        );
      })}
    </div>
  );
}

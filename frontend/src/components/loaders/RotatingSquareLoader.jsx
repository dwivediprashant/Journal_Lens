import React from "react";
import { RotatingSquare } from "react-loader-spinner";

export default function RotatingSquareLoader() {
  return (
    <div>
      <RotatingSquare
        visible={true}
        height="100"
        width="100"
        color="#4fa94d"
        ariaLabel="rotating-square-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

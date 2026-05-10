import React from "react";
import { ProgressBar } from "react-loader-spinner";
export default function ProgressBarLoader() {
  return (
    <div>
      <ProgressBar
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

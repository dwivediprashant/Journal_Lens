import MainContext from "./MainContext";
import apiClient from "../configs/apiClient";
import { useState } from "react";

export default function MainContextProvider({ children }) {
  //main data (research papers)
  const [data, setData] = useState([]);
  const [metaData, setMetaData] = useState({});

  //research api call with optional authorId
  const callResearchApi = async (pageNum, field, authorId = "") => {
    // setLoader(true);
    try {
      const res = await apiClient({
        method: "GET",
        url: "/researchpapers",
        params: {
          field: field,
          pageNum: pageNum,
          authorId: authorId,
        },
      });
      setData(res?.data?.data?.results);
      setMetaData(res?.data?.data?.meta);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const vals = { callResearchApi, data, setData, metaData, setMetaData };
  return <MainContext.Provider value={vals}>{children}</MainContext.Provider>;
}

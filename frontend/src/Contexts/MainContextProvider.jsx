import MainContext from "./MainContext";
import apiClient from "../configs/apiClient";
import { useAuth } from "@clerk/react";

export default function MainContextProvider({ children }) {
  const { getToken } = useAuth();
  //research api call with optional authorId
  const callResearchApi = async (pageNum, issnId, field, authorId = "") => {
    try {
      const token = await getToken();
      const params = {
        pageNum,
      };

      if (field && field.length > 0) {
        params.field = field;
      }

      if (issnId && issnId.length > 0) {
        params.issnId = issnId;
      }
      if (authorId && authorId.length > 0) {
        params.authorId = authorId;
      }
      const res = await apiClient({
        method: "GET",
        url: "/researchpapers",
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data?.data; // data + metadata
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const vals = { callResearchApi };
  return <MainContext.Provider value={vals}>{children}</MainContext.Provider>;
}

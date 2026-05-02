import express from "express";
const router = express.Router();
import axios from "axios";
const OPENALEX_BASE_URL = process.env.OPENALEX_BASE_URL;
const OPENALEX_API_KEY = process.env.OPENALEX_API_KEY;

//1. GET  /api/researchpapers/

router.get("/", async (req, res) => {
  const { field, pageNum, authorId } = req.query;

  if (!field || !pageNum) {
    return res
      .status(400)
      .json({ success: "false", error: "Field or Page number missing !" });
  }
  try {
    let data = null;
    let filterString = "type:article,open_access.is_oa:true";

    if (authorId && authorId.length > 0) {
      filterString += `,author.id:${authorId}`;
    }

    const response = await axios.get(`${OPENALEX_BASE_URL}/works`, {
      params: {
        filter: filterString,
        search: field,
        select:
          "display_name,authorships,publication_year,primary_location,open_access,cited_by_count,primary_topic,abstract_inverted_index",
        per_page: 10,
        api_key: OPENALEX_API_KEY,
        page: pageNum,
      },
    });

    data = response.data;

    return res.status(200).json({ success: "true", data });
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ success: "false", error: "Failed to fetch research papers" });
  }
});

export default router;

import express from "express";
const router = express.Router();
import axios from "axios";
const OPENALEX_BASE_URL = process.env.OPENALEX_BASE_URL;
const OPENALEX_API_KEY = process.env.OPENALEX_API_KEY;

//auth middleware
import requireAuth from "../middlewares/requireAuth.js";

router.use(requireAuth);
//1. GET  /api/researchpapers/

router.get("/", async (req, res) => {
  const { field, pageNum, issnId, authorId } = req.query;

  if (!pageNum) {
    return res.status(400).json({ success: false, error: error.message });
  }
  try {
    let data = null;
    let filterString = "type:article,open_access.is_oa:true";

    if (issnId && issnId.length > 0) {
      filterString += `,primary_location.source.issn:${issnId}`;
    }

    if (authorId && authorId.length > 0) {
      filterString += `,author.id:${authorId}`;
    }

    const params = {
      filter: filterString,
      select:
        "display_name,authorships,publication_year,primary_location,open_access,cited_by_count,primary_topic,abstract_inverted_index",
      per_page: 10,
      page: pageNum,
      api_key: OPENALEX_API_KEY,
    };

    if (field && field.length > 0) {
      params.search = field;
    }
    const response = await axios.get(`${OPENALEX_BASE_URL}/works`, { params });

    data = response.data;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch research papers" });
  }
});

export default router;

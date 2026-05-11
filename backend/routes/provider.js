import express from "express";
const router = express.Router();
import axios from "axios";
const OPENALEX_BASE_URL = process.env.OPENALEX_BASE_URL;
const OPENALEX_API_KEY = process.env.OPENALEX_API_KEY;

//auth middleware
import requireAuth from "../middlewares/requireAuth.js";

router.use(requireAuth);

//1.  GET /api/providers/  : all providers/publishers brief information
router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.per_page || 25;

    let reponse = await axios.get(`${OPENALEX_BASE_URL}/publishers`, {
      params: {
        api_key: OPENALEX_API_KEY,
        page,
        per_page: perPage,
        select:
          "id,display_name,image_thumbnail_url,image_url,works_count,cited_by_count,summary_stats,counts_by_year",
      },
    });

    reponse = reponse.data;

    return res.status(200).json({ success: true, data: reponse }); //meta + results
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//2 . GET /api/providers/sources/:providerId  => get sources/journals by providerID
router.get("/sources/:providerId", async (req, res) => {
  const { providerId } = req.params;

  if (!providerId) {
    return res
      .status(400)
      .json({ success: false, error: "Provider ID missing !" });
  }

  try {
    let response = await axios.get(`${OPENALEX_BASE_URL}/sources`, {
      params: {
        filter: `host_organization:${providerId},is_oa:true,type:journal`,
        select: `display_name,issn_l,works_count,cited_by_count,summary_stats,is_oa,apc_usd,homepage_url`,
        api_key: OPENALEX_API_KEY,
      },
    });

    response = response.data;

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//3. /api/providers/:providerId => get all things as 1. GET /api/providers/  but for only one publisher(provider) not list of all providers
router.get("/:providerId", async (req, res) => {
  const { providerId } = req.params;

  if (!providerId) {
    return res
      .status(400)
      .json({ success: false, error: "Provider ID missing !" });
  }

  try {
    let reponse = await axios.get(
      `${OPENALEX_BASE_URL}/publishers/${providerId}`,
      {
        params: {
          api_key: OPENALEX_API_KEY,
          select:
            "id,display_name,image_thumbnail_url,image_url,works_count,cited_by_count,summary_stats,counts_by_year",
        },
      },
    );

    reponse = reponse.data;

    return res.status(200).json({ success: true, data: reponse });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

import express from "express";
const router = express.Router();
import axios from "axios";
const OPENALEX_BASE_URL = process.env.OPENALEX_BASE_URL;
const OPENALEX_API_KEY = process.env.OPENALEX_API_KEY;

//1 . GET /api/author/id

router.get("/id", async (req, res) => {
  const { author } = req.query;
  //   console.log(author);

  if (!author) {
    return res
      .status(400)
      .json({ success: "false", error: "Author name missing !" });
  }

  try {
    const response = await axios.get(`${OPENALEX_BASE_URL}/authors`, {
      params: {
        search: author,
        select: "ids,display_name",
        api_key: OPENALEX_API_KEY,
      },
    });

    const firstAuthor = response.data.results?.[0];
    if (!firstAuthor) {
      return res.status(404).json({
        success: false,
        error: `No author found with name = ${author}.`,
      });
    }
    const authorDisplayName = firstAuthor?.display_name;

    return res.status(200).json({
      success: true,
      author: authorDisplayName,
      ids: firstAuthor.ids,
    });
  } catch (error) {
    console.error("OpenAlex API Error:", error.message);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch data from OpenAlex." });
  }
});

export default router;

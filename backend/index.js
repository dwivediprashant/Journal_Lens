import "dotenv/config";

import express from "express";
import cors from "cors";
const app = express();
const port = process.env.PORT;

//routes import
import researchpapersRoute from "./routes/researchpapers.js";
import authorRoute from "./routes/author.js";
// other imports
import corsOptions from "./configs/corsOptions.js";
//routes

//middlewares

app.use(cors(corsOptions));

// related to research paper
app.use("/api/researchpapers", researchpapersRoute);
app.use("/api/author", authorRoute);

app.get("/", (req, res) => {
  res.json({ status: "success", msg: "Backend start" });
});

app.listen(port, (req, res) => {
  console.log(`Server running at ${port}`);
});

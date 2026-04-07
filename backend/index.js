import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.json({ status: "success", msg: "Backend start" });
});

app.listen(port, (req, res) => {
  console.log(`Server running at ${port}`);
});

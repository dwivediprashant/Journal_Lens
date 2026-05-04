import "dotenv/config";
import express from "express";
import cors from "cors";
import corsOptions from "./configs/corsOptions.js";

import chatRoutes from "./routes/chat.js";
import researchpapersRoute from "./routes/researchpapers.js";
import authorRoute from "./routes/author.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.json());

app.use(clerkMiddleware());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/researchpapers", researchpapersRoute);
app.use("/api/author", authorRoute);

app.get("/", (req, res) => {
  res.json({ status: "success", msg: "Backend start" });
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

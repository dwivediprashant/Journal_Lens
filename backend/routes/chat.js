import express from "express";
const router = express.Router();
import Groq from "groq-sdk";
import { createRequire } from "module";
import requireAuth from "../middlewares/requireAuth.js";

router.use(requireAuth);

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const pdfStore = {};

const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

function chunkText(text, size = 500, overlap = 100) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    const chunk = words.slice(i, i + size).join(" ");
    if (chunk.trim()) chunks.push(chunk);
  }
  return chunks;
}

function getTopChunks(query, chunks, topK = 5) {
  const queryWords = new Set(query.toLowerCase().split(/\s+/));
  return chunks
    .map((chunk) => {
      const chunkWords = new Set(chunk.toLowerCase().split(/\s+/));
      const intersection = [...queryWords].filter((w) =>
        chunkWords.has(w),
      ).length;
      const score =
        intersection /
        (Math.sqrt(queryWords.size) * Math.sqrt(chunkWords.size));
      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((x) => x.chunk);
}

// POST /api/chat/ingest-text (abstract + metadata se)
router.post("/ingest-text", async (req, res) => {
  try {
    const { journalId, text } = req.body;
    if (!journalId || !text)
      return res.status(400).json({ error: "journalId and text required" });

    const chunks = chunkText(text, 500, 100);
    pdfStore[journalId] = { chunks, timestamp: Date.now() };
    res.json({ message: "Ingested", chunks: chunks.length });
  } catch (err) {
    console.error("Ingest-text error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chat/ask
router.post("/ask", async (req, res) => {
  try {
    const { journalId, question, chatHistory = [] } = req.body;

    if (!journalId || !question)
      return res.status(400).json({ error: "journalId and question required" });

    if (!pdfStore[journalId])
      return res.status(404).json({ error: "PDF not ingested yet." });

    const topChunks = getTopChunks(question, pdfStore[journalId].chunks, 5);
    const context = topChunks.join("\n\n---\n\n");

    const systemPrompt = `You are a research paper assistant.
Answer ONLY from the paper excerpts below.
If not found, say: "I couldn't find that in this paper."

PAPER EXCERPTS:
${context}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory.slice(-6),
        { role: "user", content: question },
      ],
      max_tokens: 1024,
      temperature: 0.3,
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;

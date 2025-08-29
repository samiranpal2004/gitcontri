import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  "User-Agent": "contribution-analyzer",
};
// backend/index.js
import express from "express";
import axios from "axios";
import cors from "cors";
import statsRouter from "./routes/stats.js";

const app = express();
const PORT = 5000;

// Allow frontend requests
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
    message: "Backend is running smoothly",
  });
});

// 1. Get contributors
app.get("/api/contributors/:owner/:repo", async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contributors`,
      { headers }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
    });
  }
});

// 2. Get commits
app.get("/api/commits/:owner/:repo", async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
      { headers }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get contributor stats + scoring
app.use("/api/stats", statsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

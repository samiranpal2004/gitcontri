import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
import NodeCache from "node-cache";

// cache with 5 min TTL
const cache = new NodeCache({ stdTTL: 300 });

const router = express.Router();

const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  "User-Agent": "contribution-analyzer"
};

console.log("Using token:", process.env.GITHUB_TOKEN ? "Loaded ✅" : "Missing ❌");


// ---- Config (weights) ----
const SCORING = {
  SINCE_DAYS: 60,
  MAX_COMMITS: 200,
  COMMIT_WEIGHT: 5,
  LOC_CAP: 800,
  LOC_WEIGHT: 2.0,
  ISSUE_REF_BONUS: 1.0,
  TYPE_BONUS: {
    bugfix: 3.0,
    feature: 4.0,
    test: 2.0,
    refactor: 1.5,
    docs: 1.0,
    chore: 0.5,
    general: 0.0,
  },
};

// ---- Helpers ----
const isMergeCommit = (c) => Array.isArray(c.parents) && c.parents.length > 1;
const hasIssueRef = (msg = "") => /#\d+|closes\s+#\d+|fixes\s+#\d+/i.test(msg);

const classifyByFiles = (files = []) => {
  const paths = files.map(f => (f.filename || "").toLowerCase());
  const any = (re) => paths.some(p => re.test(p));

  if (any(/(^|\/)docs?\//) || any(/readme|\.mdx?$|\.rst$|\.txt$/)) return "docs";
  if (any(/__tests__|(^|\/)tests?\/|\.test\.|\.spec\./)) return "test";
  if (any(/(^|\/)(src|app|lib|components|pages)\//)) return "feature";
  if (any(/(^|\/)\.github\/|package(-lock)?\.json$|yarn\.lock$|\.rc$|config|tsconfig\.json$/)) return "chore";
  return "general";
};

const classifyByMessage = (msg = "") => {
  const m = msg.toLowerCase();
  if (/fix|bug|patch|resolve/.test(m)) return "bugfix";
  if (/feat|feature|add|implement/.test(m)) return "feature";
  if (/refactor|cleanup/.test(m)) return "refactor";
  if (/docs?|readme/.test(m)) return "docs";
  if (/test|spec|jest|cypress/.test(m)) return "test";
  if (/chore|bump|deps|ci|build/.test(m)) return "chore";
  return "general";
};

const chooseType = (msgType, fileType) => {
  const rank = { bugfix: 6, feature: 5, test: 4, refactor: 3, docs: 2, chore: 1, general: 0 };
  return (rank[msgType] >= rank[fileType]) ? msgType : fileType;
};

const dampenedLoc = (adds = 0, dels = 0) => {
  const loc = Math.max(0, (adds || 0) + (dels || 0));
  const capped = Math.min(loc, SCORING.LOC_CAP);
  return Math.sqrt(capped) * SCORING.LOC_WEIGHT;
};

// ---- Main scoring route ----
router.get("/:owner/:repo", async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const sinceDays = Number(req.query.sinceDays ?? SCORING.SINCE_DAYS);
    const maxCommits = Number(req.query.maxCommits ?? SCORING.MAX_COMMITS);

    const cacheKey = `${owner}-${repo}-${sinceDays}-${maxCommits}`;
    if (cache.has(cacheKey)) {
      console.log("⚡ Returning cached result for", cacheKey);
      return res.json(cache.get(cacheKey));
    }

    const sinceISO = new Date(Date.now() - sinceDays * 24*60*60*1000).toISOString();

    // 1. Collect commits (paginated)
    let commits = [];
    let page = 1;
    while (commits.length < maxCommits) {
      const { data } = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`,
        { params: { per_page: 100, page, since: sinceISO }, headers }
      );
      if (!Array.isArray(data) || data.length === 0) break;
      commits.push(...data);
      if (data.length < 100) break;
      page += 1;
    }
    commits = commits.slice(0, maxCommits).filter(c => !isMergeCommit(c));

    if (commits.length === 0) return res.json([]);

    // 2. Fetch commit details
    const byUser = new Map();

    for (const c of commits) {
      const sha = c.sha;
      const msg = c.commit?.message || "";

      const { data: detail } = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
        { headers }
      );

      const adds = detail?.stats?.additions || 0;
      const dels = detail?.stats?.deletions || 0;

      const msgType = classifyByMessage(msg);
      const fileType = classifyByFiles(detail?.files || []);
      const type = chooseType(msgType, fileType);

      const login = c.author?.login || detail?.author?.login || c.commit?.author?.name || "unknown";
      const avatar = c.author?.avatar_url || detail?.author?.avatar_url || "";

      let score = SCORING.COMMIT_WEIGHT + dampenedLoc(adds, dels) + (SCORING.TYPE_BONUS[type] || 0);
      if (hasIssueRef(msg)) score += SCORING.ISSUE_REF_BONUS;

      if (!byUser.has(login)) {
        byUser.set(login, {
          username: login,
          avatar,
          commits: 0,
          additions: 0,
          deletions: 0,
          types: { bugfix: 0, feature: 0, test: 0, refactor: 0, docs: 0, chore: 0, general: 0 },
          score: 0,
        });
      }

      const u = byUser.get(login);
      u.commits += 1;
      u.additions += adds;
      u.deletions += dels;
      u.types[type] += 1;
      u.score += score;
    }

    const result = [...byUser.values()]
      .map(u => ({
        username: u.username,
        avatar: u.avatar,
        commits: u.commits,
        additions: u.additions,
        deletions: u.deletions,
        breakdown: u.types,
        score: Number(u.score.toFixed(1)),
      }))
      .sort((a, b) => b.score - a.score);

    // ✅ Save result in cache
    cache.set(cacheKey, result);

    res.json(result);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});



export default router;

# commitScope — GitHub Contribution Analyzer

![commitScope](https://img.shields.io/badge/commitScope-GitHub%20Contribution%20Analyzer-6366f1)
![Version](https://img.shields.io/badge/version-1.1.0-22c55e)
![License](https://img.shields.io/badge/license-MIT-3b82f6)
![Live](https://img.shields.io/badge/live-commitscope.vercel.app-f59e0b)

A modern, interactive dashboard that provides deep insights into GitHub repository contributions. commitScope visualizes collaboration patterns, code changes, and developer activity — helping teams understand their development workflows at a glance.

🌐 **Live App:** [commitscope.vercel.app](https://commitscope.vercel.app)
📦 **Repo:** [github.com/samiranpal2004/gitcontri](https://github.com/samiranpal2004/gitcontri)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Application Flow](#-application-flow)
- [Key Concepts](#-key-concepts)
- [Roadmap](#-roadmap)
- [Installation](#-installation)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## 🔭 Overview

commitScope gives you a comprehensive view of any GitHub repository's collaboration patterns and code activity. By entering a public repository in the format `username/repo`, you instantly get an interactive dashboard showing contributor metrics, code change breakdowns, leaderboards, and feature vs. bug-fix distributions.

**Why commitScope?** Understanding contribution patterns helps teams recognize valuable members, distribute work more effectively, and make data-driven decisions about project development. Whether you're a solo dev reviewing open-source contributions or a team lead tracking effort distribution — commitScope has you covered.

> 🔒 **Coming soon:** Private repository support via GitHub OAuth — see [Roadmap](#-roadmap).

---

## ✨ Features

- **Repository Analysis** — Enter any public GitHub repository to analyze instantly
- **Contributor Statistics** — View detailed per-contributor metrics
- **Interactive Dashboard** — Dynamic filtering and data visualizations
- **Contribution Leaderboard** — Rank contributors by commits, features, or bug fixes
- **Code Change Analysis** — Visualize lines added vs. deleted per contributor
- **Feature & Bug Fix Tracking** — Understand the distribution of development efforts
- **Responsive UI** — Works across desktop and mobile screen sizes
- **Smooth Animations** — Powered by Framer Motion for a polished experience

---

## 🏗️ Project Structure

```
gitcontri/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # UI components (charts, cards, leaderboard, etc.)
│   │   ├── styles/            # Global CSS and theme variables
│   │   ├── App.jsx            # Main application component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   └── index.html             # HTML template
├── backend/                   # Node.js/Express API server
│   ├── index.js               # Server entry point
│   ├── routes/                # API route handlers
│   └── services/              # Business logic & GitHub API integration
├── ARCHITECTURE-EXPLAINED.md  # System design documentation
├── DEPLOYMENT-GUIDE.md        # Step-by-step deployment instructions
├── QUICKSTART.md              # Quick start for local development
├── TROUBLESHOOTING.md         # Common issues and fixes
└── README.md                  # Project documentation
```

---

## 🛠️ Technologies Used

### Frontend

| Library | Purpose |
|---|---|
| **React** | Core UI library |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Interactive data visualizations |
| **Framer Motion** | Smooth animations and transitions |
| **Shadcn UI** | Accessible component library (Radix UI) |
| **Lucide React** | Icon library |

### Backend

| Library | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express** | REST API framework |
| **Axios** | HTTP client for GitHub API requests |
| **GitHub REST API** | Data source for repository information |

---

## 🔄 Application Flow

```
User Input (username/repo)
        ↓
Frontend sends request to Express backend
        ↓
Backend calls GitHub REST API (with optional auth token)
        ↓
Server processes & enriches raw data
        ↓
Frontend receives structured metrics
        ↓
Dashboard renders interactive charts & leaderboard
        ↓
User filters, sorts, and explores the data
```

---

## 💡 Key Concepts

### Contribution Metrics

- **Commits** — Direct code contributions tracked in history
- **Pull Requests** — Proposed changes submitted for review
- **Code Changes** — Lines of code added or deleted
- **Features Added** — New functionality introduced (inferred from commit messages)
- **Bugs Fixed** — Issues resolved in the codebase (inferred from commit messages)

### Visualization Approaches

- **Bar Charts** — Compare contributor activity side by side
- **Pie Charts** — Show proportional distributions across the team
- **Progress Bars** — Visualize percentages and relative effort
- **Leaderboards** — Rank contributors by any available metric
- **Stat Cards** — Focused summaries for specific repository metrics

---

## 🗺️ Roadmap

### ✅ Current (v1.1.0)
- Public repository analysis
- Contributor leaderboard and charts
- Code additions/deletions visualization
- Feature vs. bug-fix breakdown

### 🔜 Upcoming (v1.2.0)
- **🔐 Private Repository Support via GitHub OAuth**
  - "Sign in with GitHub" button
  - OAuth token used server-side for private repo API access
  - Session-based token storage (never exposed to frontend)
- **Skeleton loading states** for a smoother data-fetch experience
- **Improved error messages** — specific errors for 404, rate limits, and private repos
- **API rate limit indicator** in the footer
- **Recent repo history** via localStorage for faster re-analysis
- **"Share Analysis" button** — copy a pre-filled URL to share results
- **Response caching** on the backend (5-minute TTL) to reduce GitHub API calls

### 🔮 Future Ideas (v2.0.0)
- Commit timeline heatmap per contributor
- Language breakdown per contributor
- Compare two repositories side by side
- Export dashboard as PDF or PNG

---

## 🚀 Installation

### Prerequisites

- Node.js v14+
- npm or yarn
- A GitHub Personal Access Token (optional, but recommended for higher API rate limits)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Required for private repo support (optional for public repos)
GITHUB_TOKEN=your_github_personal_access_token

# Server port
PORT=5000

# Frontend origin (for CORS)
CLIENT_URL=http://localhost:5173
```

> **Tip:** Generate a GitHub token at **Settings → Developer Settings → Personal Access Tokens**. Give it `repo` scope for private repository access.

---

## 💻 Development

### Running the Full Stack Locally

```bash
# Terminal 1 — Start backend
cd backend
npm run dev

# Terminal 2 — Start frontend
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173` and proxies API calls to `http://localhost:5000`.

---

## 📦 Deployment

commitScope is deployed on Vercel (frontend + backend as serverless functions).

### Frontend

```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel or any static host
```

### Backend

```bash
cd backend
npm run build
# Deploy to Vercel, Railway, Render, or any Node.js host
```

For detailed deployment steps, see [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md).

---

## 📚 API Documentation

Base URL: `https://gitcontri-backend.vercel.app`

### `GET /api/contributors/:username/:repo`

Returns a list of all contributors and their activity metrics for the specified repository.

**Example:**
```
GET /api/contributors/facebook/react
```

### `GET /api/stats/:username/:repo`

Returns aggregated statistics for the repository — total commits, top contributors, code change summary, and more.

**Example:**
```
GET /api/stats/facebook/react
```

> Both endpoints require a valid public repository. Private repository support is planned for v1.2.0 via OAuth token forwarding.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Samiran Pal](https://github.com/samiranpal2004) — Copyright © 2025

⭐ If you find commitScope useful, consider starring the repo!

</div>

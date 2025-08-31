# GitHub Contribution Analyzer

![GitHub Contribution Analyzer](https://img.shields.io/badge/GitHub-Contribution%20Analyzer-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A modern, interactive dashboard that provides deep insights into GitHub repository contributions. This application visualizes collaboration patterns, code changes, and developer activity to help teams understand their development workflows.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Application Flow](#application-flow)
- [Key Concepts](#key-concepts)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [License](#license)

## 🔭 Overview

The GitHub Contribution Analyzer provides a comprehensive view of a repository's collaboration patterns and code activity. By visualizing contributor metrics, teams can recognize key contributors, understand work distribution, identify specialists in bug fixes or feature development, and gain insights into code change patterns.

**Why this project matters:** Understanding contribution patterns helps teams recognize valuable members, distribute work more effectively, and make data-driven decisions about project development.

## ✨ Features

- **Repository Analysis:** Enter any public GitHub repository to analyze.
- **Contributor Statistics:** View detailed metrics for each contributor.
- **Interactive Dashboard:** Data visualizations with dynamic filtering.
- **Contribution Leaderboard:** Rank contributors by metrics like commits, features, or bug fixes.
- **Code Change Analysis:** Visualize code additions and deletions.
- **Feature and Bug Fix Tracking:** Understand the distribution of development efforts.

## 🏗️ Project Structure

```
gitcontri/
├── frontend/           # React frontend application
│   ├── src/            # Source code
│   │   ├── components/ # UI components
│   │   ├── styles/     # Global CSS and theme
│   │   ├── App.jsx     # Main application component
│   │   └── main.jsx    # Entry point
│   ├── public/         # Static assets
│   └── index.html      # HTML template
├── backend/            # Node.js backend API
│   ├── index.js        # Server entry point
│   ├── routes/         # API routes
│   └── services/       # Business logic services
└── README.md           # Project documentation
```

## 🛠️ Technologies Used

### Frontend
- **React**: Core library for building the UI
- **Framer Motion**: Animation library for smooth transitions
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Recharts**: Composable charting library for data visualization
- **Lucide React**: Icon library
- **Shadcn UI**: Component library built on Radix UI

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express**: Web framework for the API
- **Axios**: HTTP client for API requests
- **GitHub API**: Data source for repository information

## 🔄 Application Flow

1. **User Input**: User enters a GitHub repository in the format `username/repository`.
2. **API Request**: The application sends requests to the backend server.
3. **Data Fetching**: The server fetches data from GitHub's API.
4. **Data Processing**: The server processes raw data to extract meaningful metrics.
5. **Visualization**: The frontend renders interactive charts and statistics.
6. **User Interaction**: Users can filter, sort, and explore the data.

## 💡 Key Concepts

### Contribution Metrics
- **Commits**: Direct code contributions to the repository
- **Pull Requests**: Proposed changes submitted for review
- **Code Changes**: Lines of code added or deleted
- **Features Added**: New functionality introduced
- **Bugs Fixed**: Issues resolved in the codebase

### Visualization Approaches
- **Bar Charts**: Compare contributor activities
- **Pie Charts**: Show proportional distributions
- **Progress Bars**: Visualize percentages and completion
- **Leaderboards**: Rank contributors by different metrics
- **Cards**: Display focused information about specific metrics

### UI/UX Principles
- **Modern Design**: Clean interface with bold highlights
- **Animation**: Smooth transitions for enhanced user experience
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Designed with a11y best practices

## 🚀 Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 💻 Development

### Running the Full Stack
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Environment Variables
Create a `.env` file in the backend directory:
```
GITHUB_TOKEN=your_github_token
PORT=5000
```

## 📦 Deployment

### Frontend Deployment
```bash
# Build the application
cd frontend
npm run build
```

### Backend Deployment
```bash
# Create production build
cd backend
npm run build
```

## 📚 API Documentation

### Endpoints

#### GET /api/contributors/:username/:repo
Returns all contributors for a repository.

#### GET /api/stats/:username/:repo
Returns detailed statistics for a repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created by [Samiran Pal](https://github.com/samiranpal2004) | Copyright © 2025

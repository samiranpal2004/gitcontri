# 🚀 Quick Start Guide

## Running the Application

### Option 1: Using Start Scripts (Windows)

**Step 1: Start Backend**

```bash
# Double-click or run:
start-backend.bat
```

Keep this window open!

**Step 2: Start Frontend** (in a new terminal)

```bash
# Double-click or run:
start-frontend.bat
```

---

### Option 2: Manual Start

**Terminal 1 - Backend:**

```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## ❌ Getting "Failed to Fetch" Error?

### Most Common Solution:

1. Make sure the **backend server is running** (see Terminal 1 above)
2. Check that you see: `Backend running on http://localhost:5000`
3. Try the repository again

### Still Not Working?

1. Open `backend/test-api.html` in your browser
2. Click "Test Backend Health" - if this fails, your backend isn't running
3. See `TROUBLESHOOTING.md` for detailed debugging steps

---

## 📝 Testing with Sample Repositories

Try these to verify everything works:

- `facebook/react`
- `microsoft/vscode`
- `vercel/next.js`

---

## 🔑 GitHub Token Setup

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token
4. Update `backend/.env`:
   ```
   GITHUB_TOKEN=your_token_here
   ```
5. Restart the backend server

---

## 🆘 Need Help?

Check these files:

- `TROUBLESHOOTING.md` - Detailed debugging guide
- `backend/test-api.html` - Interactive API tester
- `backend/test-connection.js` - Test GitHub API connection

---

## 📦 Project Structure

```
gitcontri/
├── backend/                # Node.js API server
│   ├── src/
│   │   ├── server.js      # Main server file
│   │   └── routes/        # API routes
│   ├── .env               # GitHub token (create this!)
│   ├── test-api.html      # API testing tool
│   └── test-connection.js # Token validation
├── frontend/               # React application
│   ├── src/
│   │   └── App.jsx        # Main app component
│   └── ...
├── start-backend.bat      # Quick start script (Windows)
└── start-frontend.bat     # Quick start script (Windows)
```

---

## ✅ Checklist

Before reporting issues, verify:

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] You see "Backend running on http://localhost:5000"
- [ ] GitHub token is set in `backend/.env`
- [ ] Token is valid (run `node backend/test-connection.js`)
- [ ] Frontend is running (`npm run dev` in frontend folder)
- [ ] Using repository format: `owner/repository` (e.g., `facebook/react`)
- [ ] Repository is public (private repos won't work without additional permissions)

---

**Ready to analyze? Start both servers and enter a repository!** 🎉

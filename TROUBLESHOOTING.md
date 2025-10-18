# 🔧 Troubleshooting Guide: "Failed to Fetch" Error

## ⚡ Quick Fix (Most Common Issue)

**The backend server is probably not running!**

### Solution:

1. Open a new terminal/command prompt
2. Navigate to backend folder:
   ```bash
   cd d:\Projects\react\gitcontri\backend
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
4. You should see: `Backend running on http://localhost:5000`
5. Keep this terminal window open
6. Go back to your frontend and try again

---

## 🧪 Use the API Tester

Open `backend/test-api.html` in your browser to test each endpoint individually.

This tool will help you identify exactly where the issue is:

- ✅ Backend health check
- ✅ Contributors endpoint
- ✅ Stats endpoint

---

## Problem

When entering a valid public repository name and clicking "Analyze", you see a "Failed to fetch" error.

## Common Causes & Solutions

### 1. ✅ Backend Server Not Running

**Check if backend is running:**

```bash
# Navigate to backend folder
cd backend

# Start the server
npm run dev
```

**Expected output:**

```
Backend running on http://localhost:5000
```

**Test the backend:**
Open your browser and go to: `http://localhost:5000/health`

You should see:

```json
{
  "status": "ok",
  "uptime": 12.345,
  "timestamp": 1234567890,
  "message": "Backend is running smoothly"
}
```

---

### 2. 🔑 GitHub Token Issues

**Verify your token:**

```bash
# In backend folder
cd backend

# Run the test script
node test-connection.js
```

**If the token is invalid, you'll see:**

- ❌ Authentication failed
- Status: 401 Unauthorized

**Fix:**

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate a new token with `repo` scope
3. Update `backend/.env`:
   ```
   GITHUB_TOKEN=your_new_token_here
   ```
4. Restart the backend server

---

### 3. 🌐 CORS Issues

**Symptoms:**

- Console shows "CORS policy" error
- Fetch fails with network error

**Fix:**
Check `backend/src/server.js` has CORS enabled:

```javascript
app.use(cors({ origin: "*" }));
```

---

### 4. 🔗 API Base URL Mismatch

**Check frontend configuration:**

The frontend uses: `http://localhost:5000` (default)

**Verify in browser console:**
When you load the frontend, you should see:

```
API Base URL: http://localhost:5000
```

**If using a different port, create `frontend/.env`:**

```
VITE_API_BASE_URL=http://localhost:5000
```

---

### 5. 📝 Testing Step-by-Step

**Test 1: Backend Health Check**

```bash
# Open a browser or use curl
http://localhost:5000/health
```

**Test 2: Contributors Endpoint**

```bash
# Test with a known repository (e.g., facebook/react)
http://localhost:5000/api/contributors/facebook/react
```

**Test 3: Stats Endpoint**

```bash
http://localhost:5000/api/stats/facebook/react
```

**Test 4: Frontend in Browser**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Enter "facebook/react" in your app
4. Click "Analyze"
5. Check the network requests - what status code do you see?

---

### 6. 🐛 Debugging Checklist

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Backend health endpoint works (`http://localhost:5000/health`)
- [ ] GitHub token is valid (run `node test-connection.js`)
- [ ] Frontend is running (`npm run dev` in frontend folder)
- [ ] No CORS errors in browser console
- [ ] Network tab shows requests to `localhost:5000`

---

### 7. 🔍 Common Error Messages

**"Failed to fetch contributors: Not Found"**

- Repository name is incorrect
- Repository is private
- Format should be: `owner/repository` (e.g., `facebook/react`)

**"Failed to fetch contributors: Forbidden"**

- GitHub token is invalid
- Token lacks permissions
- Rate limit exceeded

**"Failed to fetch: NetworkError"**

- Backend is not running
- Wrong API URL
- Firewall blocking localhost

---

### 8. ✨ Quick Fix Commands

**Start everything from scratch:**

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

---

### 9. 📞 Still Not Working?

**Collect this information:**

1. Backend terminal output (what does it show?)
2. Frontend browser console errors (F12 → Console tab)
3. Network tab (F12 → Network tab) - what requests are made?
4. Result of `node test-connection.js` in backend folder

**Common fixes:**

- Restart both servers
- Clear browser cache
- Check Windows Firewall isn't blocking port 5000
- Try a different browser
- Check if another app is using port 5000

---

## 🎯 Most Likely Issue

Based on your setup, the most common issue is:

**Backend server is not running!**

**Solution:**

1. Open a terminal
2. Navigate to backend: `cd d:\Projects\react\gitcontri\backend`
3. Run: `npm run dev`
4. Keep this terminal open
5. Refresh your frontend and try again

---

## 📌 Testing with a Known Repository

Try these repositories to test:

- `facebook/react`
- `microsoft/vscode`
- `torvalds/linux`

These are guaranteed to be public and have contributors.

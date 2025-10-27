# 🚀 QUICK DEPLOYMENT REFERENCE

## The Problem

❌ https://commitscope.vercel.app/ only works when YOUR backend runs locally
✅ Need to deploy backend so it works for EVERYONE

---

## The Solution (3 Steps)

### 1️⃣ Deploy Backend

```bash
cd backend
vercel --prod
```

**Copy the URL you get!** Example: `https://gitcontri-backend-xyz.vercel.app`

### 2️⃣ Set Environment Variables

**On Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Click on your **backend** project
3. Settings → Environment Variables
4. Add:
   - Name: `GITHUB_TOKEN`
   - Value: `your_github_token_here`
   - Check: Production, Preview, Development
5. Save

### 3️⃣ Update & Redeploy Frontend

```bash
cd ../frontend
echo "VITE_API_BASE_URL=https://your-backend-url.vercel.app" > .env.production
vercel --prod
```

---

## Quick Deploy (Use This!)

**Windows:**

```bash
deploy.bat
```

**Mac/Linux:**

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Verify It Works

1. Visit: https://commitscope.vercel.app/
2. Enter: `facebook/react`
3. Click: Analyze
4. Should work WITHOUT running local backend! ✅

---

## Common Issues

| Problem               | Solution                                                     |
| --------------------- | ------------------------------------------------------------ |
| "Failed to fetch"     | Backend not deployed - Run `vercel --prod` in backend folder |
| "Unauthorized"        | Add `GITHUB_TOKEN` to backend's Vercel env vars              |
| Still using localhost | Update `frontend/.env.production` with backend URL           |
| Changes not visible   | Redeploy: `vercel --prod`                                    |

---

## Architecture

```
User Browser
    ↓
https://commitscope.vercel.app (Frontend)
    ↓
https://gitcontri-backend.vercel.app (Backend)
    ↓
GitHub API
```

All publicly accessible = Works everywhere! 🌍

---

## Files to Check

- ✅ `backend/vercel.json` - Backend config
- ✅ `frontend/.env.production` - Backend URL
- ✅ Backend Vercel env vars - `GITHUB_TOKEN`

---

## Need More Help?

- 📖 Read: `DEPLOYMENT-GUIDE.md`
- 🏗️ See: `ARCHITECTURE-EXPLAINED.md`
- 🔧 Debug: `TROUBLESHOOTING.md`

---

**TL;DR:** Deploy backend → Set GITHUB_TOKEN → Update frontend URL → Redeploy frontend → Done! ✨

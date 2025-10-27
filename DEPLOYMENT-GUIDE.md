# 🚀 Deployment Guide for Vercel

## Problem

Your frontend at https://commitscope.vercel.app/ only works when backend runs locally because it's trying to connect to `localhost:5000`.

## Solution

Deploy the backend separately and configure the frontend to use the deployed backend URL.

---

## 📋 Step-by-Step Deployment

### STEP 1: Deploy Backend First

1. **Navigate to backend folder:**

   ```bash
   cd d:\Projects\react\gitcontri\backend
   ```

2. **Initialize Vercel (if not done already):**

   ```bash
   vercel
   ```

   - Choose "Link to existing project" or "Create new project"
   - Name it something like: `gitcontri-backend`

3. **Set Environment Variables on Vercel:**

   - Go to: https://vercel.com/dashboard
   - Select your backend project
   - Go to **Settings → Environment Variables**
   - Add these variables:
     ```
     Name: GITHUB_TOKEN
     Value: your_github_personal_access_token
     Environments: Production, Preview, Development (check all)
     ```
   - Click **Save**

4. **Deploy to Production:**

   ```bash
   vercel --prod
   ```

5. **Note Your Backend URL:**
   After deployment, you'll see something like:
   ```
   ✅ Production: https://gitcontri-backend.vercel.app
   ```
   **Copy this URL!**

---

### STEP 2: Update Frontend Configuration

1. **Update `.env.production` file:**
   Open `frontend/.env.production` and replace with your actual backend URL:

   ```
   VITE_API_BASE_URL=https://gitcontri-backend.vercel.app
   ```

   (Replace with YOUR actual backend URL from Step 1)

2. **Or set on Vercel Dashboard:**
   - Go to your frontend project on Vercel
   - Settings → Environment Variables
   - Add:
     ```
     Name: VITE_API_BASE_URL
     Value: https://gitcontri-backend.vercel.app
     Environments: Production (check)
     ```

---

### STEP 3: Redeploy Frontend

1. **Navigate to frontend:**

   ```bash
   cd d:\Projects\react\gitcontri\frontend
   ```

2. **Build to verify it works:**

   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

---

## ✅ Verification Steps

### Test Backend:

1. Visit: `https://your-backend-url.vercel.app/health`
2. Should see: `{"status":"ok",...}`

### Test API:

1. Visit: `https://your-backend-url.vercel.app/api/contributors/facebook/react`
2. Should see: JSON data with contributors

### Test Frontend:

1. Visit: https://commitscope.vercel.app/
2. Enter: `facebook/react`
3. Click: **Analyze Repository**
4. Should see: Statistics and contributor data (no need for local backend!)

---

## 🔧 Troubleshooting

### Issue 1: "Failed to fetch" Error

**Cause:** Backend not deployed or URL wrong

**Fix:**

1. Check backend is deployed: `vercel ls` in backend folder
2. Verify `VITE_API_BASE_URL` matches your backend URL
3. Test backend URL directly in browser

### Issue 2: CORS Error

**Cause:** Backend not allowing frontend domain

**Fix:** Backend already has `cors({ origin: "*" })` which allows all domains. If you still get CORS errors, update `backend/src/server.js`:

```javascript
app.use(
  cors({
    origin: ["https://commitscope.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
```

### Issue 3: 401 Unauthorized

**Cause:** GitHub token not set on Vercel

**Fix:**

1. Go to Vercel Dashboard → Backend Project → Settings → Environment Variables
2. Add `GITHUB_TOKEN` with your token
3. Redeploy: `vercel --prod`

### Issue 4: Environment Variable Not Working

**Cause:** Need to redeploy after adding env vars

**Fix:**

1. After adding environment variables on Vercel
2. Go to Deployments tab
3. Click "..." on latest deployment → "Redeploy"
4. Or run `vercel --prod` again

---

## 📝 Quick Commands Summary

```bash
# 1. Deploy Backend
cd d:\Projects\react\gitcontri\backend
vercel --prod
# Copy the URL you get!

# 2. Update Frontend .env.production
# Edit: frontend/.env.production
# Set: VITE_API_BASE_URL=https://your-backend-url.vercel.app

# 3. Deploy Frontend
cd d:\Projects\react\gitcontri\frontend
vercel --prod

# 4. Test
# Visit: https://commitscope.vercel.app/
# Try: facebook/react
```

---

## 🎯 Current Setup

### Local Development:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Works: ✅ (when both running)

### Production:

- Frontend: https://commitscope.vercel.app/
- Backend: https://gitcontri-backend.vercel.app/ (needs deployment)
- Will work: ✅ (after following this guide)

---

## 📌 Important Notes

1. **Two Separate Deployments:** Frontend and backend are deployed separately
2. **Environment Variables:** Must be set on Vercel dashboard for production
3. **Rebuild Required:** After changing env vars, redeploy the project
4. **CORS:** Already configured to allow all origins
5. **GitHub Token:** Must be added to backend's Vercel environment variables

---

## ✨ Success Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend URL noted (e.g., `https://gitcontri-backend.vercel.app`)
- [ ] `GITHUB_TOKEN` added to backend's Vercel environment variables
- [ ] Backend health endpoint working
- [ ] Frontend `.env.production` updated with backend URL
- [ ] Frontend redeployed to Vercel
- [ ] Can analyze repositories on https://commitscope.vercel.app/ without local backend
- [ ] Works on different devices and networks

---

**Once complete, your app will work on ANY device, ANYWHERE! 🌍**

Need help? Check the error in browser console (F12) and match it with the troubleshooting section above.

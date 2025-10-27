#!/bin/bash

echo "╔════════════════════════════════════════════════╗"
echo "║   GitHub Contribution Analyzer Deployment     ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "Install it with: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Deploy Backend
echo "📦 Step 1: Deploying Backend..."
echo "────────────────────────────────────────────────"
cd backend || exit

echo "Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Backend deployed successfully!"
    echo ""
    echo "⚠️  IMPORTANT: Copy the backend URL above!"
    echo ""
    read -p "Enter your backend URL (e.g., https://gitcontri-backend.vercel.app): " BACKEND_URL
    
    # Update frontend .env.production
    cd ../frontend || exit
    echo "VITE_API_BASE_URL=$BACKEND_URL" > .env.production
    echo "✅ Updated frontend/.env.production with: $BACKEND_URL"
    echo ""
else
    echo "❌ Backend deployment failed!"
    exit 1
fi

# Deploy Frontend
echo "📦 Step 2: Deploying Frontend..."
echo "────────────────────────────────────────────────"

echo "Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully!"
    echo ""
    
    echo "Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "╔════════════════════════════════════════════════╗"
        echo "║  ✅ DEPLOYMENT SUCCESSFUL!                     ║"
        echo "╚════════════════════════════════════════════════╝"
        echo ""
        echo "🎉 Your app is now live!"
        echo ""
        echo "Frontend: https://commitscope.vercel.app/"
        echo "Backend:  $BACKEND_URL"
        echo ""
        echo "⚠️  Don't forget to add GITHUB_TOKEN to backend env vars:"
        echo "   1. Go to: https://vercel.com/dashboard"
        echo "   2. Select backend project"
        echo "   3. Settings → Environment Variables"
        echo "   4. Add: GITHUB_TOKEN = your_token"
        echo "   5. Redeploy if needed"
        echo ""
        echo "Test your deployment at: https://commitscope.vercel.app/"
        echo ""
    else
        echo "❌ Frontend deployment failed!"
        exit 1
    fi
else
    echo "❌ Frontend build failed!"
    exit 1
fi

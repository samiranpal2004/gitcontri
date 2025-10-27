@echo off
echo =========================================================
echo    GitHub Contribution Analyzer - Deployment Script
echo =========================================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Vercel CLI not found!
    echo Please install it with: npm install -g vercel
    pause
    exit /b 1
)

echo [OK] Vercel CLI found
echo.

echo =========================================================
echo   STEP 1: Deploying Backend
echo =========================================================
echo.

cd backend
echo Deploying backend to Vercel...
call vercel --prod

if %errorlevel% neq 0 (
    echo [ERROR] Backend deployment failed!
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Backend deployed!
echo.
echo =========================================================
echo   IMPORTANT: Copy your backend URL above
echo   Example: https://gitcontri-backend.vercel.app
echo =========================================================
echo.

set /p BACKEND_URL="Enter your backend URL: "

echo.
echo Updating frontend configuration...
cd ..\frontend

echo VITE_API_BASE_URL=%BACKEND_URL% > .env.production

echo [OK] Updated frontend/.env.production
echo.

echo =========================================================
echo   STEP 2: Building and Deploying Frontend
echo =========================================================
echo.

echo Building frontend...
call npm run build

if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)

echo [OK] Frontend built successfully
echo.

echo Deploying frontend to Vercel...
call vercel --prod

if %errorlevel% neq 0 (
    echo [ERROR] Frontend deployment failed!
    pause
    exit /b 1
)

echo.
echo =========================================================
echo   DEPLOYMENT COMPLETE!
echo =========================================================
echo.
echo Frontend: https://commitscope.vercel.app/
echo Backend:  %BACKEND_URL%
echo.
echo =========================================================
echo   IMPORTANT: Set Environment Variables
echo =========================================================
echo.
echo Don't forget to add GITHUB_TOKEN to your backend:
echo 1. Go to: https://vercel.com/dashboard
echo 2. Select your backend project
echo 3. Go to Settings - Environment Variables
echo 4. Add: GITHUB_TOKEN = your_github_token
echo 5. Redeploy if needed: vercel --prod
echo.
echo Test your deployment: https://commitscope.vercel.app/
echo.

pause

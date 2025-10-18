@echo off
echo ===============================================
echo   GitHub Contribution Analyzer - Quick Start
echo ===============================================
echo.

echo [1/4] Checking backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed.
)

echo.
echo [2/4] Testing GitHub token...
node test-connection.js
echo.

echo [3/4] Starting backend server...
echo.
echo ===============================================
echo   Backend server starting on http://localhost:5000
echo   Keep this window open!
echo ===============================================
echo.

call npm run dev

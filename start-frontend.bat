@echo off
echo ===============================================
echo   GitHub Contribution Analyzer - Frontend
echo ===============================================
echo.

echo [1/3] Checking frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)

echo.
echo [2/3] Starting frontend server...
echo.
echo ===============================================
echo   Frontend server starting
echo   Open your browser to the URL shown below
echo ===============================================
echo.

call npm run dev

@echo off
echo ========================================
echo    Starting AGHEP Backend Server
echo ========================================
echo.

cd backend
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)

echo Starting server on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
@echo off
echo ========================================
echo    AGHEP Backend Setup Script
echo ========================================
echo.

echo [1/6] Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo [2/6] Navigating to backend directory...
cd backend
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)
echo ✅ In backend directory

echo.
echo [3/6] Installing dependencies...
echo This may take a few minutes...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo [4/6] Creating database tables...
node scripts/migrate.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database tables!
    echo Make sure PostgreSQL is running on port 1221
    echo and database 'ISBAR' exists with password '1954'
    pause
    exit /b 1
)
echo ✅ Database tables created

echo.
echo [5/6] Adding sample data...
node scripts/seed.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to add sample data!
    pause
    exit /b 1
)
echo ✅ Sample data added

echo.
echo [6/6] Setup complete!
echo ========================================
echo    🎉 AGHEP Backend is ready!
echo ========================================
echo.
echo Default accounts created:
echo - admin@aghep.com (password: admin123)
echo - student@demo.com (password: student123)
echo.
echo To start the server, run:
echo   npm run dev
echo.
echo The server will be available at:
echo   http://localhost:5000
echo.
echo Press any key to start the server now...
pause >nul

echo.
echo Starting development server...
npm run dev
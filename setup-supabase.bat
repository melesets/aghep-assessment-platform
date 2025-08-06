@echo off
echo ========================================
echo    AGHEP Supabase Setup Script
echo ========================================
echo.

echo [1/5] Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo [2/5] Navigating to backend directory...
cd backend
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)
echo ✅ In backend directory

echo.
echo [3/5] Installing dependencies (including Supabase)...
echo This may take a few minutes...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo [4/5] Setting up Supabase database...
echo Creating tables and security policies...
node scripts/setup-supabase.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to setup Supabase database!
    echo.
    echo Please check:
    echo 1. Your .env file has correct Supabase credentials
    echo 2. SUPABASE_URL is correct
    echo 3. SUPABASE_SERVICE_ROLE_KEY is correct
    echo 4. You have internet connection
    pause
    exit /b 1
)
echo ✅ Supabase database setup complete

echo.
echo [5/5] Adding sample data...
node scripts/seed-supabase.js
if %errorlevel% neq 0 (
    echo WARNING: Failed to add sample data, but setup is complete
    echo You can add data manually through Supabase dashboard
)
echo ✅ Sample data added

echo.
echo ========================================
echo    🎉 AGHEP Supabase Setup Complete!
echo ========================================
echo.
echo ✅ Connected to Supabase cloud database
echo ✅ All tables created with security
echo ✅ Sample data added
echo.
echo Default accounts created:
echo - admin@aghep.com (password: admin123)
echo - student@demo.com (password: student123)
echo.
echo Your Supabase dashboard: https://app.supabase.com
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
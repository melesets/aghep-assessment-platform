@echo off
echo ========================================
echo    AGHEP Complete Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
cd backend
call npm install
cd ..
call npm install

echo.
echo Step 2: Testing Supabase connection...
node test-setup.js

echo.
echo ========================================
echo    MANUAL STEPS REQUIRED
echo ========================================
echo.
echo 1. Go to your Supabase Dashboard:
echo    https://flgdutcvnynddnorfofb.supabase.co
echo.
echo 2. Navigate to SQL Editor (left sidebar)
echo.
echo 3. Copy and paste the entire content from:
echo    supabase-schema.sql
echo.
echo 4. Click "Run" to create all tables
echo.
echo 5. After tables are created, run:
echo    cd backend
echo    node scripts/create-admin.js
echo.
echo This will create admin and demo accounts.
echo.
echo ========================================
echo    LOGIN CREDENTIALS (after setup)
echo ========================================
echo.
echo Admin Account:
echo   Email: admin@aghep.com
echo   Password: admin123456
echo.
echo Student Demo:
echo   Email: student@demo.com  
echo   Password: demo123456
echo.
echo ⚠️  IMPORTANT: Change admin password after first login!
echo.
pause
@echo off
echo ========================================
echo    Database Connection Test
echo ========================================
echo.

cd backend
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)

echo Testing database connection...
echo.

node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 1221,
  database: 'ISBAR',
  user: 'postgres',
  password: '1954'
});

pool.query('SELECT NOW() as current_time, version() as pg_version')
  .then(result => {
    console.log('✅ Database connection successful!');
    console.log('📅 Current time:', result.rows[0].current_time);
    console.log('🗄️  PostgreSQL version:', result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]);
    
    return pool.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = ''public''');
  })
  .then(result => {
    console.log('📊 Tables in database:', result.rows[0].table_count);
    process.exit(0);
  })
  .catch(error => {
    console.log('❌ Database connection failed!');
    console.log('Error:', error.message);
    console.log('');
    console.log('Please check:');
    console.log('1. PostgreSQL is running');
    console.log('2. Port 1221 is correct');
    console.log('3. Database ISBAR exists');
    console.log('4. Password is 1954');
    process.exit(1);
  });
"

echo.
pause
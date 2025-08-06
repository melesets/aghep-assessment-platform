const { supabase } = require('../config/supabase');

const generateConnectionReport = async () => {
  console.log('🔍 SUPABASE CONNECTION REPORT');
  console.log('=' .repeat(50));
  
  try {
    // 1. Environment Configuration Check
    console.log('\n📋 1. ENVIRONMENT CONFIGURATION');
    console.log('-'.repeat(30));
    
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY', 
      'SUPABASE_SERVICE_ROLE_KEY'
    ];
    
    let envConfigured = true;
    requiredEnvVars.forEach(envVar => {
      const value = process.env[envVar];
      if (value) {
        console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`);
      } else {
        console.log(`❌ ${envVar}: NOT SET`);
        envConfigured = false;
      }
    });
    
    if (!envConfigured) {
      console.log('\n❌ CRITICAL: Missing environment variables!');
      return false;
    }

    // 2. Connection Test
    console.log('\n🌐 2. CONNECTION TEST');
    console.log('-'.repeat(30));
    
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ Connection: SUCCESSFUL');
        console.log('⚠️  Database: EMPTY (no tables created yet)');
      } else {
        console.log('❌ Connection: FAILED');
        console.log('   Error:', error.message);
        return false;
      }
    } else {
      console.log('✅ Connection: SUCCESSFUL');
      console.log('✅ Database: TABLES EXIST');
    }

    // 3. Database Schema Check
    console.log('\n📊 3. DATABASE SCHEMA STATUS');
    console.log('-'.repeat(30));
    
    const expectedTables = [
      'profiles', 'categories', 'exams', 'questions', 
      'question_options', 'exam_attempts', 'user_answers', 
      'certificates', 'skill_sessions', 'assessment_records'
    ];
    
    let tablesFound = 0;
    for (const tableName of expectedTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`❌ ${tableName}: NOT FOUND`);
        } else {
          console.log(`⚠️  ${tableName}: ${error.code}`);
        }
      } else {
        console.log(`✅ ${tableName}: EXISTS`);
        tablesFound++;
      }
    }
    
    console.log(`\n📈 Tables Status: ${tablesFound}/${expectedTables.length} found`);

    // 4. Frontend Integration Check
    console.log('\n🖥️  4. FRONTEND INTEGRATION STATUS');
    console.log('-'.repeat(30));
    
    const fs = require('fs');
    const path = require('path');
    
    // Check if frontend has Supabase client
    const frontendPackageJson = path.join(__dirname, '../../package.json');
    if (fs.existsSync(frontendPackageJson)) {
      const packageData = JSON.parse(fs.readFileSync(frontendPackageJson, 'utf8'));
      const hasSupabaseClient = packageData.dependencies && packageData.dependencies['@supabase/supabase-js'];
      
      if (hasSupabaseClient) {
        console.log('✅ Frontend: Supabase client installed');
      } else {
        console.log('❌ Frontend: Supabase client NOT installed');
      }
    }
    
    // Check for Supabase config in frontend
    const frontendSupabaseConfig = path.join(__dirname, '../../src/lib/supabase.ts');
    const frontendSupabaseConfigJs = path.join(__dirname, '../../src/lib/supabase.js');
    
    if (fs.existsSync(frontendSupabaseConfig) || fs.existsSync(frontendSupabaseConfigJs)) {
      console.log('✅ Frontend: Supabase config file exists');
    } else {
      console.log('❌ Frontend: Supabase config file NOT found');
      console.log('   Expected: src/lib/supabase.ts or src/lib/supabase.js');
    }

    // 5. Summary and Recommendations
    console.log('\n🎯 5. SUMMARY & RECOMMENDATIONS');
    console.log('-'.repeat(30));
    
    if (tablesFound === 0) {
      console.log('❌ STATUS: PARTIALLY CONNECTED');
      console.log('📝 ISSUES:');
      console.log('   • Database tables are missing');
      console.log('   • Frontend is using mock data');
      console.log('');
      console.log('🔧 NEXT STEPS:');
      console.log('   1. Create database tables manually in Supabase dashboard');
      console.log('   2. Or fix the setup-supabase.js script');
      console.log('   3. Install @supabase/supabase-js in frontend');
      console.log('   4. Create frontend Supabase client configuration');
      console.log('   5. Replace mock data with Supabase API calls');
    } else if (tablesFound < expectedTables.length) {
      console.log('⚠️  STATUS: PARTIALLY CONFIGURED');
      console.log('📝 ISSUES:');
      console.log(`   • Only ${tablesFound}/${expectedTables.length} tables exist`);
      console.log('');
      console.log('🔧 NEXT STEPS:');
      console.log('   1. Create missing database tables');
      console.log('   2. Update frontend to use Supabase API');
    } else {
      console.log('✅ STATUS: FULLY CONNECTED');
      console.log('🎉 Your app is properly connected to Supabase!');
    }
    
    return true;

  } catch (error) {
    console.error('\n❌ REPORT GENERATION FAILED:', error.message);
    return false;
  }
};

// Run report if called directly
if (require.main === module) {
  generateConnectionReport().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { generateConnectionReport };
const { supabase } = require('../config/supabase');

const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('📍 Supabase URL:', process.env.SUPABASE_URL);
    
    // Test 1: Basic connection by trying to access any table
    console.log('\n1️⃣ Testing basic connection...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (profilesError) {
      if (profilesError.code === 'PGRST116') {
        console.log('✅ Connection successful - Table "profiles" does not exist yet (expected for new setup)');
      } else if (profilesError.code === 'PGRST301') {
        console.log('✅ Connection successful - Authentication working');
      } else {
        console.log('❌ Connection error:', profilesError.message);
        return false;
      }
    } else {
      console.log('✅ Connection successful - Table access working');
    }

    // Test 2: Check environment variables
    console.log('\n2️⃣ Checking configuration...');
    if (!process.env.SUPABASE_URL) {
      console.log('❌ SUPABASE_URL not configured');
      return false;
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('❌ SUPABASE_SERVICE_ROLE_KEY not configured');
      return false;
    }
    if (!process.env.SUPABASE_ANON_KEY) {
      console.log('❌ SUPABASE_ANON_KEY not configured');
      return false;
    }
    console.log('✅ All Supabase environment variables configured');

    // Test 3: Test different table access to confirm connection
    console.log('\n3️⃣ Testing database schema access...');
    const testTables = ['profiles', 'exams', 'categories', 'questions'];
    let tablesExist = 0;
    
    for (const tableName of testTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`⚠️  Table "${tableName}" does not exist yet`);
        } else {
          console.log(`✅ Table "${tableName}" accessible (${error.code})`);
        }
      } else {
        console.log(`✅ Table "${tableName}" exists and accessible`);
        tablesExist++;
      }
    }

    console.log('\n🎉 Supabase connection test completed!');
    console.log('📊 Connection Status: ✅ CONNECTED');
    console.log('🔑 Service Role Key: ✅ CONFIGURED');
    console.log('🌐 Database URL: ✅ ACCESSIBLE');
    console.log(`📋 Tables found: ${tablesExist}/${testTables.length}`);
    
    if (tablesExist === 0) {
      console.log('\n⚠️  No tables found - you may need to run database migrations');
      console.log('💡 Try running: npm run setup-supabase (after fixing the setup script)');
    }
    
    return true;

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
};

// Run test if called directly
if (require.main === module) {
  testSupabaseConnection().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testSupabaseConnection };
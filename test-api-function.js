import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzA4NzcsImV4cCI6MjA2OTMwNjg3N30.W1fLfjsFdRZE4kk-OrUZ5CAfLw5e2pols2wx2On2QYc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testApiFunction() {
  console.log('🧪 Testing API function access...');
  
  try {
    // Test the function we created
    const { data, error } = await supabase.rpc('test_api_access');
    
    if (error) {
      console.log('❌ Function call failed:', error.message);
      return false;
    }
    
    console.log('✅ Function call successful!');
    console.log('📊 Result:', data);
    
    // Now try direct table access
    console.log('\n🔍 Testing direct table access...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (catError) {
      console.log('❌ Direct table access failed:', catError.message);
    } else {
      console.log('✅ Direct table access successful!');
      console.log('📋 Categories data:', categories);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

testApiFunction();
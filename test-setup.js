// Simple test to verify the complete setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzA4NzcsImV4cCI6MjA2OTMwNjg3N30.W1fLfjsFdRZE4kk-OrUZ5CAfLw5e2pols2wx2On2QYc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ Connection successful, but tables need to be created');
        console.log('📋 Next step: Run the SQL in supabase-schema.sql in your Supabase dashboard');
      } else {
        console.log('❌ Connection error:', error.message);
      }
    } else {
      console.log('✅ Connection successful and tables exist!');
      console.log('🎉 Your app is fully connected to Supabase');
    }
  } catch (err) {
    console.log('❌ Test failed:', err.message);
  }
}

testConnection();
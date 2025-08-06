import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzA4NzcsImV4cCI6MjA2OTMwNjg3N30.W1fLfjsFdRZE4kk-OrUZ5CAfLw5e2pols2wx2On2QYc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('🔍 Checking what tables exist...');
  
  const tables = ['profiles', 'categories', 'exams', 'questions', 'question_options'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: EXISTS (${data.length} rows found)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  // Check categories specifically
  console.log('\n📋 Checking categories data...');
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.log('Categories error:', error);
    } else {
      console.log('Categories data:', data);
    }
  } catch (err) {
    console.log('Categories check failed:', err.message);
  }
}

checkTables();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzA4NzcsImV4cCI6MjA2OTMwNjg3N30.W1fLfjsFdRZE4kk-OrUZ5CAfLw5e2pols2wx2On2QYc';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzczMDg3NywiZXhwIjoyMDY5MzA2ODc3fQ.iWPgM1MLkrfFQFY0Owad1OHptEmjMdacpm_qecXsNz0';

async function debugSupabase() {
  console.log('🔍 Debugging Supabase configuration...');
  
  // Test 1: Basic connection
  console.log('\n1️⃣ Testing basic connection...');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabase.from('_supabase_health').select('*').limit(1);
    console.log('Basic connection result:', { data, error });
  } catch (err) {
    console.log('Basic connection error:', err.message);
  }
  
  // Test 2: Service role connection
  console.log('\n2️⃣ Testing service role connection...');
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data, error } = await supabaseAdmin.from('categories').select('*').limit(1);
    console.log('Service role result:', { data, error });
  } catch (err) {
    console.log('Service role error:', err.message);
  }
  
  // Test 3: Raw REST API call
  console.log('\n3️⃣ Testing raw REST API...');
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/categories?select=*&limit=1`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.text();
    console.log('REST API status:', response.status);
    console.log('REST API response:', result);
  } catch (err) {
    console.log('REST API error:', err.message);
  }
  
  // Test 4: Check project URL
  console.log('\n4️⃣ Project info...');
  console.log('URL:', supabaseUrl);
  console.log('URL valid:', supabaseUrl.includes('supabase.co'));
  
  // Test 5: Try different table access
  console.log('\n5️⃣ Testing different approaches...');
  
  const approaches = [
    { name: 'Direct table access', query: () => supabase.from('categories').select('*') },
    { name: 'With schema', query: () => supabase.from('public.categories').select('*') },
    { name: 'RPC call', query: () => supabase.rpc('get_categories') }
  ];
  
  for (const approach of approaches) {
    try {
      const { data, error } = await approach.query();
      console.log(`${approach.name}:`, { success: !error, error: error?.message, dataLength: data?.length });
    } catch (err) {
      console.log(`${approach.name} error:`, err.message);
    }
  }
}

debugSupabase();
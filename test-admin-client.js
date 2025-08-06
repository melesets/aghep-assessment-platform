import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzczMDg3NywiZXhwIjoyMDY5MzA2ODc3fQ.iWPgM1MLkrfFQFY0Owad1OHptEmjMdacpm_qecXsNz0';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testAdminClient() {
  console.log('🔧 Testing admin client (service role)...');
  
  try {
    // Test categories
    console.log('\n📋 Testing categories...');
    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('*');
    
    if (catError) {
      console.log('❌ Categories failed:', catError.message);
    } else {
      console.log('✅ Categories success!');
      console.log('📊 Found categories:', categories?.length || 0);
      if (categories && categories.length > 0) {
        console.log('First category:', categories[0]);
      }
    }
    
    // Test exams
    console.log('\n📝 Testing exams...');
    const { data: exams, error: examError } = await supabaseAdmin
      .from('exams')
      .select('*')
      .limit(1);
    
    if (examError) {
      console.log('❌ Exams failed:', examError.message);
    } else {
      console.log('✅ Exams success!');
      console.log('📊 Found exams:', exams?.length || 0);
      if (exams && exams.length > 0) {
        console.log('First exam:', exams[0]);
      }
    }
    
    // Test profiles
    console.log('\n👤 Testing profiles...');
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.log('❌ Profiles failed:', profileError.message);
    } else {
      console.log('✅ Profiles success!');
      console.log('📊 Found profiles:', profiles?.length || 0);
      if (profiles && profiles.length > 0) {
        console.log('First profile:', profiles[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Admin client test failed:', error.message);
  }
}

testAdminClient();
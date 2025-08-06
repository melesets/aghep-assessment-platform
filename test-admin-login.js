import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzA4NzcsImV4cCI6MjA2OTMwNjg3N30.W1fLfjsFdRZE4kk-OrUZ5CAfLw5e2pols2wx2On2QYc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminLogin() {
  console.log('🧪 Testing admin login...');
  
  try {
    // Test admin login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: 'Password'
    });
    
    if (error) {
      console.log('❌ Admin login failed:', error.message);
      return false;
    }
    
    if (data.user) {
      console.log('✅ Admin login successful!');
      console.log('👤 User ID:', data.user.id);
      console.log('📧 Email:', data.user.email);
      console.log('🔑 Role:', data.user.user_metadata?.role || 'admin');
      
      // Sign out
      await supabase.auth.signOut();
      console.log('✅ Signed out successfully');
      
      return true;
    }
    
    return false;
  } catch (err) {
    console.log('❌ Test failed:', err.message);
    return false;
  }
}

testAdminLogin();
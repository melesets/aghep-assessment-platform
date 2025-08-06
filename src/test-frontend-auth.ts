import { supabase } from './lib/supabase';

// Test frontend Supabase client
async function testFrontendAuth() {
  console.log('🔍 Testing frontend Supabase client...');
  
  try {
    // Test the exact same credentials that work in backend
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: 'Password'
    });
    
    if (error) {
      console.error('❌ Frontend auth failed:', error.message);
      console.error('Error details:', error);
      return false;
    }
    
    if (data.user) {
      console.log('✅ Frontend auth successful!');
      console.log('User:', data.user.email);
      console.log('Role:', data.user.user_metadata?.role);
      
      // Sign out
      await supabase.auth.signOut();
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('❌ Frontend test error:', err);
    return false;
  }
}

testFrontendAuth();
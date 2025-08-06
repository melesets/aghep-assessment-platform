import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzczMDg3NywiZXhwIjoyMDY5MzA2ODc3fQ.iWPgM1MLkrfFQFY0Owad1OHptEmjMdacpm_qecXsNz0';

// Use service role to create user
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminForFrontend() {
  console.log('🔧 Creating admin account for frontend login...');
  
  try {
    // Delete existing admin user first
    console.log('Checking for existing admin user...');
    
    // Try to delete existing user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      '59b0482d-c5e2-466b-a21d-dce77e94a78c'
    );
    
    if (deleteError) {
      console.log('Note: Could not delete existing user (may not exist)');
    } else {
      console.log('✅ Deleted existing admin user');
    }
    
    // Create new admin user
    console.log('Creating new admin user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@admin.com',
      password: 'Password',
      email_confirm: true,
      user_metadata: {
        name: 'Administrator',
        role: 'admin'
      }
    });
    
    if (authError) {
      console.error('❌ Failed to create admin user:', authError.message);
      return false;
    }
    
    console.log('✅ Admin user created successfully');
    console.log('User ID:', authData.user?.id);
    
    // Test login with anon key (frontend simulation)
    const supabaseAnon = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzA4NzcsImV4cCI6MjA2OTMwNjg3N30.W1fLfjsFdRZE4kk-OrUZ5CAfLw5e2pols2wx2On2QYc');
    
    console.log('Testing login with anon key (frontend simulation)...');
    const { data: loginData, error: loginError } = await supabaseAnon.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: 'Password'
    });
    
    if (loginError) {
      console.error('❌ Frontend login test failed:', loginError.message);
      return false;
    }
    
    console.log('✅ Frontend login test successful!');
    console.log('Login user ID:', loginData.user?.id);
    
    // Sign out
    await supabaseAnon.auth.signOut();
    
    console.log('\n🎉 Admin account ready for frontend!');
    console.log('📋 Credentials:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: Password');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

createAdminForFrontend();
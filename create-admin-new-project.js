import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxfxpbobbhfwfxshokho.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZnhwYm9iYmhmd2Z4c2hva2hvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxMzM3MCwiZXhwIjoyMDcwMDg5MzcwfQ.xCgzJlPKa8GYbJfzPobl2nFpg546G5cVseej0bT8qLQ';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminAccount() {
  console.log('🔧 Creating admin account in NEW project...');
  
  try {
    // Create admin user
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
    
    console.log('✅ Admin user created in auth system');
    console.log('👤 User ID:', authData.user?.id);
    
    // Create admin profile
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: 'admin@admin.com',
            name: 'Administrator',
            role: 'admin',
            department: 'Administration',
            employee_id: 'ADMIN-001',
            is_active: true
          }
        ])
        .select()
        .single();
      
      if (profileError) {
        console.error('❌ Failed to create admin profile:', profileError.message);
        return false;
      }
      
      console.log('✅ Admin profile created');
      console.log('📋 Profile:', profileData);
    }
    
    // Test login
    console.log('\n🧪 Testing admin login...');
    const supabaseAnon = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZnhwYm9iYmhmd2Z4c2hva2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTMzNzAsImV4cCI6MjA3MDA4OTM3MH0.F3twFsyaEXUYflg0-jFJ49vnBe_KTUL7208xwV3bWZU');
    
    const { data: loginData, error: loginError } = await supabaseAnon.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: 'Password'
    });
    
    if (loginError) {
      console.error('❌ Login test failed:', loginError.message);
    } else {
      console.log('✅ Login test successful!');
      console.log('🔑 Login user ID:', loginData.user?.id);
      
      // Sign out
      await supabaseAnon.auth.signOut();
    }
    
    console.log('\n🎉 ADMIN ACCOUNT SETUP COMPLETE!');
    console.log('📋 Login credentials:');
    console.log('   Email: admin@admin.com');
    console.log('   Password: Password');
    console.log('\n🚀 Your app is ready with REAL DATABASE!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    return false;
  }
}

createAdminAccount();
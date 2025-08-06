const { supabase } = require('../config/supabase');

const createRealAdmin = async () => {
  console.log('🔧 Creating real admin account...');

  try {
    // Create admin user with email format (Supabase requires email)
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'Password';
    
    console.log('Creating admin user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
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

    // Create admin profile
    if (authData.user) {
      console.log('Creating admin profile...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: adminEmail,
            name: 'Administrator',
            role: 'admin',
            department: 'Administration',
            employee_id: 'ADMIN-001',
            is_active: true
          }
        ]);

      if (profileError) {
        console.error('❌ Failed to create admin profile:', profileError.message);
        return false;
      }

      console.log('✅ Admin profile created');
    }

    console.log('\n🎉 Real admin account created successfully!');
    console.log('📋 Login credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n✅ You can now login with these credentials');

    return true;

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    return false;
  }
};

// Run if called directly
if (require.main === module) {
  createRealAdmin().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { createRealAdmin };
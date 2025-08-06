const { supabase } = require('../config/supabase');

const createAdminAuthOnly = async () => {
  console.log('🔧 Creating admin account (auth only)...');

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
      if (authError.message.includes('already registered')) {
        console.log('✅ Admin user already exists');
        return true;
      }
      console.error('❌ Failed to create admin user:', authError.message);
      return false;
    }

    console.log('✅ Admin user created in auth system');
    console.log('\n🎉 Admin account created successfully!');
    console.log('📋 Login credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n✅ You can now login with these credentials');
    console.log('\n⚠️  Note: Profile will be created automatically on first login');

    return true;

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    return false;
  }
};

// Run if called directly
if (require.main === module) {
  createAdminAuthOnly().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { createAdminAuthOnly };
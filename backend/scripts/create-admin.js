const { supabase } = require('../config/supabase');

const createAdminAccount = async () => {
  console.log('🔧 Creating admin account...');

  try {
    // Create admin user
    const adminEmail = 'admin@aghep.com';
    const adminPassword = 'admin123456'; // Change this to a secure password
    
    console.log('Creating admin user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: 'System Administrator',
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
            name: 'System Administrator',
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

    // Create demo student account
    console.log('Creating demo student account...');
    const { data: studentAuthData, error: studentAuthError } = await supabase.auth.admin.createUser({
      email: 'student@demo.com',
      password: 'demo123456',
      email_confirm: true,
      user_metadata: {
        name: 'Demo Student',
        role: 'student'
      }
    });

    if (!studentAuthError && studentAuthData.user) {
      const { error: studentProfileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: studentAuthData.user.id,
            email: 'student@demo.com',
            name: 'Demo Student',
            role: 'student',
            department: 'Healthcare',
            employee_id: 'STUDENT-001',
            is_active: true
          }
        ]);

      if (!studentProfileError) {
        console.log('✅ Demo student account created');
      }
    }

    console.log('\n🎉 Admin setup completed!');
    console.log('📋 Login credentials:');
    console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
    console.log(`   Student: student@demo.com / demo123456`);
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');

    return true;

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    return false;
  }
};

// Run if called directly
if (require.main === module) {
  createAdminAccount().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { createAdminAccount };
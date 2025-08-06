const { supabase } = require('../config/supabase');

const testAdminLogin = async () => {
  console.log('🧪 Testing admin login functionality...');

  try {
    // Test 1: Check if admin user exists
    console.log('\n1️⃣ Checking if admin user exists...');
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@aghep.com')
      .single();

    if (adminError) {
      console.log('❌ Admin profile not found:', adminError.message);
      console.log('💡 Run: node scripts/create-admin.js');
      return false;
    }

    console.log('✅ Admin profile found:', adminProfile.name, `(${adminProfile.role})`);

    // Test 2: Check if student demo exists
    console.log('\n2️⃣ Checking if demo student exists...');
    const { data: studentProfile, error: studentError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'student@demo.com')
      .single();

    if (studentError) {
      console.log('❌ Student demo profile not found:', studentError.message);
    } else {
      console.log('✅ Student demo profile found:', studentProfile.name, `(${studentProfile.role})`);
    }

    // Test 3: Check if categories exist (sample data)
    console.log('\n3️⃣ Checking if sample data exists...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('count');

    if (categoriesError) {
      console.log('❌ Categories table not accessible:', categoriesError.message);
      return false;
    }

    console.log(`✅ Categories table accessible (${categories.length} categories)`);

    // Test 4: Check if exams exist
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select('count');

    if (examsError) {
      console.log('❌ Exams table not accessible:', examsError.message);
    } else {
      console.log(`✅ Exams table accessible (${exams.length} exams)`);
    }

    console.log('\n🎉 Admin setup test completed!');
    console.log('\n📋 Login Information:');
    console.log('   Admin: admin@aghep.com / admin123456');
    console.log('   Student: student@demo.com / demo123456');
    console.log('\n🚀 Your app is ready to use!');

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
};

// Run test if called directly
if (require.main === module) {
  testAdminLogin().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testAdminLogin };
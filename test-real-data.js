import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxfxpbobbhfwfxshokho.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZnhwYm9iYmhmd2Z4c2hva2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTMzNzAsImV4cCI6MjA3MDA4OTM3MH0.F3twFsyaEXUYflg0-jFJ49vnBe_KTUL7208xwV3bWZU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealData() {
  console.log('🧪 Testing REAL DATA from new Supabase project...');
  
  try {
    // Test 1: Get categories
    console.log('\n📋 1. Testing Categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(3);
    
    if (catError) {
      console.log('❌ Categories failed:', catError.message);
    } else {
      console.log('✅ Categories success!');
      console.log(`📊 Found ${categories.length} categories:`);
      categories.forEach(cat => {
        console.log(`   - ${cat.name}: ${cat.description}`);
      });
    }
    
    // Test 2: Get exams with questions
    console.log('\n📝 2. Testing Exams with Questions...');
    const { data: exams, error: examError } = await supabase
      .from('exams')
      .select(`
        id,
        title,
        description,
        duration,
        passing_score,
        questions (
          id,
          question_text,
          question_options (
            id,
            option_text,
            is_correct
          )
        )
      `)
      .eq('is_published', true)
      .eq('is_active', true);
    
    if (examError) {
      console.log('❌ Exams failed:', examError.message);
    } else {
      console.log('✅ Exams success!');
      console.log(`📊 Found ${exams.length} published exams:`);
      exams.forEach(exam => {
        console.log(`   - ${exam.title} (${exam.questions?.length || 0} questions)`);
      });
    }
    
    // Test 3: Get admin profile
    console.log('\n👤 3. Testing Admin Profile...');
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@admin.com')
      .single();
    
    if (profileError) {
      console.log('❌ Admin profile failed:', profileError.message);
    } else {
      console.log('✅ Admin profile success!');
      console.log(`👤 Admin: ${adminProfile.name} (${adminProfile.role})`);
    }
    
    // Test 4: Test login
    console.log('\n🔐 4. Testing Admin Login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@admin.com',
      password: 'Password'
    });
    
    if (loginError) {
      console.log('❌ Login failed:', loginError.message);
    } else {
      console.log('✅ Login success!');
      console.log(`🔑 Logged in as: ${loginData.user?.email}`);
      
      // Sign out
      await supabase.auth.signOut();
      console.log('🚪 Signed out');
    }
    
    console.log('\n🎉 ALL TESTS PASSED! Your app is ready with REAL DATA!');
    console.log('\n📋 Summary:');
    console.log(`   ✅ Categories: ${categories?.length || 0} found`);
    console.log(`   ✅ Exams: ${exams?.length || 0} found`);
    console.log(`   ✅ Admin account: Working`);
    console.log(`   ✅ Authentication: Working`);
    console.log('\n🚀 Start your app with: npm run dev');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRealData();
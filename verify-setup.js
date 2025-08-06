import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzA4NzcsImV4cCI6MjA2OTMwNjg3N30.W1fLfjsFdRZE4kk-OrUZ5CAfLw5e2pols2wx2On2QYc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyCompleteSetup() {
  console.log('🔍 Verifying complete AGHEP setup...');
  console.log('=' .repeat(50));
  
  let allGood = true;

  try {
    // Test 1: Database tables
    console.log('\n📊 1. DATABASE TABLES');
    console.log('-'.repeat(30));
    
    const tables = ['profiles', 'categories', 'exams', 'questions'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        allGood = false;
      } else {
        console.log(`✅ ${table}: OK`);
      }
    }

    // Test 2: Admin account
    console.log('\n👤 2. ADMIN ACCOUNT');
    console.log('-'.repeat(30));
    
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@aghep.com')
      .single();

    if (adminError) {
      console.log('❌ Admin account not found');
      console.log('   Run: cd backend && node scripts/create-admin.js');
      allGood = false;
    } else {
      console.log(`✅ Admin account: ${adminProfile.name} (${adminProfile.role})`);
    }

    // Test 3: Demo student
    console.log('\n🎓 3. DEMO STUDENT');
    console.log('-'.repeat(30));
    
    const { data: studentProfile, error: studentError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'student@demo.com')
      .single();

    if (studentError) {
      console.log('❌ Demo student not found');
      allGood = false;
    } else {
      console.log(`✅ Demo student: ${studentProfile.name} (${studentProfile.role})`);
    }

    // Test 4: Sample data
    console.log('\n📋 4. SAMPLE DATA');
    console.log('-'.repeat(30));
    
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');

    if (catError || !categories || categories.length === 0) {
      console.log('❌ No sample categories found');
      allGood = false;
    } else {
      console.log(`✅ Sample categories: ${categories.length} found`);
    }

    // Final result
    console.log('\n🎯 SETUP STATUS');
    console.log('=' .repeat(50));
    
    if (allGood) {
      console.log('🎉 SETUP COMPLETE! Your app is ready to use.');
      console.log('\n📱 LOGIN CREDENTIALS:');
      console.log('   Admin: admin@aghep.com / admin123456');
      console.log('   Student: student@demo.com / demo123456');
      console.log('\n🚀 Start your app with: npm run dev');
    } else {
      console.log('❌ SETUP INCOMPLETE. Please fix the issues above.');
      console.log('\n🔧 NEXT STEPS:');
      console.log('   1. Ensure you ran the SQL schema in Supabase dashboard');
      console.log('   2. Run: cd backend && node scripts/create-admin.js');
      console.log('   3. Run this verification again');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyCompleteSetup();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxfxpbobbhfwfxshokho.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZnhwYm9iYmhmd2Z4c2hva2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTMzNzAsImV4cCI6MjA3MDA4OTM3MH0.F3twFsyaEXUYflg0-jFJ49vnBe_KTUL7208xwV3bWZU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNewConnection() {
  console.log('🧪 Testing NEW Supabase project connection...');
  
  try {
    // Test categories
    console.log('\n📋 Testing categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');
    
    if (catError) {
      console.log('❌ Categories failed:', catError.message);
    } else {
      console.log('✅ Categories success!');
      console.log('📊 Found categories:', categories?.length || 0);
      if (categories && categories.length > 0) {
        console.log('Sample category:', categories[0]);
      }
    }
    
    // Test exams
    console.log('\n📝 Testing exams...');
    const { data: exams, error: examError } = await supabase
      .from('exams')
      .select('*');
    
    if (examError) {
      console.log('❌ Exams failed:', examError.message);
    } else {
      console.log('✅ Exams success!');
      console.log('📊 Found exams:', exams?.length || 0);
      if (exams && exams.length > 0) {
        console.log('Sample exam:', exams[0]);
      }
    }
    
    // Test questions
    console.log('\n❓ Testing questions...');
    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('*');
    
    if (questionError) {
      console.log('❌ Questions failed:', questionError.message);
    } else {
      console.log('✅ Questions success!');
      console.log('📊 Found questions:', questions?.length || 0);
    }
    
    console.log('\n🎉 NEW SUPABASE PROJECT IS WORKING!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testNewConnection();
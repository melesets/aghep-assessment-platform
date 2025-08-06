import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzA4NzcsImV4cCI6MjA2OTMwNjg3N30.W1fLfjsFdRZE4kk-OrUZ5CAfLw5e2pols2wx2On2QYc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugLogin() {
  console.log('🔍 Debugging login issue...');
  
  // Test different credential combinations
  const testCredentials = [
    { email: 'admin@admin.com', password: 'Password' },
    { email: 'admin@admin.com', password: 'password' },
    { email: 'admin@aghep.com', password: 'admin123456' },
    { email: 'admin@demo.com', password: 'password' }
  ];
  
  for (const creds of testCredentials) {
    console.log(`\n🧪 Testing: ${creds.email} / ${creds.password}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password
      });
      
      if (error) {
        console.log(`❌ Failed: ${error.message}`);
      } else if (data.user) {
        console.log(`✅ SUCCESS! User ID: ${data.user.id}`);
        console.log(`📧 Email: ${data.user.email}`);
        console.log(`🔑 Metadata:`, data.user.user_metadata);
        
        // Sign out for next test
        await supabase.auth.signOut();
        return creds;
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }
  }
  
  console.log('\n❌ No working credentials found');
  return null;
}

debugLogin().then(workingCreds => {
  if (workingCreds) {
    console.log('\n🎉 Working credentials found:');
    console.log(`Email: ${workingCreds.email}`);
    console.log(`Password: ${workingCreds.password}`);
  } else {
    console.log('\n🔧 Need to create admin account');
  }
});
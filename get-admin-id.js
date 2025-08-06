import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzczMDg3NywiZXhwIjoyMDY5MzA2ODc3fQ.iWPgM1MLkrfFQFY0Owad1OHptEmjMdacpm_qecXsNz0';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function getAdminUserId() {
  try {
    console.log('🔍 Looking for admin user...');
    
    // List all users to find admin
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error listing users:', error);
      return;
    }
    
    console.log('📋 All users:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Created: ${user.created_at}`);
      console.log('');
    });
    
    // Find admin user
    const adminUser = users.find(user => user.email === 'admin@admin.com');
    
    if (adminUser) {
      console.log('✅ Admin user found!');
      console.log(`Admin ID: ${adminUser.id}`);
      console.log(`Admin Email: ${adminUser.email}`);
      
      // Now create the profile
      const { data, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          {
            id: adminUser.id,
            email: adminUser.email,
            name: 'Administrator',
            role: 'admin',
            department: 'Administration',
            employee_id: 'ADMIN-001',
            is_active: true
          }
        ]);
      
      if (profileError) {
        console.error('❌ Profile creation failed:', profileError);
      } else {
        console.log('✅ Admin profile created successfully!');
      }
    } else {
      console.log('❌ No admin user found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

getAdminUserId();
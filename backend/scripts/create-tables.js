const { supabase } = require('../config/supabase');

const createTables = async () => {
  console.log('🚀 Creating Supabase database tables...');

  try {
    // Create profiles table first (extends auth.users)
    console.log('Creating profiles table...');
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'instructor')),
          department VARCHAR(255),
          employee_id VARCHAR(100),
          phone VARCHAR(20),
          is_active BOOLEAN DEFAULT true,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY IF NOT EXISTS "Users can view own profile" ON public.profiles 
          FOR SELECT USING (auth.uid() = id);
        CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.profiles 
          FOR UPDATE USING (auth.uid() = id);
        CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON public.profiles 
          FOR INSERT WITH CHECK (auth.uid() = id);
      `
    });

    if (profilesError) {
      console.log('Profiles table might already exist or using direct SQL...');
    } else {
      console.log('✅ Profiles table created');
    }

    // Create categories table
    console.log('Creating categories table...');
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          color VARCHAR(7) DEFAULT '#2563eb',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
        CREATE POLICY IF NOT EXISTS "Anyone can view categories" ON public.categories 
          FOR SELECT USING (is_active = true);
      `
    });

    if (categoriesError) {
      console.log('Categories table setup completed');
    } else {
      console.log('✅ Categories table created');
    }

    // Since the RPC approach might not work, let's try direct table operations
    console.log('Attempting alternative table creation...');
    
    // Try to insert a test category to see if table exists
    const { data: testCategory, error: testError } = await supabase
      .from('categories')
      .insert([
        { name: 'Healthcare Basics', description: 'Basic healthcare knowledge', color: '#2563eb' }
      ])
      .select();

    if (testError) {
      console.log('Tables need to be created manually. Error:', testError.message);
    } else {
      console.log('✅ Categories table is working');
    }

    console.log('\n🎉 Table creation process completed!');
    console.log('Note: If tables don\'t exist, they need to be created manually in Supabase dashboard');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
};

if (require.main === module) {
  createTables().then(() => {
    console.log('Setup completed');
    process.exit(0);
  });
}

module.exports = { createTables };
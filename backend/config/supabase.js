const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - NEW PROJECT
const supabaseUrl = 'https://pxfxpbobbhfwfxshokho.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZnhwYm9iYmhmd2Z4c2hva2hvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxMzM3MCwiZXhwIjoyMDcwMDg5MzcwfQ.xCgzJlPKa8GYbJfzPobl2nFpg546G5cVseej0bT8qLQ';

// Create Supabase client with service role for backend operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = { supabase };
import { createClient } from '@supabase/supabase-js';

// Admin client with service role key - bypasses PostgREST issues
const supabaseUrl = 'https://flgdutcvnynddnorfofb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZ2R1dGN2bnluZGRub3Jmb2ZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzczMDg3NywiZXhwIjoyMDY5MzA2ODc3fQ.iWPgM1MLkrfFQFY0Owad1OHptEmjMdacpm_qecXsNz0';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database helpers using admin client
export const adminDbHelpers = {
  // Get categories
  getCategories: async () => {
    try {
      const { data, error } = await supabaseAdmin.from('categories').select('*');
      return { data, error };
    } catch (err) {
      console.error('Admin getCategories error:', err);
      return { data: null, error: err };
    }
  },

  // Get exams with questions
  getExams: async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('exams')
        .select(`
          *,
          questions (
            *,
            question_options (*)
          )
        `)
        .eq('is_published', true)
        .eq('is_active', true);
      return { data, error };
    } catch (err) {
      console.error('Admin getExams error:', err);
      return { data: null, error: err };
    }
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    } catch (err) {
      console.error('Admin getUserProfile error:', err);
      return { data: null, error: err };
    }
  },

  // Create user profile
  createUserProfile: async (profile: any) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert([profile])
        .select()
        .single();
      return { data, error };
    } catch (err) {
      console.error('Admin createUserProfile error:', err);
      return { data: null, error: err };
    }
  }
};
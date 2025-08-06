import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthState, RegisterData } from '../types/auth';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const AuthContext = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = AuthContext.Provider;

export const useAuthState = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing Supabase session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.user && !error) {
          loadUserProfile(session.user);
        } else {
          setAuth(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setAuth({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = (supabaseUser: SupabaseUser) => {
    try {
      // Skip database call - just use auth data directly
      const isAdmin = supabaseUser.email === 'admin@admin.com' || 
                     supabaseUser.user_metadata?.role === 'admin';
      
      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || (isAdmin ? 'Administrator' : supabaseUser.email?.split('@')[0] || 'User'),
        role: isAdmin ? 'admin' : 'professional',
        department: supabaseUser.user_metadata?.department || (isAdmin ? 'Administration' : 'General'),
        position: isAdmin ? 'System Administrator' : 'Healthcare Professional',
        licenseNumber: supabaseUser.user_metadata?.licenseNumber,
        hospitalId: supabaseUser.user_metadata?.hospitalId || (isAdmin ? 'ADMIN-001' : `USER-${supabaseUser.id.slice(0, 8)}`),
        createdAt: new Date(supabaseUser.created_at),
        lastLogin: new Date(),
      };

      console.log('✅ User profile loaded:', user);

      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      setAuth({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login failed:', error.message);
        return false;
      }

      if (data.user) {
        console.log('Login successful, loading profile...');
        loadUserProfile(data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: 'professional',
            department: data.department,
            position: data.position,
            licenseNumber: data.licenseNumber,
            hospitalId: data.hospitalId
          }
        }
      });
      
      if (error) {
        console.error('Registration failed:', error.message);
        return false;
      }

      if (authData.user) {
        console.log('Registration successful');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuth({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear auth state anyway
      setAuth({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  return { auth, login, register, logout };
};
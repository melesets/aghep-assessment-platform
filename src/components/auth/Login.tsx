import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Check for hardcoded user credentials first
      if (email === 'aghqu' && password === 'agh123') {
        console.log('Hardcoded user login successful:', email);
        
        // Create a mock user session for the regular user
        const mockUser = {
          id: 'hardcoded-user-id',
          email: 'aghqu@aghep.com',
          name: 'AGHEP User',
          role: 'professional',
          department: 'Healthcare',
          position: 'Healthcare Professional',
          licenseNumber: 'AGH-2024-001',
          hospitalId: 'AGHEP-USER-001'
        };
        
        // Store user data in localStorage for the auth system
        localStorage.setItem('auth-user', JSON.stringify(mockUser));
        localStorage.setItem('auth-token', 'hardcoded-token-' + Date.now());
        
        // Force page reload to trigger auth state change
        window.location.reload();
        return;
      }
      
      // If not hardcoded credentials, try Supabase authentication (for admin and other accounts)
      console.log('Attempting Supabase login with:', email);
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        console.error('Supabase auth error:', authError);
        setError(`Login failed: ${authError.message}`);
        return;
      }
      
      if (data.user) {
        console.log('Supabase login successful:', data.user);
        console.log('User role:', data.user.user_metadata?.role);
        
        // Force page reload to trigger auth state change
        window.location.reload();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* AGHEP Logo */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">AG</span>
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
            AGHEP
          </CardTitle>
          <p className="text-gray-600 mb-2">Assessment Platform</p>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter username or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                autoComplete="username"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" loading={isLoading}>
              Sign In
            </Button>

            {/* Login hints */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
import React from 'react';
import { AuthProvider as AuthContextProvider, useAuthState } from '../../hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();

  return (
    <AuthContextProvider value={authState}>
      {children}
    </AuthContextProvider>
  );
};
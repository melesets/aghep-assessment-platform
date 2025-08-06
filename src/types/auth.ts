export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'professional';
  department: string;
  position: string;
  licenseNumber?: string;
  hospitalId: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  department: string;
  position: string;
  licenseNumber?: string;
  hospitalId: string;
  password: string;
  confirmPassword: string;
}
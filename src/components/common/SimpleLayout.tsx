import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Home, FileText, Award, Settings, BookOpen, BarChart3 } from 'lucide-react';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

export const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const { auth, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items for regular users
  const userNavItems = [
    { path: '/', label: 'Exams', icon: Home },
    { path: '/certificates', label: 'Certificates', icon: Award }
  ];

  // Additional navigation items for admins
  const adminNavItems = [
    { path: '/records', label: 'Records', icon: BarChart3 },
    { path: '/skill-lab', label: 'Skill Lab', icon: BookOpen },
    { path: '/admin', label: 'Admin', icon: Settings }
  ];

  // Combine nav items based on user role
  const navItems = auth.user?.role === 'admin' 
    ? [...userNavItems, ...adminNavItems]
    : userNavItems;

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Minimal Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Brand and Navigation */}
            <div className="flex items-center gap-8">
              {/* AGHEP Logo/Brand */}
              <div 
                className="cursor-pointer group flex items-center gap-3" 
                onClick={() => navigate('/')}
              >
                {/* Logo */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-white font-bold text-sm">AG</span>
                </div>
                {/* Brand Name */}
                <div>
                  <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    AGHEP
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">
                    Assessment Platform
                  </p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Right side - User Actions */}
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-700">
                    {auth.user?.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {auth.user?.role}
                  </div>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-100 py-2">
            <nav className="flex items-center gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};
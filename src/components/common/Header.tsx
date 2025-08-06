import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { auth, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left side - Brand */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            {/* AGHEP Logo */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AG</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">AGHEP</span>
              <p className="text-xs text-gray-500 -mt-1">Assessment Platform</p>
            </div>
          </div>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{auth.user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{auth.user?.role}</div>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  Users,
  Award,
  Settings,
  BookOpen,
  BarChart3,
  Upload,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === 'admin';

  const professionalLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/certifications', icon: BookOpen, label: 'Certifications' },
    { to: '/certificates', icon: Award, label: 'Certificates' },
    { to: '/ceu-tracker', icon: BarChart3, label: 'CEU Tracker' },
    { to: '/profile', icon: Users, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/certifications', icon: FileText, label: 'Manage Certifications' },
    { to: '/admin/professionals', icon: Users, label: 'Professionals' },
    { to: '/admin/certificates', icon: Award, label: 'Certificates' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/upload', icon: Upload, label: 'Upload Content' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : professionalLinks;

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
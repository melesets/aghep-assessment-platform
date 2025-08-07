import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { logService } from '../../services/logService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  EyeOff,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'professional' | 'student';
  department: string;
  position: string;
  licenseNumber?: string;
  hospitalId: string;
  phone?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  loginAttempts: number;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'professional' | 'student';
  department: string;
  position: string;
  licenseNumber?: string;
  hospitalId: string;
  phone?: string;
}

export const UserManagement: React.FC = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    role: 'professional',
    department: '',
    position: '',
    licenseNumber: '',
    hospitalId: '',
    phone: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Get all users from Supabase auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error loading users:', authError);
        setError('Failed to load users');
        return;
      }

      // Transform auth users to our User interface
      const transformedUsers: User[] = authUsers.users.map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
        role: user.user_metadata?.role || (user.email === 'admin@admin.com' ? 'admin' : 'professional'),
        department: user.user_metadata?.department || 'General',
        position: user.user_metadata?.position || 'Healthcare Professional',
        licenseNumber: user.user_metadata?.licenseNumber,
        hospitalId: user.user_metadata?.hospitalId || `USER-${user.id.slice(0, 8)}`,
        phone: user.user_metadata?.phone,
        isActive: !user.banned_until,
        emailVerified: !!user.email_confirmed_at,
        createdAt: new Date(user.created_at),
        lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at) : undefined,
        loginAttempts: 0 // This would need to be tracked separately
      }));

      setUsers(transformedUsers);
      
      // Log the user management access
      logService.logUserManagement(
        'USER_MANAGEMENT_ACCESSED',
        `Admin ${auth.user?.name} accessed user management`,
        'low',
        auth.user?.id,
        auth.user?.email,
        auth.user?.name
      );
      
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      setError('');
      setSuccess('');

      // Validate required fields
      if (!createUserData.name || !createUserData.email || !createUserData.password) {
        setError('Name, email, and password are required');
        return;
      }

      if (createUserData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      // Check if user already exists
      const existingUser = users.find(user => user.email === createUserData.email);
      if (existingUser) {
        setError('User with this email already exists');
        return;
      }

      // Create user in Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: createUserData.email,
        password: createUserData.password,
        email_confirm: true,
        user_metadata: {
          name: createUserData.name,
          role: createUserData.role,
          department: createUserData.department,
          position: createUserData.position,
          licenseNumber: createUserData.licenseNumber,
          hospitalId: createUserData.hospitalId || `USER-${Date.now()}`,
          phone: createUserData.phone
        }
      });

      if (authError) {
        setError(`Failed to create user: ${authError.message}`);
        return;
      }

      // Log the user creation
      logService.logUserManagement(
        'USER_CREATED',
        `Admin ${auth.user?.name} created user: ${createUserData.email}`,
        'medium',
        auth.user?.id,
        auth.user?.email,
        auth.user?.name
      );

      setSuccess(`User ${createUserData.name} created successfully`);
      setShowCreateForm(false);
      setCreateUserData({
        name: '',
        email: '',
        password: '',
        role: 'professional',
        department: '',
        position: '',
        licenseNumber: '',
        hospitalId: '',
        phone: ''
      });

      // Reload users
      await loadUsers();

    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      if (currentStatus) {
        // Ban user
        const { error } = await supabase.auth.admin.updateUserById(userId, {
          ban_duration: '876000h' // 100 years (effectively permanent)
        });
        
        if (error) {
          setError(`Failed to deactivate user: ${error.message}`);
          return;
        }

        logService.logUserManagement(
          'USER_DEACTIVATED',
          `Admin ${auth.user?.name} deactivated user: ${user.email}`,
          'high',
          auth.user?.id,
          auth.user?.email,
          auth.user?.name
        );
        setSuccess(`User ${user.name} has been deactivated`);
      } else {
        // Unban user
        const { error } = await supabase.auth.admin.updateUserById(userId, {
          ban_duration: 'none'
        });
        
        if (error) {
          setError(`Failed to activate user: ${error.message}`);
          return;
        }

        logService.logUserManagement(
          'USER_ACTIVATED',
          `Admin ${auth.user?.name} activated user: ${user.email}`,
          'medium',
          auth.user?.id,
          auth.user?.email,
          auth.user?.name
        );
        setSuccess(`User ${user.name} has been activated`);
      }

      await loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      setError('Failed to update user status');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      if (!confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
        return;
      }

      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        setError(`Failed to delete user: ${error.message}`);
        return;
      }

      logService.logUserManagement(
        'USER_DELETED',
        `Admin ${auth.user?.name} deleted user: ${user.email}`,
        'high',
        auth.user?.id,
        auth.user?.email,
        auth.user?.name
      );
      setSuccess(`User ${user.name} has been deleted`);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const logActivity = async (action: string, description: string) => {
    try {
      // This would typically go to a dedicated logging table
      console.log(`[${new Date().toISOString()}] ${action}: ${description}`);
      
      // You could also send to an external logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     timestamp: new Date().toISOString(),
      //     action,
      //     description,
      //     userId: auth.user?.id,
      //     userEmail: auth.user?.email
      //   })
      // });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="professional">Professional</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>

        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={createUserData.name}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              
              <Input
                label="Email"
                type="email"
                value={createUserData.email}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={createUserData.password}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={createUserData.role}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <Input
                label="Department"
                value={createUserData.department}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, department: e.target.value }))}
              />
              
              <Input
                label="Position"
                value={createUserData.position}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, position: e.target.value }))}
              />
              
              <Input
                label="License Number (Optional)"
                value={createUserData.licenseNumber}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, licenseNumber: e.target.value }))}
              />
              
              <Input
                label="Hospital ID"
                value={createUserData.hospitalId}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, hospitalId: e.target.value }))}
              />
              
              <Input
                label="Phone (Optional)"
                value={createUserData.phone}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={createUser}>Create User</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateForm(false);
                  setError('');
                  setSuccess('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.hospitalId && (
                          <div className="text-xs text-gray-400">ID: {user.hospitalId}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.department}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </span>
                        )}
                        {!user.emailVerified && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Unverified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.lastLogin ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {user.lastLogin.toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleUserStatus(user.id, user.isActive)}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            user.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                          }`}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        
                        {user.email !== 'admin@admin.com' && (
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-1 rounded hover:bg-gray-100 text-red-600 hover:text-red-700"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  FileText,
  Database,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
  UserMinus
} from 'lucide-react';

interface ActivityLog {
  id: string;
  timestamp: Date;
  action: string;
  description: string;
  userId: string;
  userEmail: string;
  userName: string;
  ipAddress?: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'user_management' | 'exam' | 'system' | 'security';
  metadata?: Record<string, any>;
}

export const ActivityLogs: React.FC = () => {
  const { auth } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  useEffect(() => {
    loadLogs();
    
    // Set up real-time logging
    setupRealTimeLogging();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, [dateRange, categoryFilter, severityFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      
      // In a real application, this would fetch from a database
      // For now, we'll simulate with localStorage and some mock data
      const storedLogs = localStorage.getItem('activityLogs');
      let existingLogs: ActivityLog[] = storedLogs ? JSON.parse(storedLogs) : [];
      
      // Add some mock logs if none exist
      if (existingLogs.length === 0) {
        existingLogs = generateMockLogs();
        localStorage.setItem('activityLogs', JSON.stringify(existingLogs));
      }
      
      // Filter by date range
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case '1day':
          filterDate.setDate(now.getDate() - 1);
          break;
        case '7days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          filterDate.setDate(now.getDate() - 90);
          break;
        default:
          filterDate.setFullYear(2000); // Show all
      }
      
      const filteredLogs = existingLogs
        .filter(log => new Date(log.timestamp) >= filterDate)
        .filter(log => categoryFilter === 'all' || log.category === categoryFilter)
        .filter(log => severityFilter === 'all' || log.severity === severityFilter)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setLogs(filteredLogs);
      
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeLogging = () => {
    // Override console methods to capture logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      if (args[0] && typeof args[0] === 'string' && args[0].includes('[LOG]')) {
        captureLog('system', 'low', args.join(' '));
      }
    };

    console.error = (...args) => {
      originalError(...args);
      if (args[0] && typeof args[0] === 'string') {
        captureLog('system', 'high', `Error: ${args.join(' ')}`);
      }
    };

    console.warn = (...args) => {
      originalWarn(...args);
      if (args[0] && typeof args[0] === 'string') {
        captureLog('system', 'medium', `Warning: ${args.join(' ')}`);
      }
    };
  };

  const captureLog = (category: ActivityLog['category'], severity: ActivityLog['severity'], description: string) => {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      action: 'SYSTEM_EVENT',
      description,
      userId: auth.user?.id || 'system',
      userEmail: auth.user?.email || 'system',
      userName: auth.user?.name || 'System',
      severity,
      category,
      ipAddress: 'localhost', // In real app, get from request
      userAgent: navigator.userAgent
    };

    addLog(newLog);
  };

  const addLog = (log: ActivityLog) => {
    const storedLogs = localStorage.getItem('activityLogs');
    const existingLogs: ActivityLog[] = storedLogs ? JSON.parse(storedLogs) : [];
    
    existingLogs.unshift(log);
    
    // Keep only last 1000 logs
    if (existingLogs.length > 1000) {
      existingLogs.splice(1000);
    }
    
    localStorage.setItem('activityLogs', JSON.stringify(existingLogs));
    
    // Update state if we're showing recent logs
    if (dateRange === '7days' || dateRange === '30days') {
      setLogs(prev => [log, ...prev].slice(0, 100));
    }
  };

  const generateMockLogs = (): ActivityLog[] => {
    const mockLogs: ActivityLog[] = [];
    const actions = [
      { action: 'USER_LOGIN', description: 'User logged in successfully', category: 'auth', severity: 'low' },
      { action: 'USER_LOGOUT', description: 'User logged out', category: 'auth', severity: 'low' },
      { action: 'FAILED_LOGIN', description: 'Failed login attempt', category: 'security', severity: 'medium' },
      { action: 'USER_CREATED', description: 'New user account created', category: 'user_management', severity: 'medium' },
      { action: 'USER_DELETED', description: 'User account deleted', category: 'user_management', severity: 'high' },
      { action: 'EXAM_CREATED', description: 'New exam created', category: 'exam', severity: 'low' },
      { action: 'EXAM_COMPLETED', description: 'Exam completed by user', category: 'exam', severity: 'low' },
      { action: 'SYSTEM_ERROR', description: 'System error occurred', category: 'system', severity: 'high' },
      { action: 'SETTINGS_CHANGED', description: 'System settings modified', category: 'system', severity: 'medium' },
      { action: 'SECURITY_ALERT', description: 'Security alert triggered', category: 'security', severity: 'critical' }
    ];

    for (let i = 0; i < 50; i++) {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 168)); // Random time in last week

      mockLogs.push({
        id: `mock_${i}`,
        timestamp,
        action: randomAction.action,
        description: randomAction.description,
        userId: `user_${Math.floor(Math.random() * 10)}`,
        userEmail: `user${Math.floor(Math.random() * 10)}@example.com`,
        userName: `User ${Math.floor(Math.random() * 10)}`,
        severity: randomAction.severity as ActivityLog['severity'],
        category: randomAction.category as ActivityLog['category'],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });
    }

    return mockLogs;
  };

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,Action,Description,User,Email,IP Address,Severity,Category',
      ...logs.map(log => 
        `"${log.timestamp.toISOString()}","${log.action}","${log.description}","${log.userName}","${log.userEmail}","${log.ipAddress || ''}","${log.severity}","${log.category}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) {
      localStorage.removeItem('activityLogs');
      setLogs([]);
      
      // Log this action
      const clearLog: ActivityLog = {
        id: `clear_${Date.now()}`,
        timestamp: new Date(),
        action: 'LOGS_CLEARED',
        description: `Admin ${auth.user?.name} cleared all activity logs`,
        userId: auth.user?.id || '',
        userEmail: auth.user?.email || '',
        userName: auth.user?.name || '',
        severity: 'high',
        category: 'system'
      };
      
      addLog(clearLog);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return LogIn;
      case 'user_management': return User;
      case 'exam': return FileText;
      case 'system': return Settings;
      case 'security': return Shield;
      default: return Activity;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
        <p className="text-gray-600">Monitor system activity and user actions</p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1day">Last 24 hours</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="all">All time</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="auth">Authentication</option>
                <option value="user_management">User Management</option>
                <option value="exam">Exams</option>
                <option value="system">System</option>
                <option value="security">Security</option>
              </select>
              
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadLogs}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              onClick={exportLogs}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            
            <Button
              variant="outline"
              onClick={clearLogs}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold">{filteredLogs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Events</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredLogs.filter(log => log.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Events</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredLogs.filter(log => log.category === 'security').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">User Actions</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredLogs.filter(log => log.category === 'user_management').length}
                </p>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Logs ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Severity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const CategoryIcon = getCategoryIcon(log.category);
                  return (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium">
                              {log.timestamp.toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {log.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{log.action}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{log.userName}</div>
                          <div className="text-sm text-gray-500">{log.userEmail}</div>
                          {log.ipAddress && (
                            <div className="text-xs text-gray-400">IP: {log.ipAddress}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {log.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 capitalize">
                          {log.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1 rounded hover:bg-gray-100 text-blue-600 hover:text-blue-700"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No activity logs found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Log Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-sm text-gray-900">{selectedLog.timestamp.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Action</label>
                  <p className="text-sm text-gray-900">{selectedLog.action}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedLog.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="text-sm text-gray-900">{selectedLog.userName} ({selectedLog.userEmail})</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Severity</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedLog.severity)}`}>
                      {selectedLog.severity}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedLog.category.replace('_', ' ')}</p>
                  </div>
                </div>
                
                {selectedLog.ipAddress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP Address</label>
                    <p className="text-sm text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                )}
                
                {selectedLog.userAgent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Agent</label>
                    <p className="text-sm text-gray-900 break-all">{selectedLog.userAgent}</p>
                  </div>
                )}
                
                {selectedLog.metadata && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Additional Data</label>
                    <pre className="text-xs text-gray-900 bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
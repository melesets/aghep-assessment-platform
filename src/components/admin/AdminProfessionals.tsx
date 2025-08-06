import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, Filter, Download, UserPlus, Mail, Phone, Award, Calendar } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  licenseNumber: string;
  hospitalId: string;
  joinDate: Date;
  lastLogin: Date;
  certificationsCount: number;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
}

const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+1 (555) 123-4567',
    department: 'Emergency Medicine',
    position: 'Emergency Physician',
    licenseNumber: 'MD-2024-001',
    hospitalId: 'HOSP-001',
    joinDate: new Date('2023-01-15'),
    lastLogin: new Date('2024-01-20'),
    certificationsCount: 5,
    status: 'active'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    phone: '+1 (555) 234-5678',
    department: 'Cardiology',
    position: 'Cardiologist',
    licenseNumber: 'MD-2024-002',
    hospitalId: 'HOSP-001',
    joinDate: new Date('2023-03-20'),
    lastLogin: new Date('2024-01-19'),
    certificationsCount: 7,
    status: 'active'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    phone: '+1 (555) 345-6789',
    department: 'Pediatrics',
    position: 'Pediatrician',
    licenseNumber: 'MD-2024-003',
    hospitalId: 'HOSP-001',
    joinDate: new Date('2023-06-10'),
    lastLogin: new Date('2024-01-18'),
    certificationsCount: 4,
    status: 'active'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    phone: '+1 (555) 456-7890',
    department: 'Surgery',
    position: 'Surgeon',
    licenseNumber: 'MD-2024-004',
    hospitalId: 'HOSP-001',
    joinDate: new Date('2022-11-05'),
    lastLogin: new Date('2024-01-15'),
    certificationsCount: 8,
    status: 'inactive'
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@hospital.com',
    phone: '+1 (555) 567-8901',
    department: 'Radiology',
    position: 'Radiologist',
    licenseNumber: 'MD-2024-005',
    hospitalId: 'HOSP-001',
    joinDate: new Date('2023-09-12'),
    lastLogin: new Date('2024-01-17'),
    certificationsCount: 3,
    status: 'active'
  }
];

export const AdminProfessionals: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prof.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || prof.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = Array.from(new Set(professionals.map(p => p.department)));

  const handleStatusChange = (id: string, newStatus: Professional['status']) => {
    setProfessionals(prev =>
      prev.map(prof =>
        prof.id === id ? { ...prof, status: newStatus } : prof
      )
    );
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Department', 'Position', 'License', 'Status', 'Certifications'],
      ...filteredProfessionals.map(prof => [
        prof.name,
        prof.email,
        prof.department,
        prof.position,
        prof.licenseNumber,
        prof.status,
        prof.certificationsCount.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'professionals.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Professional Management</h1>
          <p className="text-gray-600">Manage healthcare professionals and their accounts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Professional
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Professionals</p>
                <p className="text-2xl font-bold text-gray-900">{professionals.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {professionals.filter(p => p.status === 'active').length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certifications</p>
                <p className="text-2xl font-bold text-orange-600">
                  {professionals.reduce((sum, prof) => sum + prof.certificationsCount, 0)}
                </p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search professionals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Professionals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Professionals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Professional</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">License</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Certifications</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfessionals.map((prof) => (
                  <tr key={prof.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {prof.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{prof.name}</p>
                          <p className="text-sm text-gray-600">{prof.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {prof.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {prof.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{prof.department}</td>
                    <td className="py-3 px-4 text-gray-600">{prof.licenseNumber}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        <Award className="h-3 w-3" />
                        {prof.certificationsCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {prof.lastLogin.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        prof.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : prof.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {prof.status.charAt(0).toUpperCase() + prof.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={prof.status}
                        onChange={(e) => handleStatusChange(prof.id, e.target.value as Professional['status'])}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
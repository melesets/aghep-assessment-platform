import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Search, Edit, Trash2, Users, Calendar, Award } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // in minutes
  passingScore: number;
  totalQuestions: number;
  validityPeriod: number; // in months
  createdAt: Date;
  isActive: boolean;
  enrolledCount: number;
}

const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'Basic Life Support (BLS)',
    description: 'Essential life-saving techniques for healthcare professionals',
    category: 'Emergency Medicine',
    duration: 45,
    passingScore: 80,
    totalQuestions: 50,
    validityPeriod: 24,
    createdAt: new Date('2024-01-15'),
    isActive: true,
    enrolledCount: 245
  },
  {
    id: '2',
    name: 'Advanced Cardiac Life Support (ACLS)',
    description: 'Advanced cardiovascular emergency procedures',
    category: 'Cardiology',
    duration: 90,
    passingScore: 85,
    totalQuestions: 75,
    validityPeriod: 24,
    createdAt: new Date('2024-01-20'),
    isActive: true,
    enrolledCount: 189
  },
  {
    id: '3',
    name: 'Pediatric Advanced Life Support (PALS)',
    description: 'Emergency care for critically ill children',
    category: 'Pediatrics',
    duration: 75,
    passingScore: 85,
    totalQuestions: 60,
    validityPeriod: 24,
    createdAt: new Date('2024-02-01'),
    isActive: true,
    enrolledCount: 156
  },
  {
    id: '4',
    name: 'Infection Control Certification',
    description: 'Best practices for preventing healthcare-associated infections',
    category: 'Public Health',
    duration: 60,
    passingScore: 80,
    totalQuestions: 40,
    validityPeriod: 12,
    createdAt: new Date('2024-02-10'),
    isActive: false,
    enrolledCount: 78
  }
];

export const AdminCertifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>(mockCertifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);

  const filteredCertifications = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setCertifications(prev =>
      prev.map(cert =>
        cert.id === id ? { ...cert, isActive: !cert.isActive } : cert
      )
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      setCertifications(prev => prev.filter(cert => cert.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certification Management</h1>
          <p className="text-gray-600">Manage certification programs and requirements</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certifications</p>
                <p className="text-2xl font-bold text-gray-900">{certifications.length}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-green-600">
                  {certifications.filter(c => c.isActive).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-purple-600">
                  {certifications.reduce((sum, cert) => sum + cert.enrolledCount, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(certifications.map(c => c.category)).size}
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
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Certification Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Questions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Pass Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Enrolled</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertifications.map((cert) => (
                  <tr key={cert.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{cert.name}</p>
                        <p className="text-sm text-gray-600">{cert.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{cert.category}</td>
                    <td className="py-3 px-4 text-gray-600">{cert.duration} min</td>
                    <td className="py-3 px-4 text-gray-600">{cert.totalQuestions}</td>
                    <td className="py-3 px-4 text-gray-600">{cert.passingScore}%</td>
                    <td className="py-3 px-4 text-gray-600">{cert.enrolledCount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        cert.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cert.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCertification(cert)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(cert.id)}
                          className={`p-1 ${cert.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          title={cert.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {cert.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
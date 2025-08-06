import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, Download, Award, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';

interface IssuedCertificate {
  id: string;
  professionalName: string;
  professionalEmail: string;
  certificationName: string;
  issueDate: Date;
  expiryDate: Date;
  score: number;
  status: 'valid' | 'expired' | 'revoked';
  certificateNumber: string;
  department: string;
}

const mockCertificates: IssuedCertificate[] = [
  {
    id: '1',
    professionalName: 'Dr. Sarah Johnson',
    professionalEmail: 'sarah.johnson@hospital.com',
    certificationName: 'Basic Life Support (BLS)',
    issueDate: new Date('2023-06-15'),
    expiryDate: new Date('2025-06-15'),
    score: 92,
    status: 'valid',
    certificateNumber: 'BLS-2023-001',
    department: 'Emergency Medicine'
  },
  {
    id: '2',
    professionalName: 'Dr. Michael Chen',
    professionalEmail: 'michael.chen@hospital.com',
    certificationName: 'Advanced Cardiac Life Support (ACLS)',
    issueDate: new Date('2023-08-20'),
    expiryDate: new Date('2025-08-20'),
    score: 88,
    status: 'valid',
    certificateNumber: 'ACLS-2023-002',
    department: 'Cardiology'
  },
  {
    id: '3',
    professionalName: 'Dr. Emily Rodriguez',
    professionalEmail: 'emily.rodriguez@hospital.com',
    certificationName: 'Pediatric Advanced Life Support (PALS)',
    issueDate: new Date('2023-09-10'),
    expiryDate: new Date('2025-09-10'),
    score: 95,
    status: 'valid',
    certificateNumber: 'PALS-2023-003',
    department: 'Pediatrics'
  },
  {
    id: '4',
    professionalName: 'Dr. James Wilson',
    professionalEmail: 'james.wilson@hospital.com',
    certificationName: 'Basic Life Support (BLS)',
    issueDate: new Date('2022-05-15'),
    expiryDate: new Date('2024-05-15'),
    score: 85,
    status: 'expired',
    certificateNumber: 'BLS-2022-004',
    department: 'Surgery'
  },
  {
    id: '5',
    professionalName: 'Dr. Lisa Thompson',
    professionalEmail: 'lisa.thompson@hospital.com',
    certificationName: 'Infection Control Certification',
    issueDate: new Date('2023-11-01'),
    expiryDate: new Date('2024-11-01'),
    score: 90,
    status: 'valid',
    certificateNumber: 'ICC-2023-005',
    department: 'Radiology'
  },
  {
    id: '6',
    professionalName: 'Dr. Robert Davis',
    professionalEmail: 'robert.davis@hospital.com',
    certificationName: 'Advanced Cardiac Life Support (ACLS)',
    issueDate: new Date('2023-07-12'),
    expiryDate: new Date('2025-07-12'),
    score: 82,
    status: 'revoked',
    certificateNumber: 'ACLS-2023-006',
    department: 'Emergency Medicine'
  }
];

export const AdminCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<IssuedCertificate[]>(mockCertificates);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [certificationFilter, setCertificationFilter] = useState<string>('all');

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.professionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.professionalEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    const matchesCertification = certificationFilter === 'all' || cert.certificationName === certificationFilter;
    
    return matchesSearch && matchesStatus && matchesCertification;
  });

  const certificationTypes = Array.from(new Set(certificates.map(c => c.certificationName)));

  const handleRevokeCertificate = (id: string) => {
    if (window.confirm('Are you sure you want to revoke this certificate?')) {
      setCertificates(prev =>
        prev.map(cert =>
          cert.id === id ? { ...cert, status: 'revoked' } : cert
        )
      );
    }
  };

  const handleReissueCertificate = (id: string) => {
    setCertificates(prev =>
      prev.map(cert =>
        cert.id === id ? { ...cert, status: 'valid' } : cert
      )
    );
  };

  const exportCertificates = () => {
    const csvContent = [
      ['Professional', 'Email', 'Certification', 'Certificate Number', 'Issue Date', 'Expiry Date', 'Score', 'Status'],
      ...filteredCertificates.map(cert => [
        cert.professionalName,
        cert.professionalEmail,
        cert.certificationName,
        cert.certificateNumber,
        cert.issueDate.toLocaleDateString(),
        cert.expiryDate.toLocaleDateString(),
        cert.score.toString(),
        cert.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificates.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'revoked':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getExpiryStatus = (expiryDate: Date) => {
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring-soon';
    return 'valid';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificate Management</h1>
          <p className="text-gray-600">Manage issued certificates and their validity</p>
        </div>
        <Button onClick={exportCertificates} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Certificates
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valid Certificates</p>
                <p className="text-2xl font-bold text-green-600">
                  {certificates.filter(c => c.status === 'valid').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {certificates.filter(c => c.status === 'expired').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revoked</p>
                <p className="text-2xl font-bold text-red-600">
                  {certificates.filter(c => c.status === 'revoked').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
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
                placeholder="Search certificates..."
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
              <option value="valid">Valid</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
            <select
              value={certificationFilter}
              onChange={(e) => setCertificationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Certifications</option>
              {certificationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Issued Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Professional</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Certification</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Certificate #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Issue Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Expiry Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert) => {
                  const expiryStatus = getExpiryStatus(cert.expiryDate);
                  return (
                    <tr key={cert.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{cert.professionalName}</p>
                          <p className="text-sm text-gray-600">{cert.professionalEmail}</p>
                          <p className="text-sm text-gray-500">{cert.department}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{cert.certificationName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {cert.certificateNumber}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          cert.score >= 90 ? 'text-green-600' :
                          cert.score >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {cert.score}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {cert.issueDate.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${
                            expiryStatus === 'expired' ? 'text-red-600' :
                            expiryStatus === 'expiring-soon' ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {cert.expiryDate.toLocaleDateString()}
                          </span>
                          {expiryStatus === 'expiring-soon' && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Expiring Soon
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(cert.status)}
                          <span className={`text-sm font-medium ${
                            cert.status === 'valid' ? 'text-green-600' :
                            cert.status === 'expired' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {cert.status === 'valid' && (
                            <button
                              onClick={() => handleRevokeCertificate(cert.id)}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Revoke
                            </button>
                          )}
                          {cert.status === 'revoked' && (
                            <button
                              onClick={() => handleReissueCertificate(cert.id)}
                              className="text-sm text-green-600 hover:text-green-800"
                            >
                              Reissue
                            </button>
                          )}
                          <button className="text-sm text-blue-600 hover:text-blue-800">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
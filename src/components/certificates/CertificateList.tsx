import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  Award, 
  Download, 
  Share2, 
  Search,
  Calendar,
  CheckCircle,
  ExternalLink,
  Filter,
  Star
} from 'lucide-react';
import { Certificate } from '../../types/certificate';
import { generateCertificatePDF, downloadPDF } from '../../utils/certificateGenerator';
import { supabase } from '../../lib/supabase';

export const CertificateList: React.FC = () => {
  const { auth } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadCertificatesFromDatabase();
  }, [auth.user]);

  const loadCertificatesFromDatabase = async () => {
    try {
      console.log('🔍 Loading certificates from database...');
      
      if (!auth.user?.id) {
        console.log('⚠️ No user ID available');
        setCertificates([]);
        setLoading(false);
        return;
      }

      // Get certificates from database
      const { data: certificatesData, error } = await supabase
        .from('certificates')
        .select(`
          id,
          certificate_number,
          score,
          percentage,
          grade_text,
          issued_date,
          expiry_date,
          is_valid,
          verification_code,
          exams (
            id,
            title
          )
        `)
        .eq('user_id', auth.user.id)
        .eq('is_valid', true)
        .order('issued_date', { ascending: false });

      if (error) {
        console.error('❌ Error loading certificates:', error);
        setCertificates([]);
        return;
      }

      if (certificatesData && certificatesData.length > 0) {
        const formattedCertificates: Certificate[] = certificatesData.map((cert: any) => ({
          id: cert.id,
          userId: auth.user?.id || '',
          examId: cert.exams?.id || '',
          examTitle: cert.exams?.title || 'Unknown Exam',
          userName: auth.user?.name || '',
          userDepartment: auth.user?.department || '',
          userPosition: auth.user?.position || '',
          licenseNumber: auth.user?.licenseNumber,
          ceuCredits: Math.floor(cert.percentage / 10), // Estimate CEU credits based on score
          score: cert.score || 0,
          percentage: cert.percentage || 0,
          issuedAt: new Date(cert.issued_date),
          expiresAt: cert.expiry_date ? new Date(cert.expiry_date) : undefined,
          templateId: 'default',
          verificationCode: cert.verification_code || cert.certificate_number,
          qrCode: '',
          accreditationBody: 'Adare General Hospital',
        }));

        console.log('✅ Loaded certificates from database:', formattedCertificates.length);
        setCertificates(formattedCertificates);
      } else {
        console.log('📝 No certificates found in database');
        setCertificates([]);
      }
    } catch (error) {
      console.error('❌ Error loading certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (certificate: Certificate) => {
    setIsDownloading(certificate.id);
    try {
      const pdfBytes = await generateCertificatePDF(certificate, {
        id: certificate.templateId,
        name: 'Professional Certificate Template',
        design: {
          background: '#ffffff',
          title: 'Certificate of Professional Development',
          bodyText: 'This certifies professional achievement',
          signatureFields: [],
          colors: { primary: '#0066cc', secondary: '#00cc66', text: '#333333' },
          fonts: { heading: 'Helvetica-Bold', body: 'Helvetica' },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      downloadPDF(pdfBytes, `${certificate.examTitle}-Certificate.pdf`);
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleShareCertificate = (certificate: Certificate) => {
    const shareUrl = `${window.location.origin}/verify/${certificate.verificationCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${certificate.examTitle} Certificate`,
        text: `I've earned a certificate in ${certificate.examTitle}!`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Certificate verification link copied to clipboard!');
    }
  };

  const getExpirationStatus = (expiresAt: Date | undefined) => {
    if (!expiresAt) return 'permanent';
    
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) return 'expired';
    if (daysUntilExpiration <= 30) return 'expiring-soon';
    if (daysUntilExpiration <= 90) return 'expiring';
    return 'valid';
  };

  const getExpirationBadge = (status: string, expiresAt?: Date) => {
    switch (status) {
      case 'expired':
        return <Badge variant="danger">Expired</Badge>;
      case 'expiring-soon':
        return <Badge variant="warning">Expires Soon</Badge>;
      case 'expiring':
        return <Badge variant="secondary">Expires {expiresAt?.toLocaleDateString()}</Badge>;
      case 'permanent':
        return <Badge variant="success">Permanent</Badge>;
      default:
        return <Badge variant="success">Valid</Badge>;
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.accreditationBody.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || 
                       cert.issuedAt.getFullYear().toString() === selectedYear;
    
    return matchesSearch && matchesYear;
  });

  const totalCEUs = certificates.reduce((sum, cert) => sum + cert.ceuCredits, 0);
  const availableYears = [...new Set(certificates.map(cert => cert.issuedAt.getFullYear().toString()))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificates from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600">
            {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned • {totalCEUs} total CEUs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="text-lg font-semibold text-gray-900">{totalCEUs} CEUs</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{certificates.length}</div>
            <div className="text-sm text-gray-600">Total Certificates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalCEUs}</div>
            <div className="text-sm text-gray-600">CEU Credits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {certificates.length > 0 ? Math.round(certificates.reduce((sum, cert) => sum + cert.percentage, 0) / certificates.length) : 0}%
            </div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {certificates.filter(cert => getExpirationStatus(cert.expiresAt) === 'valid').length}
            </div>
            <div className="text-sm text-gray-600">Active Certificates</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Only show if there are certificates */}
      {certificates.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificates Grid or Empty State */}
      {filteredCertificates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Certificates Found</h3>
            <p className="text-gray-600 mb-4">
              {certificates.length === 0 
                ? 'You haven\'t earned any certificates yet.'
                : 'No certificates match your search criteria.'
              }
            </p>
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
              <p className="font-medium mb-2">To earn certificates:</p>
              <ul className="text-left space-y-1">
                <li>• Complete exams with passing scores</li>
                <li>• Certificates are automatically generated</li>
                <li>• Check back after completing assessments</li>
              </ul>
            </div>
            {certificates.length === 0 && (
              <Button 
                className="mt-4"
                onClick={() => window.location.href = '/'}
              >
                Take Your First Exam
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.map((certificate) => {
            const expirationStatus = getExpirationStatus(certificate.expiresAt);
            
            return (
              <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Award className="h-8 w-8 text-yellow-500" />
                      <div>
                        <CardTitle className="text-lg leading-tight">
                          {certificate.examTitle}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {certificate.accreditationBody}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getExpirationBadge(expirationStatus, certificate.expiresAt)}
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        DB
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Score:</span>
                      <span className="ml-2 font-medium">{certificate.percentage}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">CEU Credits:</span>
                      <span className="ml-2 font-medium">{certificate.ceuCredits}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Issued:</span>
                      <span className="ml-2 font-medium">
                        {certificate.issuedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expires:</span>
                      <span className="ml-2 font-medium">
                        {certificate.expiresAt ? certificate.expiresAt.toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Verification Code:</div>
                    <div className="font-mono text-sm text-gray-900">
                      {certificate.verificationCode}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleDownloadCertificate(certificate)}
                      loading={isDownloading === certificate.id}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareCertificate(certificate)}
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-blue-600 hover:text-blue-700"
                    onClick={() => window.open(`/verify/${certificate.verificationCode}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Verify Certificate
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
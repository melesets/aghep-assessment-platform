import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Award, Download, Home, Calendar, User, Hash } from 'lucide-react';

interface Certificate {
  id: string;
  examTitle: string;
  studentName: string;
  score: number;
  completedAt: string;
  certificateNumber: string;
}

export const CertificateView: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (certificateId) {
      const storedCertificate = localStorage.getItem(`certificate-${certificateId}`);
      if (storedCertificate) {
        setCertificate(JSON.parse(storedCertificate));
      }
    }
    setLoading(false);
  }, [certificateId]);

  const downloadCertificate = async () => {
    if (!certificate) return;
    
    // Get certificate template from localStorage or use default
    const defaultTemplate = {
      id: 'default',
      name: 'Default Template',
      title: 'CERTIFICATE OF COMPLETION',
      subtitle: 'This is to certify that',
      organizationName: 'Exam Portal',
      signatoryName: 'Director of Education',
      signatoryTitle: 'Chief Academic Officer',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#2563eb',
      fontSize: {
        title: 32,
        subtitle: 18,
        body: 16
      },
      layout: 'classic' as const
    };

    const template = JSON.parse(localStorage.getItem('certificate-template') || JSON.stringify(defaultTemplate));
    
    // Generate PDF using the template
    await generateCertificatePDF(certificate, template);
  };

  const generateCertificatePDF = async (certificate: Certificate, template: any) => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Set background color
      if (template.backgroundColor !== '#ffffff') {
        pdf.setFillColor(template.backgroundColor);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      }

      // Helper function to convert hex to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };

      const textColor = hexToRgb(template.textColor);
      const accentColor = hexToRgb(template.accentColor);

      // Title
      pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
      pdf.setFontSize(template.fontSize.title);
      pdf.setFont('helvetica', 'bold');
      pdf.text(template.title, pageWidth / 2, 40, { align: 'center' });

      // Decorative line
      pdf.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
      pdf.setLineWidth(2);
      pdf.line(pageWidth / 2 - 50, 50, pageWidth / 2 + 50, 50);

      // Subtitle
      pdf.setTextColor(textColor.r, textColor.g, textColor.b);
      pdf.setFontSize(template.fontSize.subtitle);
      pdf.setFont('helvetica', 'normal');
      pdf.text(template.subtitle, pageWidth / 2, 70, { align: 'center' });

      // Student name
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text(certificate.studentName, pageWidth / 2, 90, { align: 'center' });

      // Underline for name
      pdf.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
      pdf.line(pageWidth / 2 - 60, 95, pageWidth / 2 + 60, 95);

      // Body text
      pdf.setFontSize(template.fontSize.body);
      pdf.setFont('helvetica', 'normal');
      pdf.text('has successfully completed the', pageWidth / 2, 110, { align: 'center' });

      // Exam title
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b);
      pdf.text(certificate.examTitle, pageWidth / 2, 125, { align: 'center' });

      // Score
      pdf.setFontSize(template.fontSize.body);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(textColor.r, textColor.g, textColor.b);
      pdf.text(`with a score of ${certificate.score}%`, pageWidth / 2, 140, { align: 'center' });

      // Date and certificate number
      pdf.setFontSize(12);
      const completedDate = new Date(certificate.completedAt).toLocaleDateString();
      pdf.text(`Completed on: ${completedDate}`, pageWidth / 2 - 80, 165, { align: 'left' });
      pdf.text(`Certificate #: ${certificate.certificateNumber}`, pageWidth / 2 + 20, 165, { align: 'left' });

      // Organization name
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(template.organizationName, pageWidth / 2, 180, { align: 'center' });

      // Signature line and signatory
      pdf.setDrawColor(textColor.r, textColor.g, textColor.b);
      pdf.line(pageWidth / 2 - 40, 195, pageWidth / 2 + 40, 195);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(template.signatoryName, pageWidth / 2, 202, { align: 'center' });
      pdf.text(template.signatoryTitle, pageWidth / 2, 208, { align: 'center' });

      // Save the PDF
      pdf.save(`certificate-${certificate.certificateNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const printCertificate = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Certificate not found</h2>
        <p className="text-gray-600 mb-4">The certificate you're looking for could not be found.</p>
        <Button onClick={() => navigate('/')}>
          <Home className="h-4 w-4 mr-2" />
          Back to Exams
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Certificate */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white print:shadow-none">
        <CardContent className="p-12">
          <div className="text-center space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <Award className="h-16 w-16 text-blue-600 mx-auto" />
              <h1 className="text-4xl font-bold text-blue-900 tracking-wide">
                CERTIFICATE OF COMPLETION
              </h1>
              <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700">This is to certify that</p>
              
              <div className="py-4">
                <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 inline-block">
                  {certificate.studentName}
                </h2>
              </div>

              <p className="text-lg text-gray-700">has successfully completed the</p>

              <div className="py-4">
                <h3 className="text-2xl font-semibold text-blue-900">
                  {certificate.examTitle}
                </h3>
              </div>

              <p className="text-lg text-gray-700">
                with a score of <span className="font-bold text-green-600">{certificate.score}%</span>
              </p>
            </div>

            {/* Footer */}
            <div className="pt-8 space-y-4">
              <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Completed: {new Date(certificate.completedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span>Certificate #: {certificate.certificateNumber}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="w-48 border-t border-gray-400 mx-auto pt-2">
                  <p className="text-sm text-gray-600">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
        <Button onClick={() => navigate('/')} variant="outline">
          <Home className="h-4 w-4 mr-2" />
          Back to Exams
        </Button>
        
        <Button onClick={printCertificate} variant="outline">
          Print Certificate
        </Button>
        
        <Button onClick={downloadCertificate}>
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      </div>

      {/* Certificate Info */}
      <Card className="print:hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">Student:</span>
              <span className="text-gray-600">{certificate.studentName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-400" />
              <span className="font-medium">Score:</span>
              <span className="text-gray-600">{certificate.score}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="font-medium">Completed:</span>
              <span className="text-gray-600">{new Date(certificate.completedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-400" />
              <span className="font-medium">Certificate Number:</span>
              <span className="text-gray-600">{certificate.certificateNumber}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              This certificate is valid and can be verified using the certificate number above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Certificate, CertificateTemplate } from '../types/certificate';
import * as QRCode from 'qrcode';

export const generateCertificatePDF = async (
  certificate: Certificate,
  template: CertificateTemplate
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.99, 1.0), // Medical white/blue tint
  });

  // Border
  page.drawRectangle({
    x: 50,
    y: 50,
    width: width - 100,
    height: height - 100,
    borderColor: rgb(0.0, 0.4, 0.8), // Medical blue
    borderWidth: 4,
  });

  // Medical cross logo (simplified)
  page.drawRectangle({
    x: width / 2 - 15,
    y: height - 80,
    width: 30,
    height: 8,
    color: rgb(0.8, 0.1, 0.1), // Medical red
  });
  page.drawRectangle({
    x: width / 2 - 4,
    y: height - 91,
    width: 8,
    height: 30,
    color: rgb(0.8, 0.1, 0.1), // Medical red
  });

  // Title
  const titleText = 'CERTIFICATE OF PROFESSIONAL DEVELOPMENT';
  page.drawText(titleText, {
    x: width / 2 - (titleText.length * 10),
    y: height - 140,
    size: 20,
    font: boldFont,
    color: rgb(0.0, 0.4, 0.8),
  });

  // Subtitle
  const subtitleText = 'This certifies that the healthcare professional';
  page.drawText(subtitleText, {
    x: width / 2 - (subtitleText.length * 5),
    y: height - 170,
    size: 14,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Name
  page.drawText(certificate.userName, {
    x: width / 2 - (certificate.userName.length * 10),
    y: height - 200,
    size: 28,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Department and Position
  const deptText = `${certificate.userDepartment} - ${certificate.userPosition}`;
  page.drawText(deptText, {
    x: width / 2 - (deptText.length * 4),
    y: height - 225,
    size: 12,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // License Number
  if (certificate.licenseNumber) {
    const licenseText = `License: ${certificate.licenseNumber}`;
    page.drawText(licenseText, {
      x: width / 2 - (licenseText.length * 4),
      y: height - 245,
      size: 12,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  // Achievement text
  const achievementText = `has successfully completed the professional certification examination`;
  page.drawText(achievementText, {
    x: width / 2 - (achievementText.length * 5),
    y: height - 280,
    size: 14,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Exam title
  page.drawText(certificate.examTitle, {
    x: width / 2 - (certificate.examTitle.length * 8),
    y: height - 305,
    size: 20,
    font: boldFont,
    color: rgb(0.0, 0.4, 0.8),
  });

  // Score
  const scoreText = `achieving a score of ${certificate.percentage}%`;
  page.drawText(scoreText, {
    x: width / 2 - (scoreText.length * 5),
    y: height - 335,
    size: 14,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // CEU Credits
  const ceuText = `Continuing Education Units: ${certificate.ceuCredits} CEUs`;
  page.drawText(ceuText, {
    x: width / 2 - (ceuText.length * 5),
    y: height - 360,
    size: 14,
    font: boldFont,
    color: rgb(0.0, 0.6, 0.0),
  });

  // Accreditation
  const accreditationText = `Accredited by: ${certificate.accreditationBody}`;
  page.drawText(accreditationText, {
    x: width / 2 - (accreditationText.length * 4),
    y: height - 385,
    size: 12,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Date
  const dateText = `Date: ${certificate.issuedAt.toLocaleDateString()}`;
  page.drawText(dateText, {
    x: 100,
    y: 180,
    size: 14,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Expiration (if applicable)
  if (certificate.expiresAt) {
    const expirationText = `Valid until: ${certificate.expiresAt.toLocaleDateString()}`;
    page.drawText(expirationText, {
      x: 100,
      y: 160,
      size: 12,
      font,
      color: rgb(0.6, 0.2, 0.2),
    });
  }

  // Verification code
  const verificationText = `Verification Code: ${certificate.verificationCode}`;
  page.drawText(verificationText, {
    x: 100,
    y: 140,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Generate QR code
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(
      `https://hospitalcerts.com/verify/${certificate.verificationCode}`
    );
    const qrCodeImageBytes = await fetch(qrCodeDataUrl).then(res => res.arrayBuffer());
    const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);
    
    page.drawImage(qrCodeImage, {
      x: width - 150,
      y: 120,
      width: 80,
      height: 80,
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export const downloadPDF = (pdfBytes: Uint8Array, filename: string) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
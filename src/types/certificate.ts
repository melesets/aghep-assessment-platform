export interface CertificateTemplate {
  id: string;
  name: string;
  design: CertificateDesign;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateDesign {
  background: string;
  logo?: string;
  title: string;
  subtitle?: string;
  bodyText: string;
  signatureFields: SignatureField[];
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface SignatureField {
  id: string;
  name: string;
  title: string;
  signature?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  userName: string;
  userDepartment: string;
  userPosition: string;
  licenseNumber?: string;
  ceuCredits: number;
  score: number;
  percentage: number;
  issuedAt: Date;
  expiresAt?: Date;
  templateId: string;
  verificationCode: string;
  qrCode: string;
  pdfUrl?: string;
  accreditationBody: string;
}
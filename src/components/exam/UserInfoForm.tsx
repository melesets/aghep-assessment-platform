import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Mail, Phone, MapPin, Building, CreditCard, AlertCircle } from 'lucide-react';

interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  licenseNumber?: string;
  hospitalId: string;
  organization: string;
}

interface UserInfoFormProps {
  examTitle: string;
  onSubmit: (userInfo: UserInfo) => void;
  onCancel: () => void;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({ examTitle, onSubmit, onCancel }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    licenseNumber: '',
    hospitalId: '',
    organization: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!userInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!userInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!userInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!userInfo.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!userInfo.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!userInfo.hospitalId.trim()) {
      newErrors.hospitalId = 'Hospital/Employee ID is required';
    }

    if (!userInfo.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Store user info in localStorage for future use
      localStorage.setItem('lastUserInfo', JSON.stringify(userInfo));
      onSubmit(userInfo);
    }
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Load previously entered info if available
  React.useEffect(() => {
    const savedInfo = localStorage.getItem('lastUserInfo');
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo);
        setUserInfo(parsedInfo);
      } catch (error) {
        console.error('Error loading saved user info:', error);
      }
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <User className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
        <p className="text-gray-600">
          Please provide your information to generate your certificate for:
        </p>
        <p className="text-lg font-semibold text-blue-600 mt-2">{examTitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Certificate Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Full Name"
                  value={userInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name as it should appear on the certificate"
                  required
                  error={errors.fullName}
                  icon={<User className="h-4 w-4" />}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
                error={errors.email}
                icon={<Mail className="h-4 w-4" />}
              />

              <Input
                label="Phone Number"
                value={userInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
                error={errors.phone}
                icon={<Phone className="h-4 w-4" />}
              />

              <Input
                label="Department"
                value={userInfo.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="e.g., Emergency Medicine, Nursing, etc."
                required
                error={errors.department}
                icon={<Building className="h-4 w-4" />}
              />

              <Input
                label="Position/Title"
                value={userInfo.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="e.g., Registered Nurse, Physician, etc."
                required
                error={errors.position}
                icon={<User className="h-4 w-4" />}
              />

              <Input
                label="License Number (Optional)"
                value={userInfo.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                placeholder="Professional license number"
                icon={<CreditCard className="h-4 w-4" />}
              />

              <Input
                label="Hospital/Employee ID"
                value={userInfo.hospitalId}
                onChange={(e) => handleInputChange('hospitalId', e.target.value)}
                placeholder="Your employee or hospital ID"
                required
                error={errors.hospitalId}
                icon={<CreditCard className="h-4 w-4" />}
              />

              <div className="md:col-span-2">
                <Input
                  label="Organization/Hospital"
                  value={userInfo.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  placeholder="Name of your hospital or healthcare organization"
                  required
                  error={errors.organization}
                  icon={<Building className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Important Information:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• This information will be used to generate your certificate</li>
                    <li>• Please ensure all details are accurate and complete</li>
                    <li>• Your information will be saved for future assessments</li>
                    <li>• Certificates cannot be modified after generation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Continue to Exam
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
# 🏥 AGHEP Assessment Platform

A modern, professional assessment and certification platform for Adare General Hospital's Education Program (AGHEP).

## ✨ Features

- 🔐 **Secure Authentication** - Admin and student login system
- 📝 **Exam Management** - Create, edit, and manage assessments
- 📊 **Real-time Analytics** - Track student progress and performance
- 🏆 **Certificate Generation** - Automatic certificate creation with verification
- 📱 **Responsive Design** - Works on all devices
- 🔒 **Role-based Access** - Admin and student permissions
- 📈 **Progress Tracking** - Detailed assessment records
- 🎨 **Modern UI** - Clean, professional interface

## 🚀 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Database**: PostgreSQL (Supabase)

## 🔧 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/aghep-assessment-platform.git

# Navigate to project directory
cd aghep-assessment-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 👤 Default Login

**Admin Account:**
- Email: `admin@admin.com`
- Password: `Password`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── exam/           # Exam-related components
│   ├── ui/             # Reusable UI components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 📊 Database Schema

The platform uses Supabase with the following main tables:
- `profiles` - User accounts and roles
- `categories` - Exam categories
- `exams` - Assessment definitions
- `questions` - Exam questions
- `question_options` - Multiple choice options
- `exam_attempts` - Student attempt records
- `certificates` - Generated certificates

## 🚀 Deployment

The app is deployed on Vercel with automatic deployments from the main branch.

**Live URL**: [Your deployed URL]

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Secure authentication with Supabase Auth
- Environment variable protection
- Input validation and sanitization
- Role-based access control

## 📱 Responsive Design

The platform is fully responsive and works on:
- 💻 Desktop computers
- 📱 Mobile phones
- 📟 Tablets
- 🖥️ Large screens

## 🎨 UI/UX Features

- Modern, clean design
- Intuitive navigation
- Loading states and animations
- Error handling and validation
- Accessibility compliance
- Dark/light mode support

## 📈 Analytics & Reporting

- Real-time dashboard statistics
- Student progress tracking
- Exam performance analytics
- Certificate generation reports
- Export capabilities (CSV, PDF)

## 🏆 Certificate System

- Automatic certificate generation
- QR code verification
- Custom templates
- Digital signatures
- Expiration tracking

## 🔧 Admin Features

- User management
- Exam creation and editing
- Question bank management
- Analytics dashboard
- Certificate template customization
- System settings

## 📚 Student Features

- Take assessments
- View results and progress
- Download certificates
- Track CEU credits
- Access learning materials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🏥 About AGHEP

Adare General Hospital Education Program (AGHEP) is committed to providing high-quality medical education and professional development opportunities for healthcare professionals.

## 📞 Support

For technical support or questions, please contact the development team.

---

**Built with ❤️ for healthcare education**
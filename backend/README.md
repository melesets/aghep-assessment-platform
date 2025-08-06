# AGHEP Backend API

Complete Node.js + Express backend for the AGHEP Assessment Platform with PostgreSQL integration.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (running on port 1221)
- Database named "ISBAR" with password "1954"

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - The `.env` file is already configured for your PostgreSQL setup
   - Update `JWT_SECRET` for production use

4. **Create database tables:**
   ```bash
   npm run migrate
   ```

5. **Seed database with sample data:**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### Core Tables Created:

1. **users** - User accounts and profiles
2. **categories** - Exam categories
3. **exams** - Exam definitions
4. **questions** - Exam questions
5. **question_options** - Multiple choice options
6. **exam_attempts** - User exam attempts
7. **user_answers** - Individual question answers
8. **certificates** - Generated certificates
9. **skill_sessions** - Skill lab sessions
10. **skill_session_participants** - Session participants
11. **assessment_records** - Assessment history
12. **system_settings** - Application settings
13. **audit_logs** - System audit trail

## 🔐 Default User Accounts

After running the seed script, you'll have these accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@aghep.com | admin123 | admin |
| instructor@aghep.com | student123 | instructor |
| student@demo.com | student123 | student |
| jane.smith@aghep.com | student123 | student |

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Exams
- `GET /api/exams` - Get all published exams
- `GET /api/exams/:id` - Get exam with questions
- `POST /api/exams/:id/start` - Start exam attempt
- `POST /api/exams` - Create exam (Admin/Instructor)
- `PUT /api/exams/:id` - Update exam (Admin/Instructor)
- `DELETE /api/exams/:id` - Delete exam (Admin)

### Health Check
- `GET /health` - Server health status

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=1221
DB_NAME=ISBAR
DB_USER=postgres
DB_PASSWORD=1954

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 🛡 Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevents abuse
- **Input Validation** - Comprehensive validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Protection** - Configured for frontend
- **Helmet Security** - Security headers
- **Password Hashing** - bcrypt with salt rounds
- **Role-based Access** - Admin/Instructor/Student roles

## 📝 Database Commands

```bash
# Create all tables and indexes
npm run migrate

# Populate with sample data
npm run seed

# Both migrate and seed
npm run migrate && npm run seed
```

## 🔍 Monitoring & Logging

- **Morgan Logging** - HTTP request logging
- **Error Handling** - Comprehensive error management
- **Health Checks** - Server and database status
- **Audit Logging** - User action tracking

## 🚦 Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Exam Attempts**: 10 attempts per hour
- **File Uploads**: 20 uploads per hour
- **Admin Operations**: 100 operations per hour

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── validation.js        # Input validation
│   └── rateLimiter.js       # Rate limiting
├── routes/
│   ├── auth.js              # Authentication routes
│   └── exams.js             # Exam routes
├── scripts/
│   ├── migrate.js           # Database migration
│   └── seed.js              # Database seeding
├── uploads/                 # File upload directory
├── .env                     # Environment variables
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

## 🔄 Development Workflow

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test API endpoints:**
   - Use Postman, Insomnia, or curl
   - Check `/health` endpoint first
   - Login to get JWT token
   - Use token in Authorization header: `Bearer <token>`

3. **Database changes:**
   - Modify migration script
   - Run `npm run migrate`
   - Update seed data if needed

## 🐛 Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running on port 1221
2. Check database "ISBAR" exists
3. Verify credentials (postgres/1954)
4. Check firewall settings

### Common Errors
- **ECONNREFUSED**: Database not running
- **Invalid token**: JWT expired or malformed
- **Validation failed**: Check request body format
- **Rate limit exceeded**: Wait and retry

## 🚀 Production Deployment

1. **Update environment variables:**
   - Set strong `JWT_SECRET`
   - Configure production database
   - Set `NODE_ENV=production`

2. **Security checklist:**
   - Enable SSL/HTTPS
   - Configure firewall
   - Set up monitoring
   - Regular backups

3. **Performance optimization:**
   - Enable compression
   - Configure caching
   - Database indexing
   - Load balancing

## 📞 Support

For issues or questions:
1. Check the logs: `console.log` output
2. Verify database connection
3. Test with provided sample data
4. Check API documentation above

## 🎯 Next Steps

The backend is now ready to integrate with your React frontend. Update your frontend API calls to use:
- Base URL: `http://localhost:5000/api`
- Authentication: JWT tokens
- Error handling: Standardized response format

Happy coding! 🚀
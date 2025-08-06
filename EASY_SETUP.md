# 🚀 SUPER EASY SETUP GUIDE

## Step 1: Make sure PostgreSQL is running
1. Open **pgAdmin** or your PostgreSQL management tool
2. Make sure PostgreSQL is running on **port 1221**
3. Make sure you have a database called **ISBAR**
4. Make sure the password is **1954**

## Step 2: Run the automatic setup
1. **Double-click** the `setup.bat` file in your project folder
2. Wait for it to finish (it will install everything automatically)
3. The server will start automatically when done

## That's it! 🎉

The setup script will:
- ✅ Check if Node.js is installed
- ✅ Install all required packages
- ✅ Create all database tables
- ✅ Add sample data
- ✅ Start the server

## If you get an error:

### "Node.js is not installed"
- Download and install Node.js from: https://nodejs.org/
- Choose the LTS version
- Restart your computer after installation

### "Database connection failed"
- Make sure PostgreSQL is running
- Check that port 1221 is correct
- Check that database "ISBAR" exists
- Check that password is "1954"

### "Permission denied"
- Right-click `setup.bat` and choose "Run as administrator"

## After setup is complete:

### Test the backend:
1. Open your browser
2. Go to: http://localhost:5000/health
3. You should see a success message

### Test login:
- Email: `student@demo.com`
- Password: `student123`

### Admin login:
- Email: `admin@aghep.com`
- Password: `admin123`

## Manual setup (if automatic doesn't work):

1. Open Command Prompt in the project folder
2. Run these commands one by one:

```bash
cd backend
npm install
node scripts/migrate.js
node scripts/seed.js
npm run dev
```

## Need help?
If you're still having trouble, let me know what error message you see and I'll help you fix it!
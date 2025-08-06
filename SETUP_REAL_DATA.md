# 🗄️ REPLACE DEMO DATA WITH REAL SUPABASE DATA

## 🎯 Current Issue
Your app is showing demo/mock data because the Supabase database tables haven't been created yet. Let's fix this!

## 🔧 Step-by-Step Setup

### **Step 1: Create Database Tables**

1. **Go to your Supabase Dashboard**: 
   - Open: https://flgdutcvnynddnorfofb.supabase.co
   - Login to your Supabase account

2. **Navigate to SQL Editor**:
   - Click "SQL Editor" in the left sidebar

3. **Run the Database Schema**:
   - Copy ALL content from `supabase-schema.sql` file
   - Paste it into the SQL Editor
   - Click "Run" button

### **Step 2: Verify Tables Created**

After running the SQL, test the connection:

```bash
node test-setup.js
```

You should see: `✅ Connection successful and tables exist!`

### **Step 3: Create Admin Profile**

```bash
cd backend
node scripts/create-real-admin.js
```

### **Step 4: Test Your App**

```bash
npm run dev
```

Login with:
- **Email**: `admin@admin.com`
- **Password**: `Password`

## ��� What You'll Get

After completing these steps:

### **Real Data Instead of Demo Data** ✅
- ✅ Real categories from database
- ✅ Real exams with actual questions
- ✅ Real user profiles
- ✅ Real assessment records
- ✅ Real certificates

### **Sample Data Included** 📋
- 5 healthcare categories
- 1 sample exam with 3 questions
- Proper question options
- Admin profile

### **Admin Features** 🔧
- Create new exams
- Add questions
- Manage users
- View real analytics
- Generate certificates

## 🔍 How to Verify It's Working

1. **Login as admin**
2. **Check the exam list** - you should see "Basic Healthcare Assessment"
3. **Go to admin dashboard** - you should see real data, not demo data
4. **Take the sample exam** to test the full flow

## 🆘 If You Need Help

If you encounter any issues:

1. **Check browser console** for errors
2. **Verify all SQL ran successfully** in Supabase
3. **Ensure admin account exists** in Supabase Auth
4. **Test connection** with `node test-setup.js`

---

**Once you complete Step 1 (running the SQL), your app will show real data instead of demo data!** 🚀
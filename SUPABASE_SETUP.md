# 🚀 SUPER EASY SUPABASE SETUP

Supabase is much easier than setting up your own PostgreSQL! It's like "PostgreSQL in the cloud" with a nice dashboard.

## Step 1: Create Supabase Account (FREE!)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email
4. It's completely FREE for small projects!

## Step 2: Create New Project

1. Click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `AGHEP Assessment Platform`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

## Step 3: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these 3 values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role secret key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 4: Configure Your Project

1. In your project folder, rename `.env.example` to `.env`
2. Open `.env` file and replace with your values:

```env
# Replace these with your actual Supabase values
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Keep these as they are
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 5: Run Setup (Automatic!)

1. **Double-click `setup-supabase.bat`** (I'll create this for you)
2. It will:
   - Install all packages
   - Create all database tables
   - Set up security rules
   - Add sample data
   - Start the server

## That's it! 🎉

### Benefits of Supabase:
- ✅ **No local PostgreSQL setup needed**
- ✅ **Free tier with generous limits**
- ✅ **Built-in authentication**
- ✅ **Real-time features**
- ✅ **Nice web dashboard**
- ✅ **Automatic backups**
- ✅ **SSL/Security included**

### Test Your Setup:
1. Go to: `http://localhost:5000/health`
2. Should see success message
3. Check Supabase dashboard to see your tables

### Supabase Dashboard Features:
- **Table Editor**: View/edit data like Excel
- **SQL Editor**: Run custom queries
- **Authentication**: Manage users
- **Storage**: File uploads
- **Logs**: See what's happening

### Default Login Accounts:
- **Student**: `student@demo.com` / `student123`
- **Admin**: `admin@aghep.com` / `admin123`

## If You Need Help:

### "Can't connect to Supabase":
1. Check your `.env` file has correct values
2. Make sure you copied the full URLs/keys
3. Check your internet connection

### "Table already exists":
- This is normal, just means setup ran before
- Your data is safe!

### "Permission denied":
- Check your service role key is correct
- Make sure you're using the SECRET key, not the public key

## Why Supabase is Better:

| Local PostgreSQL | Supabase |
|------------------|----------|
| ❌ Complex setup | ✅ 5-minute setup |
| ❌ Manual backups | ✅ Automatic backups |
| ❌ No web interface | ✅ Beautiful dashboard |
| ❌ Security setup needed | ✅ Security included |
| ❌ Local only | ✅ Accessible anywhere |
| ❌ No built-in auth | ✅ Authentication included |

Ready to switch? Let's do it! 🚀
# 🚀 DEPLOYMENT GUIDE - FREE HOSTING

## 🎯 **RECOMMENDED: VERCEL (Best for React)**

### **Step 1: Push to GitHub**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - AGHEP Assessment Platform"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/aghep-assessment.git
git push -u origin main
```

### **Step 2: Deploy to Vercel**
1. **Go to**: [vercel.com](https://vercel.com)
2. **Sign up**: With your GitHub account
3. **Click**: "New Project"
4. **Import**: Your GitHub repository
5. **Configure**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variables**:
   - `VITE_SUPABASE_URL`: `https://pxfxpbobbhfwfxshokho.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZnhwYm9iYmhmd2Z4c2hva2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTMzNzAsImV4cCI6MjA3MDA4OTM3MH0.F3twFsyaEXUYflg0-jFJ49vnBe_KTUL7208xwV3bWZU`
7. **Click**: "Deploy"

### **Step 3: Your App is Live!**
- **URL**: `https://your-app-name.vercel.app`
- **Custom Domain**: Available in settings
- **Auto-deploys**: Every GitHub push

---

## 🔄 **ALTERNATIVE: NETLIFY**

### **Option A: Drag & Drop**
1. **Build your app**: `npm run build`
2. **Go to**: [netlify.com](https://netlify.com)
3. **Drag**: Your `dist` folder to Netlify
4. **Done!**

### **Option B: GitHub Integration**
1. **Connect**: GitHub repository
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment variables**: Same as Vercel
4. **Deploy**

---

## 🔧 **ALTERNATIVE: GITHUB PAGES**

### **Setup GitHub Pages**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://yourusername.github.io/aghep-assessment",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

---

## 🔥 **ALTERNATIVE: FIREBASE HOSTING**

### **Setup Firebase**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy
```

---

## 🎯 **RECOMMENDED CHOICE: VERCEL**

**Why Vercel is best for your AGHEP app:**
- ✅ **Zero configuration** for React/Vite
- ✅ **Automatic deployments** from GitHub
- ✅ **Environment variables** support
- ✅ **Custom domains** (free)
- ✅ **Global CDN** (fast worldwide)
- ✅ **Analytics** and monitoring
- ✅ **Preview deployments** for testing

## 📋 **FINAL CHECKLIST:**

Before deploying:
- ✅ **Test locally**: `npm run build && npm run preview`
- ✅ **Environment variables**: Set in hosting platform
- ✅ **Supabase URLs**: Configured correctly
- ✅ **Admin login**: `admin@admin.com` / `Password`

## 🎉 **RESULT:**

Your AGHEP Assessment Platform will be live at:
- **Vercel**: `https://your-app.vercel.app`
- **Netlify**: `https://your-app.netlify.app`
- **GitHub Pages**: `https://yourusername.github.io/aghep-assessment`

**Your app will be accessible worldwide for free!** 🌍

---

## 🔗 **CUSTOM DOMAIN (Optional)**

All platforms support custom domains:
- **Buy domain**: Namecheap, GoDaddy, etc.
- **Add to platform**: In hosting settings
- **Update DNS**: Point to hosting platform
- **SSL**: Automatic (free)

**Example**: `https://aghep-assessment.com`
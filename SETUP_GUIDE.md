# 🚀 Setup Guide - Code Sensei v2.0

## ⚡ Quick Setup (5 Minutes)

### 1️⃣ Get API Key (2 min)
```
URL: https://aistudio.google.com/app/apikey
→ Click "Create API Key"
→ Copy the key (starts with AIzaSy...)
```

### 2️⃣ Create .env File (1 min)
```bash
# In project root, create .env file:
VITE_GOOGLE_GENAI_API_KEY=paste_your_key_here
```

### 3️⃣ Install & Run (2 min)
```bash
npm install
npm run dev
```

**That's it!** 🎉 App opens at http://localhost:4173

---

## 📋 Detailed Step-by-Step

### Step 1: Get Your Google Gemini API Key

**What you need:** A Google account (free)

**Steps:**
1. Open https://aistudio.google.com/app/apikey
2. Click blue **"Create API Key"** button
3. A popup shows your new API key
4. **Copy the entire key** (don't modify it!)
5. Keep it safe (it's like a password)

**Example key format:**
```
AIzaSyDTGmxJ5Vj__d6opV3S0ApvNXNh7oTbD2o
```

### Step 2: Create Environment File

**Location:** Project root folder (same level as package.json)

**File name:** `.env` (including the dot!)

**Content:**
```
VITE_GOOGLE_GENAI_API_KEY=your_key_here
```

**Replace:** `your_key_here` with your actual key

**Full example:**
```
VITE_GOOGLE_GENAI_API_KEY=AIdaSyDTGnxJ5Vy__d6opV3S0ApuNXNh7oTbD2o
```

**⚠️ IMPORTANT:**
- ❌ DO NOT commit this file to Git
- ❌ DO NOT share this key with anyone
- ✅ It's automatically ignored (see .gitignore)

### Step 3: Install Dependencies

**Open terminal in project folder:**
```bash
npm install
```

**This will:**
- Download all required packages
- Setup React, Vite, Gemini API SDK, etc.
- Takes 2-3 minutes

**If you get warnings about peer dependencies:**
```bash
npm install --legacy-peer-deps
```

### Step 4: Start Development Server

```bash
npm run dev
```

**You should see:**
```
  VITE v6.2.0  ready in 234 ms

  ➜  Local:   http://localhost:4173/
  ➜  press h to show help
```

### Step 5: Open in Browser

Click or paste: `http://localhost:4173`

**You should see:**
- Code Sensei header
- Input field for API key (if not already in .env)
- Code editor on the left
- AI Analysis panel on the right

---

## ✅ Testing It Works

### Test 1: API Key Acceptance
1. Click "Change API Key" button
2. Paste your API key
3. Click "Submit"
4. Should show code editor (no error message)

### Test 2: Code Review
1. Select "JavaScript" language
2. Paste this code:
```javascript
function add(a, b) {
  return a + b;
}
```
3. Click "Review Code"
4. Wait for AI response
5. Should see analysis on right panel

### Test 3: Code Fixing
1. Paste this buggy code:
```javascript
function buggy() {
  let x = 5
  if (x > 3) {
    console.log("yes")
  }
}
```
2. Click "Fix Code"
3. Should see corrected version in editor

---

## 🔑 All Environment Setup Options

### Option A: .env File (Recommended)
```bash
# Create .env in project root
VITE_GOOGLE_GENAI_API_KEY=your_key
```
- ✅ App auto-loads key on startup
- ✅ Don't have to enter manually each time
- ⚠️ Don't commit to Git

### Option B: Runtime Entry
```
→ Click "Change API Key" button
→ Paste key and submit
→ Saved in browser for session
```
- ✅ Useful for testing
- ✅ No .env file needed
- ❌ Need to enter each time browser closes

### Option C: Both
- ✅ Use .env for auto-load
- ✅ Can change via button if needed
- ✅ Most flexible

---

## 📱 Running on Different Ports

Default port is `4173`. If that's in use:

**Option 1: Change in vite.config.js**
```javascript
server: {
  port: 3000  // Use port 3000 instead
}
```

**Option 2: Pass on command line**
```bash
npm run dev -- --port 3000
```

---

## 🛠️ Troubleshooting Setup

### Issue: "npm: command not found"
**Solution:**
- Node.js not installed
- Download from https://nodejs.org (LTS version)
- Restart terminal after installing

### Issue: "Port 4173 already in use"
**Solution:**
```bash
# Kill process using port 4173
# Windows:
netstat -ano | findstr :4173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:4173 | xargs kill -9
```
Or just change the port (see section above)

### Issue: "Module not found" errors
**Solution:**
```bash
rm -rf node_modules
npm cache clean --force
npm install
npm run dev
```

### Issue: API key not loading
**Checklist:**
1. `.env` file exists in root? ✓
2. Correct filename `.env` (not .env.txt)? ✓
3. Correct format `VITE_GOOGLE_GENAI_API_KEY=key`? ✓
4. Dev server restarted after creating .env? ✓
5. No spaces before/after `=`? ✓

### Issue: "AI request failed" errors
**Solutions:**
1. Check API key is correct
2. Enable API in Google Cloud Console
3. Check browser console (F12) for details
4. Verify internet connection
5. Try a different code snippet

---

## 🔍 Verify Installation

### Check Node.js
```bash
node -v
# Should show v16 or higher
```

### Check npm
```bash
npm -v
# Should show v8 or higher
```

### Check Project Structure
```bash
ls -la
# Should show: package.json, vite.config.js, src/, public/
```

### Check Dependencies
```bash
npm list | head -20
# Should show react, vite, @google/generative-ai, etc.
```

---

## 📊 Project Verification

After setup, verify everything with this checklist:

- [ ] Node.js v16+ installed
- [ ] npm v8+ installed
- [ ] `.env` file created with API key
- [ ] `npm install` completed successfully
- [ ] No error messages during install
- [ ] `npm run dev` starts successfully
- [ ] Browser opens to http://localhost:4173
- [ ] App loads without errors (check F12 console)
- [ ] "Change API Key" button works
- [ ] Test code review works
- [ ] Test code fix works

If all checked ✓, you're ready to go!

---

## 🚀 Next Steps

### Start Using Code Sensei:
1. **Select Language** - Choose from 20+ programming languages
2. **Paste Code** - Drop your code in the editor
3. **Review** - Get AI-powered analysis
4. **Fix** - Get automatic fixes
5. **Learn** - Understand improvements

### For Production:
```bash
npm run build
# Creates optimized 'dist' folder for deployment
```

### Share with Team:
1. Deploy to Vercel, Netlify, or your server
2. Each user needs their own API key
3. Or setup backend API for shared keys

---

## 💡 Tips & Tricks

### Faster Setup
```bash
npm install --legacy-peer-deps
```
Use if you hit dependency conflicts

### Multiple Projects
Keep separate `.env` files for each project

### Debugging
Press F12 to open browser console for errors

### Performance
- Use `gemini-1.5-flash` (default) for speed
- Free tier has rate limits
- Upgrade plan removes limits

### API Keys
- Create multiple keys for dev/prod/testing
- Rotate keys periodically
- Never hardcode in source code

---

## 📚 Resources

- **Google Gemini API:** https://aistudio.google.com
- **API Documentation:** https://ai.google.dev
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Tailwind CSS:** https://tailwindcss.com

---

## 🎯 Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm lint

# Clean install
npm cache clean --force && npm install
```

---

## ✨ All Set!

You're now ready to use Code Sensei!

**Enjoy your AI-powered code reviewing! 🧠✨**

---

*Last Updated: April 2025*  
*Version: 2.0.0*

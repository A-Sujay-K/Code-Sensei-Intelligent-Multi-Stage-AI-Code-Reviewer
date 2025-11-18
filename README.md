# 🧠 Code Sensei - AI-Powered Code Reviewer

**Version:** 2.0.0 (Updated & Debugged)  
**Status:** ✅ Fully Fixed and Ready to Use

---

## 📋 What's Been Fixed

This is a completely debugged and updated version of the 1-year-old Code Sensei project.

### Issues Fixed:
✅ **Invalid import statement** - Line 9 had broken syntax  
✅ **Wrong API package** - Updated from `@google/genai` to `@google/generative-ai`  
✅ **Incorrect API class** - Changed `GoogleGenAI` to `GoogleGenerativeAI`  
✅ **Model compatibility** - Updated to `gemini-1.5-flash` (more stable)  
✅ **Dependencies** - Updated all packages to latest compatible versions  
✅ **Vite config** - Fixed package references in build config  
✅ **Package.json** - Added version 2.0.0, removed unused dependencies  
✅ **Git config** - Improved .gitignore with comprehensive patterns  

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+
- Google Gemini API key (free)

### Step 1: Get Your API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy your key (looks like: `AIzaSy...`)

### Step 2: Setup Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env and paste your API key
# VITE_GOOGLE_GENAI_API_KEY=your_key_here
```

### Step 3: Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:4173`

### Step 4: Build for Production

```bash
npm run build
npm run preview
```

---

## 📊 What It Does

**Code Sensei** is an AI-powered code review and fixing tool that:

✨ **Reviews Code** - Deep analysis using Gemini AI
- Quality rating (Better, Good, Normal, Bad)
- Detailed improvement suggestions
- Bug and logical error detection
- Step-by-step explanation

🔧 **Fixes Code** - Automatic code correction
- Syntax error fixing
- Quality improvements
- Best practices application
- Maintains original functionality

🌍 **Supports 20+ Languages:**
JavaScript, Python, Java, C#, C++, PHP, Ruby, Go, Swift, Kotlin, TypeScript, Rust, Dart, Scala, Perl, Haskell, Elixir, R, MATLAB, Bash

---

## 🛠️ Technology Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, Vite 6 |
| **Editor** | Monaco Editor 0.52 |
| **AI** | Google Gemini API (gemini-1.5-flash) |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Lucide Icons, React Select, React Markdown |
| **Code Highlighting** | Rehype Highlight |

---

## 📦 Project Structure

```
AI-Code-Reviewer-FIXED/
├── src/
│   ├── App.jsx              # Main app component (FIXED)
│   ├── App.css              # Styling
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   └── components/
│       └── Navbar.jsx       # Navigation bar
├── public/
│   └── vite.svg
├── index.html               # HTML template
├── package.json             # Dependencies (UPDATED)
├── vite.config.js           # Vite config (FIXED)
├── eslint.config.js         # Linting rules
├── .env.example             # Environment template
├── .gitignore               # Git ignore (UPDATED)
└── README.md                # This file
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Google Generative AI API Key
# Get from: https://aistudio.google.com/app/apikey
VITE_GOOGLE_GENAI_API_KEY=your_api_key_here
```

**⚠️ Important:**
- Never commit `.env` file to version control
- Never share your API key
- Use different keys for dev/prod if needed

---

## 📝 API Usage

### Free Tier Limits
- **Requests/minute:** 50 RPM
- **Daily limit:** Applies
- **Cost:** Free
- **Best for:** Testing, learning, light usage

### Paid Plan
- **Requests/minute:** Unlimited
- **Cost:** $0.075 per 1M input tokens
- **Best for:** Production, frequent use

Upgrade at: https://console.cloud.google.com/billing

---

## 🐛 Troubleshooting

### Error: "Failed to get response from AI service"

**Solutions:**
1. Check API key is correct and pasted without spaces
2. Verify API is enabled: https://console.cloud.google.com
3. Check browser console (F12) for detailed errors
4. Ensure `.env` file exists and is read (restart dev server)

### Error: "Quota exceeded"

**Solutions:**
1. **Free tier?** Wait until next day (quota resets at midnight UTC)
2. **Upgrade plan** at https://console.cloud.google.com/billing
3. **Create new API key** in different project for fresh quota

### Port 4173 already in use

Change the port in `vite.config.js`:
```javascript
server: {
  port: 3000  // Change to any available port
}
```

### Dependencies not installing

Try:
```bash
npm install --legacy-peer-deps
# OR
npm cache clean --force
npm install
```

---

## 📖 Usage Guide

### Reviewing Code

1. Select programming language from dropdown
2. Paste your code in the left editor
3. Click **"Review Code"** button
4. Read detailed AI analysis on the right

### Fixing Code

1. Paste buggy/inefficient code
2. Click **"Fix Code"** button
3. Fixed version appears in editor
4. Review changes and copy if satisfied

### Error Indicators

Red badge shows detected syntax/style issues:
- Click to see issue details
- Markers appear in editor
- Hover for more information

### Changing API Key

Click **"Change API Key"** button:
- Enter new key
- Click Submit
- Key saves to browser (localStorage)

---

## 🔄 Update History

**v2.0.0 (Current - Fully Fixed)**
- ✅ Updated to `@google/generative-ai` (official package)
- ✅ Fixed all API initialization issues
- ✅ Updated all dependencies to latest versions
- ✅ Model: `gemini-1.5-flash` (stable, fast)
- ✅ Removed broken imports and syntax errors
- ✅ Updated Vite and Tailwind configurations

**v1.0.0 (Original - 1 year old)**
- ❌ Used `@google/genai` (outdated)
- ❌ Had syntax errors
- ❌ Outdated dependencies
- ❌ Broken API initialization

---

## 🚦 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy the 'dist' folder to Vercel
```

### GitHub Pages

Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/repository-name/',
  // ... rest of config
})
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 📞 Support

### Getting Help

1. **Browser console** - F12, check Console tab for errors
2. **Network tab** - F12 > Network, check API responses
3. **Check .env** - Ensure API key is set correctly
4. **Verify API** - Enable in Google Cloud Console

### Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| App won't start | Run `npm install` and restart |
| API key invalid | Copy fresh from AI Studio, check for spaces |
| Quota exceeded | Upgrade plan or wait for reset |
| Port in use | Change port in `vite.config.js` |
| Slow responses | Free tier throttled, upgrade for speed |

---

## 📜 License

This project is provided as-is for educational and commercial use.

---

## 🎯 Future Enhancements

Potential improvements:
- 🔄 Support for more AI models
- 💾 Code history/version tracking
- 🔐 Backend API for security
- 📊 Analytics dashboard
- 🌐 Multi-language UI
- 📱 Mobile app version

---

## ✅ Verification Checklist

Before using, verify:

- [ ] Node.js 16+ installed (`node -v`)
- [ ] npm 8+ installed (`npm -v`)
- [ ] `.env` file created with API key
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] App opens at http://localhost:4173
- [ ] API key works (test with "Review Code")

---

## 🎉 You're All Set!

The project is now fully debugged and ready to use.

### Next Steps:
1. Create `.env` with your API key
2. Run `npm install`
3. Start with `npm run dev`
4. Try reviewing some code!

**Happy coding! 🚀**

---

*Last Updated: April 2025*  
*Version: 2.0.0 - Fully Debugged & Updated*

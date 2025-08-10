# API Key Setup Guide - Code Sensei

## Issue Fixed

**The Problem:** Line 9 of `src/App.jsx` contained an invalid import statement:
```javascript
import.meta.env.VITE_GOOGLE_GENAI_API_KEY
```

This is invalid JavaScript syntax and was preventing the app from initializing properly, causing "API key invalid" errors.

**The Solution:** This line has been removed. The environment variable is correctly accessed on line 158:
```javascript
const DEFAULT_API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY || "";
```

---

## How to Setup Your API Key

### Step 1: Get Your Google GenAI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"** button
3. Select your project (or create a new one)
4. Copy your API key

### Step 2: Configure the Environment Variable

You have **two options**:

#### Option A: Using `.env` file (Recommended for Development)

1. Create a `.env` file in the root directory (same level as `package.json`)
2. Add the following line:
   ```
   VITE_GOOGLE_GENAI_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key
4. Save the file

Example `.env` file:
```
VITE_GOOGLE_GENAI_API_KEY=AIzaSyDjdj28djajdj28djajdj28djajdj28dja
```

#### Option B: Enter Key in App (Runtime)

If you don't want to use a `.env` file:
1. Start the app
2. The app will prompt you to enter your API key
3. Paste your API key in the input field
4. Click "Submit"
5. The key will be saved in your browser's localStorage

### Step 3: Restart the Development Server

If you used Option A (`.env` file):

```bash
# Kill the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

The environment variable will now be loaded automatically.

---

## Testing Your Setup

1. Start the app: `npm run dev`
2. If using `.env` file, the API key input should be hidden and the app should be ready to use
3. Paste some code into the editor
4. Click "Review Code" button
5. Wait for the AI response

If you see:
- ✅ **AI analysis appears** → Your setup is correct!
- ❌ **"API key invalid" error** → Your API key is wrong or not properly configured

---

## Troubleshooting

### Issue: "Please enter your Google GenAI API key first"

**Causes & Solutions:**
- [ ] No `.env` file created → Create one with your API key
- [ ] API key is empty or wrong → Check your `.env` file or re-enter in the app
- [ ] Dev server not restarted after creating `.env` → Restart with `npm run dev`

### Issue: "Failed to initialize AI service"

**Causes & Solutions:**
- [ ] Invalid API key format → Double-check your key on [AI Studio](https://aistudio.google.com/app/apikey)
- [ ] API key doesn't have proper permissions → Regenerate a new key
- [ ] Network connectivity issue → Check your internet connection

### Issue: Environment variable not loading

**Solutions:**
1. Verify `.env` file is in the root directory (not in `src/` or other folders)
2. Verify the exact filename is `.env` (not `.env.local` or `.env.example`)
3. Make sure the line format is: `VITE_GOOGLE_GENAI_API_KEY=your_key`
4. Restart the dev server after saving the `.env` file

---

## Files Changed

- ✅ **src/App.jsx** - Removed invalid import statement on line 9
- ✅ **.env.example** - Created as a template for users

---

## Important Notes

- ⚠️ Never commit your `.env` file to version control (it should be in `.gitignore`)
- ⚠️ Never share your API key publicly
- ⚠️ API key stored in browser localStorage is accessible to anyone with access to your browser
- ⚠️ For production, consider using a backend server to securely handle API calls

---

## Next Steps

1. Create your `.env` file with your API key
2. Restart the development server
3. Start using Code Sensei to review and fix your code!

**Happy Coding! 🚀**

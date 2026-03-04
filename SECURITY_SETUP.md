# Security Setup Guide

## 🔒 API Key Security

### ✅ What's Been Done
- Removed all actual API keys from `.env`
- Created `.env.example` as a template
- `.env` is properly ignored by Git (see `.gitignore`)

### 🛠️ Next Steps for You

1. **Get Your API Keys:**
   - [Pixabay](https://pixabay.com/api/docs/)
   - [Unsplash](https://unsplash.com/developers)
   - [Google Cloud Console](https://console.cloud.google.com/)
   - [NASA API](https://api.nasa.gov/)

2. **Update Your Local `.env`:**
   ```bash
   # Replace the placeholder values with your actual keys
   VITE_PIXABAY_KEY=your_real_pixabay_key
   VITE_UNSPLASH_KEY=your_real_unsplash_key
   VITE_GOOGLE_API_KEY=your_real_google_key
   VITE_GOOGLE_CX=your_real_google_cx
   VITE_NASA_API_KEY=your_real_nasa_key
   ```

3. **For Production Deployment:**
   - Set environment variables in your hosting platform
   - Vercel: Project Settings → Environment Variables
   - Docker: Use secrets or runtime environment variables
   - Never commit real keys to the repository

### 🚨 Security Best Practices

- ✅ `.env` is in `.gitignore`
- ✅ Keys are prefixed with `VITE_` for Vite
- ✅ Created `.env.example` for team reference
- ✅ No hardcoded keys in source code

### 🔍 Verification

Check that keys are working:
```javascript
console.log(import.meta.env.VITE_PIXABAY_KEY); // Should show your key
```

**Never share your `.env` file or commit API keys to version control!**

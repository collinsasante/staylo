# 🚀 Quick Start Guide - Get Your Admin Panel Running

## Current Status: ✅ Code is Ready, ⚠️ Configuration Needed

All admin pages are updated with real API calls. You just need to add your Firebase and Cloudinary credentials.

---

## 🔧 What You'll See Right Now

If you visit `http://localhost:3000/admin/login` right now, you'll see:

**Error in Console:**
```
Firebase: Error (auth/invalid-api-key)
```

**Why?** The `.env.local` file doesn't exist yet with your credentials.

---

## ⚡ 3-Step Setup (30 minutes)

### **Step 1: Create Firebase Project** (15 min)

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Click "Add project"

2. **Name your project:**
   ```
   Project name: staylo-hostels
   ```
   - Disable Google Analytics (optional)
   - Click "Create project"

3. **Enable Firestore Database:**
   - Left sidebar → "Build" → "Firestore Database"
   - Click "Create database"
   - Select: "Start in production mode"
   - Location: `europe-west` (closest to Ghana)
   - Click "Enable"

4. **Set Firestore Security Rules:**
   - Click "Rules" tab
   - Replace content with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Hostels - read for all, write for authenticated users
       match /hostels/{hostelId} {
         allow read: if true;
         allow write: if request.auth != null;
       }

       // Inquiries - create for all, read/update for authenticated users
       match /inquiries/{inquiryId} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
     }
   }
   ```
   - Click "Publish"

5. **Enable Authentication:**
   - Left sidebar → "Build" → "Authentication"
   - Click "Get started"
   - Click "Email/Password"
   - Toggle to enable, click "Save"

6. **Create Admin User:**
   - Click "Users" tab
   - Click "Add user"
   - Email: `admin@staylo.com`
   - Password: `YourSecurePassword123!` (choose your own)
   - Click "Add user"
   - ⚠️ **SAVE THIS PASSWORD!** You'll need it to login

7. **Get Firebase Config:**
   - Click ⚙️ (Settings icon) → "Project settings"
   - Scroll to "Your apps"
   - Click `</>` (Web icon)
   - App nickname: "Staylo Admin"
   - Click "Register app"
   - Copy the `firebaseConfig` values

---

### **Step 2: Create Cloudinary Account** (5 min)

1. **Sign Up:**
   - Visit: https://cloudinary.com/
   - Click "Sign up for free"
   - Fill in your details
   - Verify email

2. **Get Credentials:**
   - After login, you'll see your Dashboard
   - Look for:
     - **Cloud Name** (displayed at top)
     - **API Key** (below Cloud Name)
     - **API Secret** (click "Reveal" to see it)
   - Copy these values

---

### **Step 3: Configure Environment** (2 min)

1. **Create `.env.local` file:**
   ```bash
   cd /Users/breezyyy/Downloads/hostel-nextjs
   cp .env.example .env.local
   ```

2. **Open `.env.local` and replace with your values:**
   ```env
   # Firebase Configuration (from Step 1.7)
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=staylo-hostels.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=staylo-hostels
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=staylo-hostels.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

   # Cloudinary Configuration (from Step 2.2)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abc123def456ghi789

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Save the file**

4. **Restart the dev server:**
   - Stop the server (Ctrl+C)
   - Start again:
   ```bash
   npm run dev
   ```

---

## 🎯 Test Everything (5 min)

### 1. Test Login
```
http://localhost:3000/admin/login
```
- Email: `admin@staylo.com`
- Password: (the one you created in Step 1.6)
- Click "Sign In"
- ✅ Should redirect to dashboard

### 2. Test Dashboard
```
http://localhost:3000/admin
```
- ✅ Should load without errors
- Stats will show 0 (no data yet)

### 3. Test Add Hostel
```
http://localhost:3000/admin/hostels/new
```
- Fill in all fields:
  - Name: "Test Hostel"
  - Location: "Accra"
  - Price: 1000
  - Description: "Test description"
  - Select some amenities
  - Owner: "John Doe"
  - Contact: "+233 24 123 4567"
- Upload 2-3 test images
- Click "Add Hostel"
- ✅ Should show success and redirect

### 4. Verify in Firebase
- Go to Firebase Console → Firestore
- You should see:
  - `hostels` collection with 1 document
  - The document has all your data

### 5. Verify in Cloudinary
- Go to Cloudinary Dashboard → Media Library
- You should see your uploaded images in `/hostels` folder

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
**Fix:** Check that `.env.local` exists and has correct values from Firebase

### Error: "Module not found: Can't resolve '../lib/auth'"
**Fix:** Already fixed! Just refresh the page

### Error: "Permission denied" on Firestore
**Fix:** Check Firestore Security Rules (Step 1.4 above)

### Error: "Upload failed"
**Fix:**
- Check Cloudinary credentials in `.env.local`
- Make sure file is under 5MB
- Make sure file is PNG/JPG/WEBP

### Can't Login
**Fix:**
- Check user exists in Firebase Authentication
- Check email/password are correct
- Look at browser console for specific error

---

## 📊 What Works After Setup

| Feature | Status |
|---------|--------|
| ✅ Login with Firebase | Working |
| ✅ Dashboard stats | Working |
| ✅ List hostels | Working |
| ✅ Add hostel + images | Working |
| ✅ Delete hostel | Working |
| ✅ List inquiries | Working |
| ✅ Update inquiry status | Working |
| ✅ CSV export | Working |
| ✅ Logout | Working |

---

## 🎉 You're Done!

After completing the 3 steps above:
1. ✅ Login works with Firebase
2. ✅ Dashboard shows real data
3. ✅ Can add hostels with images
4. ✅ Images upload to Cloudinary
5. ✅ All CRUD operations work

---

## 📝 Next Steps (Optional)

### Add Sample Data
1. Add 3-5 hostels with different statuses
2. Add some test inquiries manually to Firestore
3. Verify dashboard stats update

### Test All Features
- Filter hostels by status
- Search hostels by name
- Change inquiry status
- Export inquiries to CSV
- Delete a hostel

### Deploy to Production
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Add environment variables
4. Deploy!

---

## 🆘 Need Help?

**Common Issues:**
1. **Forgot admin password?** Reset in Firebase Console → Authentication → Users
2. **Wrong credentials in .env.local?** Double-check Firebase config
3. **Cloudinary not working?** Verify API Secret is correct

**Check These:**
- `.env.local` file exists
- Dev server restarted after creating `.env.local`
- All credentials copied correctly (no spaces)

---

## 📚 Documentation

- **Full setup:** [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)
- **API integration:** [ADMIN_API_INTEGRATION.md](ADMIN_API_INTEGRATION.md)
- **Admin features:** [ADMIN_PANEL_README.md](ADMIN_PANEL_README.md)

---

**Time to Complete:** ~30 minutes
**Difficulty:** Easy (just copy/paste credentials)
**Result:** Fully working admin panel! 🚀

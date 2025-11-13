# Staylo - Production Setup Guide

## 🚀 Complete Production Implementation

All production-ready features have been implemented! Follow this guide to deploy Staylo.

---

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Firebase Account** (free tier works)
3. **Git** (for deployment)

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `staylo-hostels` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore Database

1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location (closest to your users)
5. Click "Enable"

### Step 3: Set Firestore Security Rules
 
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Hostels collection - read for all, write for admin only
    match /hostels/{hostelId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Inquiries collection - create for all, read/update for admin only
    match /inquiries/{inquiryId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### Step 4: Enable Firebase Storage

1. Go to "Build" → "Storage"
2. Click "Get started"
3. Start in production mode
4. Set Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /hostels/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 5: Enable Authentication

1. Go to "Build" → "Authentication"
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Create admin user:
   - Click "Users" tab
   - Click "Add user"
   - Email: `admin@staylo.com`
   - Password: (choose a strong password)
   - Click "Add user"

### Step 6: Get Firebase Config

1. Go to Project Settings (⚙️ icon)
2. Scroll to "Your apps"
3. Click web icon (</>) to add a web app
4. Register app name: "Staylo Admin"
5. Copy the `firebaseConfig` object

---

## ⚙️ Environment Setup

### Step 1: Install Dependencies

```bash
cd /Users/breezyyy/Downloads/hostel-nextjs
npm install
```

This will install:
- `firebase` - Firebase SDK
- `formidable` - File upload handling
- All TypeScript types

### Step 2: Create Environment File

```bash
cp .env.example .env.local
```

### Step 3: Configure Environment Variables

Edit `.env.local` and add your Firebase config:

```env
# Firebase Configuration (from step 6 above)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=staylo-hostels.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=staylo-hostels
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=staylo-hostels.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Never commit `.env.local` to Git!

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Visit:
- Main site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`
- Admin dashboard: `http://localhost:3000/admin`

### Production Build

```bash
npm run build
npm start
```

---

## 🔐 Authentication

### Admin Login

**Credentials:**
- Email: `admin@staylo.com` (or the email you created in Firebase)
- Password: (the password you set in Firebase)

### How It Works

1. User enters email/password
2. Firebase Authentication verifies credentials
3. On success, user gets auth token
4. Token is used for API requests
5. Protected routes check for valid token

---

## 📊 Database Structure

### Hostels Collection

```javascript
hostels/{hostelId}
├── id: string
├── name: string
├── location: string
├── price: number
├── description: string
├── amenities: string[]
├── ownerName: string
├── ownerContact: string
├── ownerEmail?: string
├── status: 'active' | 'unavailable' | 'featured'
├── images: string[] // Firebase Storage URLs
├── views: number
├── createdAt: string (ISO 8601)
└── updatedAt: string (ISO 8601)
```

### Inquiries Collection

```javascript
inquiries/{inquiryId}
├── id: string
├── studentName: string
├── email: string
├── phone: string
├── hostelInterested: string
├── message: string
├── status: 'unread' | 'read' | 'contacted'
├── date: string (ISO 8601)
├── createdAt: string (ISO 8601)
└── updatedAt: string (ISO 8601)
```

---

## 🌐 API Endpoints

### Hostels

```
GET    /api/hostels           - Get all hostels
GET    /api/hostels?status=active - Filter by status
POST   /api/hostels           - Create hostel
GET    /api/hostels/[id]      - Get single hostel
PUT    /api/hostels/[id]      - Update hostel
DELETE /api/hostels/[id]      - Delete hostel
```

### Inquiries

```
GET    /api/inquiries         - Get all inquiries
GET    /api/inquiries?status=unread - Filter by status
POST   /api/inquiries         - Create inquiry
GET    /api/inquiries/[id]    - Get single inquiry
PUT    /api/inquiries/[id]    - Update inquiry status
DELETE /api/inquiries/[id]    - Delete inquiry
```

### Stats

```
GET    /api/stats             - Get dashboard statistics
```

### Upload

```
POST   /api/upload            - Upload images
```

---

## 📱 Testing the Application

### 1. Test Admin Login

```bash
# Visit
http://localhost:3000/admin/login

# Login with Firebase credentials
Email: admin@staylo.com
Password: [your password]
```

### 2. Test Adding a Hostel

1. Go to `/admin/hostels/new`
2. Fill in all fields
3. Upload 2-3 images
4. Click "Add Hostel"
5. Check Firestore console to see new document

### 3. Test Inquiry Submission

Create a contact form on your public site that POSTs to:

```javascript
fetch('/api/inquiries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentName: 'John Doe',
    email: 'john@example.com',
    phone: '+233241234567',
    hostelInterested: 'Sunrise Hostel',
    message: 'I would like more information...'
  })
})
```

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set Environment Variables**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Deploy Production**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Build**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Set Environment Variables** in Netlify dashboard

---

## 📊 Monitoring & Notifications

### Slack Notifications (Optional)

1. Create Slack webhook URL
2. Add to `.env.local`:
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

3. Update `/lib/db.ts` to send notifications:

```typescript
// In createInquiry function
if (process.env.SLACK_WEBHOOK_URL) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: `New inquiry from ${data.studentName} for ${data.hostelInterested}`
    })
  });
}
```

### Better Stack (Optional)

1. Sign up at [BetterStack](https://betterstack.com/)
2. Get API key
3. Add to `.env.local`:
```env
BETTER_STACK_API_KEY=your-api-key
```

---

## 🔒 Security Checklist

- [ ] Firebase Security Rules configured
- [ ] Environment variables in `.env.local` (not committed)
- [ ] Admin user created in Firebase
- [ ] CORS configured in API routes
- [ ] File upload size limits set (5MB)
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] HTTPS enabled in production

---

## 📈 Performance Optimization

### Image Optimization

```javascript
// Already implemented in storage.ts
- Max file size: 5MB
- Automatic WebP conversion (browser-dependent)
- Unique filenames with timestamps
```

### Database Optimization

```javascript
// Already implemented in db.ts
- Indexed queries (orderBy)
- Pagination ready (limit parameter)
- Efficient data fetching
```

---

## 🐛 Troubleshooting

### "Firebase not initialized"

**Solution:** Check that all environment variables are set correctly in `.env.local`

### "Permission denied" on Firestore

**Solution:** Update Firestore Security Rules (see Step 3 above)

### "Upload failed"

**Solution:**
1. Check Storage Rules
2. Verify file size < 5MB
3. Check file format (PNG, JPG, WEBP only)

### "Admin login not working"

**Solution:**
1. Verify user exists in Firebase Authentication
2. Check email/password are correct
3. Look for errors in browser console

---

## 📚 File Structure

```
hostel-nextjs/
├── components/admin/        # Admin components
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   ├── useHostels.ts       # Hostels data hook
│   └── useInquiries.ts     # Inquiries data hook
├── lib/                     # Utilities
│   ├── firebase.ts         # Firebase config
│   ├── db.ts               # Firestore operations
│   ├── storage.ts          # File upload
│   ├── auth.ts             # Authentication
│   └── middleware.ts       # API middleware
├── pages/                   # Next.js pages
│   ├── admin/              # Admin pages
│   └── api/                # API routes
├── types/                   # TypeScript types
├── styles/                  # CSS files
├── .env.example            # Environment template
├── .env.local              # Your config (gitignored)
└── package.json            # Dependencies
```

---

## 🎯 Next Steps

### Phase 1: Basic Setup ✅
- [x] Firebase configuration
- [x] Database models
- [x] API routes
- [x] Authentication
- [x] Image upload

### Phase 2: Features ✅
- [x] Dashboard with stats
- [x] Hostel management
- [x] Inquiry management
- [x] Real-time data
- [x] File uploads

### Phase 3: Production (Now)
- [ ] Deploy to Vercel/Netlify
- [ ] Configure custom domain
- [ ] Set up SSL
- [ ] Add analytics
- [ ] Add notifications

### Phase 4: Enhancements (Future)
- [ ] Email templates
- [ ] SMS notifications
- [ ] Payment integration
- [ ] Student dashboard
- [ ] Review system

---

## 📞 Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console logs
3. Check API response in Network tab
4. Verify environment variables

---

## ✅ Pre-Launch Checklist

- [ ] All environment variables set
- [ ] Firebase project created
- [ ] Admin user created
- [ ] Security rules configured
- [ ] Test adding hostel
- [ ] Test inquiry submission
- [ ] Test image upload
- [ ] Test on mobile device
- [ ] Run production build
- [ ] Deploy to hosting

---

**You're ready for production!** 🎉

All features are implemented and ready to use. Just configure Firebase and deploy!

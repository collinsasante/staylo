# 🔥 Firestore Security Rules Setup

## Problem
You're getting `PERMISSION_DENIED` errors because Firestore security rules are blocking database operations.

## Solution: Update Firestore Security Rules

### Step 1: Go to Firestore Rules
1. Open Firebase Console: https://console.firebase.google.com/project/staylo-hostels-96cae/firestore/rules
2. You'll see the "Rules" tab

### Step 2: Replace Existing Rules

**For Development (Open Access):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes (DEVELOPMENT ONLY)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**For Production (Secure Access):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Hostels collection - Public read, authenticated write
    match /hostels/{hostelId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Inquiries collection - Anyone can create, authenticated can read/update
    match /inquiries/{inquiryId} {
      allow read, update, delete: if request.auth != null;
      allow create: if true; // Allow public inquiries
    }

    // Admin-only collections
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 3: Publish Rules
1. Click "Publish" button
2. Wait for confirmation message
3. Try creating a hostel again

---

## Why This Error Happened

Firestore uses security rules to protect your data. By default, Firebase creates **restrictive rules** that block all access. You need to update them to allow:
- Public reads for hostels (so users can browse)
- Authenticated writes (so admins can add/edit)
- Public inquiry creation (so students can submit inquiries)

---

## Quick Fix (Development Only)

If you want to get started quickly, use the **Development Rules** above which allow all operations. This is fine for testing but **NOT for production**.

---

## Testing After Update

After updating rules, try these operations:
1. ✅ Create a new hostel from admin panel
2. ✅ View hostels on the public site
3. ✅ Submit an inquiry
4. ✅ View inquiries in admin panel

All should work without `PERMISSION_DENIED` errors!

---

**Note:** You can also check Firestore activity in Firebase Console:
https://console.firebase.google.com/project/staylo-hostels-96cae/firestore/data

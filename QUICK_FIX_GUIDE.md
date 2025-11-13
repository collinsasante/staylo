# 🚨 QUICK FIX: Permission Denied Error

## The Problem
You're seeing: `Error: 7 PERMISSION_DENIED: Missing or insufficient permissions`

This is because Firestore's security rules are blocking your database operations.

---

## The Solution (5 minutes)

### Step 1: Open Firestore Rules
**Direct link:** https://console.firebase.google.com/project/staylo-hostels-96cae/firestore/rules

### Step 2: Copy This Code
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 3: Replace & Publish
1. Select all existing text in the editor
2. Delete it
3. Paste the code above
4. Click **"Publish"** button (top right)
5. Wait for "Rules published" confirmation

### Step 4: Try Again
1. Go back to your admin panel: http://localhost:3000/admin/hostels/new
2. Try creating a hostel again
3. It should work now! ✅

---

## Why This Works

The rule `allow read, write: if true;` temporarily allows all operations on your database. This is **perfect for development** but you'll want to secure it later for production.

---

## Alternative: More Secure Rules (Recommended)

If you want to keep some security even in development:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public can read hostels, authenticated can write
    match /hostels/{hostelId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Anyone can create inquiry, authenticated can manage
    match /inquiries/{inquiryId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

This allows:
- ✅ Anyone to view hostels (public site)
- ✅ Logged-in admins to create/edit hostels
- ✅ Anyone to submit inquiries (contact form)
- ✅ Logged-in admins to manage inquiries

---

## After You Fix This

Once rules are updated, you'll be able to:
1. ✅ Create hostels from admin panel
2. ✅ Upload images to Cloudinary
3. ✅ View hostels on public site
4. ✅ Submit and manage inquiries
5. ✅ Get email notifications via Resend

Your admin platform will be fully functional! 🎉

---

## Need Help?

If you still see errors after updating rules:
1. Make sure you clicked "Publish" (not just save)
2. Wait 10 seconds for rules to propagate
3. Hard refresh your browser (Cmd+Shift+R on Mac)
4. Try the operation again

The rules file is also saved locally at: `firestore.rules` for reference.

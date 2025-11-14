# Cloudflare Pages Deployment Checklist

## Quick Start Guide

### ✅ Prerequisites (Complete)
- [x] Git repository pushed to GitHub
- [x] Next.js configured for Cloudflare
- [x] Build scripts added
- [x] Wrangler configuration created

### 📋 Deployment Steps

#### 1. Go to Cloudflare Dashboard
🔗 https://dash.cloudflare.com/

#### 2. Create New Pages Project
- Click: **Workers & Pages** → **Create application** → **Pages**
- Select: **Connect to Git**
- Choose repository: `collinsasante/staylo`

#### 3. Configure Build Settings
```
Production branch: main
Build command: npm run pages:build
Build output directory: .vercel/output/static
Root directory: (leave empty)
Node.js version: 18 or higher
```

#### 4. Add Environment Variables

Copy these from your `.env.local` file:

**Firebase (Public - Client-side):**
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

**Cloudinary (Secret - Server-side):**
```
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

**Email (Secret - Server-side):**
```
RESEND_API_KEY
```

#### 5. Deploy
Click **Save and Deploy** and wait 2-5 minutes

#### 6. Post-Deployment Configuration

**A. Firebase Console**
1. Go to: https://console.firebase.google.com/
2. Select your project
3. Go to: **Authentication** → **Settings** → **Authorized domains**
4. Add: `your-app.pages.dev` (your Cloudflare URL)

**B. Cloudinary Console**
1. Go to: https://console.cloudinary.com/
2. Navigate to: **Settings** → **Security**
3. Add your Cloudflare domain to **Allowed fetch domains**

#### 7. Test Your Deployment
- [ ] Visit your Cloudflare Pages URL
- [ ] Test homepage loads
- [ ] Test admin login at `/admin/login`
- [ ] Test image uploads
- [ ] Test news creation
- [ ] Test hostel creation

---

## Your URLs

After deployment, you'll have:

**Production URL:**
`https://staylo-hostel.pages.dev`

**Admin Panel:**
`https://staylo-hostel.pages.dev/admin`

**Preview URLs:**
Every PR will get: `https://<branch-name>.staylo-hostel.pages.dev`

---

## Common Issues & Solutions

### Build Fails
✅ Check Node.js version is 18+
✅ Verify all dependencies are in package.json
✅ Check build logs for specific errors

### Environment Variables Not Working
✅ Redeploy after adding variables
✅ Use `NEXT_PUBLIC_` prefix for client-side vars
✅ Check spelling and formatting

### Firebase Auth Not Working
✅ Add Cloudflare domain to Firebase authorized domains
✅ Verify all Firebase environment variables
✅ Check Firebase console for error logs

### Images Not Uploading
✅ Check Cloudinary credentials
✅ Verify CORS settings
✅ Check file size limits

---

## Performance Expectations

With Cloudflare Pages, you get:
- ⚡ **Global CDN** - Sub-100ms response times worldwide
- 🔒 **Automatic HTTPS** - Free SSL certificates
- 🛡️ **DDoS Protection** - Built-in security
- 📊 **Analytics** - Real-time traffic insights
- 🔄 **Auto Deployments** - Push to deploy

---

## Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Add your own domain in Cloudflare Pages settings
   - Update Firebase and Cloudinary with new domain

2. **Monitoring**
   - Set up Cloudflare Analytics
   - Monitor build history
   - Check error logs regularly

3. **Optimize**
   - Review Core Web Vitals
   - Optimize images via Cloudinary
   - Enable Cloudflare caching

4. **Backup**
   - Firestore automatic backups
   - Export Cloudinary media periodically
   - Keep .env.local secure locally

---

## Support Resources

- 📖 Full Guide: See `DEPLOYMENT.md`
- 🌐 Cloudflare Docs: https://developers.cloudflare.com/pages/
- 🔥 Firebase Docs: https://firebase.google.com/docs
- ☁️ Cloudinary Docs: https://cloudinary.com/documentation

---

## Emergency Rollback

If something goes wrong:
1. Go to Cloudflare Dashboard → Your Project → **Deployments**
2. Find the last working deployment
3. Click **Rollback to this deployment**
4. Your site will be restored in ~30 seconds

---

**Good luck with your deployment! 🚀**

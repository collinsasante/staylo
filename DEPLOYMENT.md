# Deploying Staylo to Cloudflare Pages

This guide will help you deploy your Next.js hostel management application to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Git repository pushed to GitHub
3. Wrangler CLI installed (optional for CLI deployment)

## Method 1: Deploy via Cloudflare Dashboard (Recommended)

### Step 1: Connect GitHub Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on **Workers & Pages** in the left sidebar
3. Click **Create application** > **Pages** > **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select your repository: `collinsasante/staylo`

### Step 2: Configure Build Settings

Set the following build configuration:

- **Production branch**: `main`
- **Build command**: `npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: `/` (leave empty)

### Step 3: Set Environment Variables

In the Cloudflare dashboard, add these environment variables:

#### Firebase Configuration (Public)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

#### Cloudinary Configuration (Server-side)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Email Configuration (Server-side)
```
RESEND_API_KEY=your-resend-api-key
```

**Important**: Copy these values from your local `.env.local` file.

### Step 4: Deploy

1. Click **Save and Deploy**
2. Cloudflare will build and deploy your application
3. You'll get a URL like: `https://staylo-hostel.pages.dev`

### Step 5: Custom Domain (Optional)

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain name
4. Follow the DNS configuration instructions

---

## Method 2: Deploy via Wrangler CLI

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Build and Deploy

```bash
# Build for Cloudflare Pages
npm run pages:build

# Deploy to Cloudflare Pages
npm run deploy
```

### Step 4: Set Environment Variables via CLI

```bash
# Set environment variables (replace with your values)
wrangler pages secret put NEXT_PUBLIC_FIREBASE_API_KEY
wrangler pages secret put NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
wrangler pages secret put NEXT_PUBLIC_FIREBASE_PROJECT_ID
wrangler pages secret put NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
wrangler pages secret put NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
wrangler pages secret put NEXT_PUBLIC_FIREBASE_APP_ID
wrangler pages secret put CLOUDINARY_CLOUD_NAME
wrangler pages secret put CLOUDINARY_API_KEY
wrangler pages secret put CLOUDINARY_API_SECRET
wrangler pages secret put RESEND_API_KEY
```

---

## Important Notes

### 1. Environment Variables

- **Public variables** (starting with `NEXT_PUBLIC_`) are embedded in the client bundle
- **Server variables** are only accessible in API routes and server-side code
- Never commit `.env.local` to git (it's already in `.gitignore`)

### 2. Firebase Configuration

Your Firebase project must allow the Cloudflare Pages domain:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Add your Cloudflare Pages domain: `staylo-hostel.pages.dev`
5. Also add your custom domain if using one

### 3. Cloudinary CORS

Ensure Cloudinary allows requests from your Cloudflare domain:
1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Settings** > **Security**
3. Add your Cloudflare domain to **Allowed fetch domains**

### 4. API Routes Limitations

Cloudflare Pages has some limitations:
- API routes run on Cloudflare Workers (edge runtime)
- Maximum execution time: 30 seconds (free), 50ms CPU time
- Some Node.js APIs may not be available
- File uploads work but have size limits

### 5. Image Optimization

The app uses Cloudinary for image storage and optimization, which works perfectly with Cloudflare Pages.

---

## Troubleshooting

### Build Fails

1. Check build logs in Cloudflare dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility (use Node 18+)

### Environment Variables Not Working

1. Make sure variables are set in Cloudflare dashboard
2. Redeploy after adding/changing environment variables
3. For public variables, use `NEXT_PUBLIC_` prefix

### Firebase Authentication Issues

1. Add Cloudflare domain to Firebase authorized domains
2. Check Firebase console for auth errors
3. Verify API keys are correct

### Image Upload Issues

1. Check Cloudinary API credentials
2. Verify CORS settings in Cloudflare
3. Check file size limits (Cloudflare has request size limits)

### API Routes Not Working

1. Check that routes are in `pages/api/` directory
2. Verify environment variables are set correctly
3. Check Cloudflare Workers logs for errors

---

## Monitoring and Analytics

### Cloudflare Analytics

- Go to your Pages project dashboard
- View real-time traffic, requests, and errors
- Monitor build history and deployments

### Performance

- Cloudflare Pages provides global CDN
- Automatic HTTPS
- DDoS protection
- Near-instant cache purging

---

## Continuous Deployment

Once set up, Cloudflare Pages will automatically:
- Build and deploy on every push to `main` branch
- Create preview deployments for pull requests
- Maintain deployment history

### Preview Deployments

- Every PR gets a unique preview URL
- Test changes before merging to production
- Automatic cleanup after PR is merged/closed

---

## Custom Headers and Redirects

Create `public/_headers` file for custom headers:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

Create `public/_redirects` file for redirects:

```
/old-path  /new-path  301
```

---

## Rollback

To rollback to a previous deployment:
1. Go to Cloudflare dashboard > Your project > **Deployments**
2. Find the deployment you want to rollback to
3. Click **Rollback to this deployment**

---

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Community](https://community.cloudflare.com/)

---

## Estimated Costs

**Cloudflare Pages Free Tier:**
- 500 builds per month
- Unlimited requests
- Unlimited bandwidth
- 1 concurrent build

**Cloudflare Pages Pro ($20/month):**
- 5,000 builds per month
- 5 concurrent builds
- Advanced build configuration

For your hostel management app, the free tier should be sufficient unless you have very high traffic.

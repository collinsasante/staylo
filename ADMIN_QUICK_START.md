# Staylo Admin Panel - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Access the Admin Panel
```
http://localhost:3000/admin/login
```

### 2. Login with Demo Credentials
- **Email**: `admin@staylo.com`
- **Password**: `admin123`

### 3. Explore Features
- 📊 **Dashboard**: Overview of your hostel platform
- 🏠 **Hostels**: Manage all hostel listings
- 📩 **Inquiries**: Handle student messages

---

## 📋 What's Included

### ✅ Complete Pages
1. **Login Page** (`/admin/login`)
   - Simple email/password authentication
   - Error handling
   - Responsive design

2. **Dashboard** (`/admin`)
   - 4 stat cards (Total Hostels, Inquiries, Most Viewed, Featured)
   - Most viewed hostels table
   - Recent inquiries list
   - Quick action buttons

3. **Hostels List** (`/admin/hostels`)
   - Filter by status (All/Active/Featured/Unavailable)
   - Search by name or location
   - Complete table with all hostel info
   - View, edit, delete actions

4. **Add New Hostel** (`/admin/hostels/new`)
   - Complete form with all fields
   - Image upload with preview
   - Amenities checkboxes
   - Owner information
   - Status selection

5. **Inquiries** (`/admin/inquiries`)
   - Filter by status (All/Unread/Read/Contacted)
   - View details in modal
   - Direct email and WhatsApp links
   - Export to CSV
   - Mark as contacted

### 🎨 Design Features
- **Red Theme** throughout (#dc2626)
- Fully responsive (mobile + desktop)
- Clean, modern UI
- Intuitive navigation
- Smooth animations

---

## 🎯 Quick Feature Guide

### Adding a New Hostel
1. Go to Hostels → Click "➕ Add New Hostel"
2. Fill in basic information (name, location, price)
3. Add description
4. Select amenities
5. Add owner details
6. Upload images
7. Click "Add Hostel"

### Managing Inquiries
1. Go to Inquiries
2. Filter by status if needed
3. Click 👁️ to view details
4. Use ✉️ for email or 💬 for WhatsApp
5. Change status dropdown to mark as contacted
6. Export all inquiries to CSV anytime

### Dashboard Overview
- See total hostels and active count
- Check unread inquiries at a glance
- View most popular hostels
- Quick access to recent inquiries
- Use quick action buttons to navigate

---

## 🔑 Demo Data

The admin panel comes with sample data for demonstration:

### Sample Hostels
1. Sunrise Hostel - Accra (Featured, GH₵1200/semester)
2. Campus Lodge - Kumasi (Active, GH₵900/semester)
3. Student Haven - Takoradi (Active, GH₵800/semester)
4. Unity Residence - Cape Coast (Unavailable, GH₵1000/semester)

### Sample Inquiries
- John Mensah - interested in Sunrise Hostel (Unread)
- Ama Boateng - question about Campus Lodge (Read)
- Kwame Asante - booking inquiry (Contacted)
- Akosua Owusu - security question (Unread)

---

## 📱 Responsive Design

### Desktop (>768px)
- Fixed sidebar (260px wide)
- Full table views
- Multi-column grids

### Mobile (<768px)
- Collapsible sidebar
- Stacked layouts
- Touch-friendly buttons
- Responsive tables

---

## 🎨 Theme Colors

### Primary (Red)
- **Main**: `#dc2626` - Buttons, links, accents
- **Light**: `#fee2e2` - Backgrounds, hover states
- **Lighter**: `#fef2f2` - Page backgrounds

### Status Colors
- **Success** (Green): `#10b981` - Active, completed
- **Warning** (Amber): `#f59e0b` - Featured, pending
- **Danger** (Red): `#ef4444` - Unavailable, errors
- **Info** (Blue): `#3b82f6` - Information

---

## 🛠️ Technical Stack

### Built With
- **Next.js** 13.5.6
- **React** 18.2.0
- **TypeScript** 5.3.2
- **Custom CSS** (no framework dependencies)

### File Structure
```
pages/admin/
├── index.tsx              # Dashboard
├── login.tsx              # Login
├── hostels/
│   ├── index.tsx          # List
│   └── new.tsx            # Add new
└── inquiries/
    └── index.tsx          # Inquiries

components/admin/
└── AdminLayout.tsx        # Layout wrapper

styles/
└── admin.css              # All admin styles
```

---

## 🔄 Next Steps (Integration)

To make this production-ready, you need to:

### 1. Firebase Setup
```bash
npm install firebase
```
- Create Firebase project
- Enable Firestore
- Enable Storage
- Enable Authentication

### 2. Create API Routes
```
pages/api/
├── hostels/
│   ├── index.ts
│   └── [id].ts
├── inquiries/
│   └── index.ts
└── upload.ts
```

### 3. Update Forms
- Replace mock data with Firestore calls
- Implement image upload to Firebase Storage
- Add real authentication check
- Add loading states

### 4. Add Notifications
- Slack webhook for new inquiries
- Email notifications
- Better Stack monitoring

---

## 🎓 Common Tasks

### Change Primary Color
```css
/* In styles/admin.css */
:root {
  --primary: #your-color-here;
}
```

### Add New Stat Card
```tsx
<div className="stat-card">
  <div className="stat-icon">🔥</div>
  <div className="stat-content">
    <h3>Your Stat Name</h3>
    <p className="stat-number">123</p>
  </div>
</div>
```

### Add Table Column
```tsx
/* In <thead> */
<th>New Column</th>

/* In <tbody> map */
<td>{data.newField}</td>
```

---

## 📞 Contact Integration

### Email
```html
<a href="mailto:student@email.com">Send Email</a>
```

### WhatsApp
```html
<a href="https://wa.me/233241234567" target="_blank">
  WhatsApp
</a>
```

### Phone
```html
<a href="tel:+233241234567">Call</a>
```

---

## 🐛 Troubleshooting

### "Page not found"
- Make sure dev server is running: `npm run dev`
- Check you're accessing `/admin/login` not `/admin-login`

### "Styles not loading"
- Verify `admin.css` is imported in `_app.tsx`
- Clear browser cache
- Restart dev server

### "Login not working"
- Use exact credentials: `admin@staylo.com` / `admin123`
- Check browser console for errors

---

## 💡 Tips

1. **Use Filters**: Quickly find hostels/inquiries by status
2. **Export Data**: Download inquiries as CSV for offline analysis
3. **Keyboard Shortcuts**: Tab through forms, Enter to submit
4. **Mobile Friendly**: Manage on the go with responsive design
5. **Direct Contact**: Click phone/email to instantly reach students

---

## 📚 Documentation

- **Full Documentation**: See `ADMIN_PANEL_README.md`
- **Color Changes**: See `COLOR_CHANGES.md`
- **Console Fixes**: See `CONSOLE_ERRORS_FIXED.md`

---

**Ready to manage your hostel platform!** 🎉

For questions or issues, check the full documentation in `ADMIN_PANEL_README.md`

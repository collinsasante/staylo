# Staylo Admin Panel Documentation

## Overview

The Staylo Admin Panel is a comprehensive dashboard for managing hostel listings, student inquiries, and platform content. Built with Next.js and featuring a clean red theme.

## 🔑 Access & Authentication

### Login Credentials (Demo)
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@staylo.com`
- **Password**: `admin123`

**Note**: This is a mock authentication system. For production, implement Firebase Authentication.

## 📁 Admin Panel Structure

```
pages/admin/
├── index.tsx              # Dashboard
├── login.tsx              # Login page
├── hostels/
│   ├── index.tsx          # Hostels list
│   ├── new.tsx            # Add new hostel
│   └── [id]/
│       └── edit.tsx       # Edit hostel (TODO)
├── inquiries/
│   └── index.tsx          # Student inquiries
├── media/
│   └── index.tsx          # Media library (TODO)
└── settings/
    └── index.tsx          # Admin settings (TODO)

components/admin/
└── AdminLayout.tsx         # Admin layout with sidebar

styles/
└── admin.css              # Admin panel styles (red theme)
```

## 🎨 Design Theme

### Color Palette
- **Primary Red**: `#dc2626` (Red-600)
- **Primary Light**: `#fee2e2` (Red-100)
- **Primary Lighter**: `#fef2f2` (Red-50)

### Status Colors
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

## 📊 Admin Features

### 1. Dashboard (`/admin`)
**Features:**
- Overview statistics (Total Hostels, Inquiries, Most Viewed, Featured)
- Most viewed hostels table
- Recent inquiries list
- Quick action buttons

**Data Displayed:**
- Total and active hostels count
- Unread inquiries count
- Top 3 most viewed hostels
- Recent 3 inquiries

### 2. Hostels Management (`/admin/hostels`)

#### List View (`/admin/hostels`)
**Features:**
- Filter by status: All, Active, Featured, Unavailable
- Search hostels by name or location
- View hostel details (name, location, price, owner, contact, views)
- Quick actions: View, Edit, Delete

**Table Columns:**
- Hostel Name
- Location
- Price/Semester
- Owner
- Contact (clickable phone number)
- Views (with eye icon)
- Status (badge)
- Actions (view, edit, delete icons)

#### Add New Hostel (`/admin/hostels/new`)
**Form Sections:**

**1. Basic Information**
- Hostel Name *
- Location *
- Price per Semester (GH₵) *
- Status (Active/Unavailable/Featured) *
- Description *

**2. Amenities** (Checkboxes)
- WiFi
- Water Supply
- Security
- Kitchen
- Laundry
- Parking
- Generator
- Study Room
- Gym
- Air Conditioning

**3. Owner Information**
- Owner Name *
- Contact Number *
- Email (Optional)

**4. Images**
- Drag & drop or click to upload
- Multiple image support
- Preview with remove option
- Supported formats: PNG, JPG, WEBP

**Actions:**
- Cancel (go back)
- Add Hostel (submit)

### 3. Inquiries Management (`/admin/inquiries`)

**Features:**
- Filter by status: All, Unread, Read, Contacted
- View inquiry details in modal
- Mark status (Unread/Read/Contacted)
- Direct contact options (Email, WhatsApp)
- Export to CSV

**Table Columns:**
- Student Name
- Email (clickable mailto link)
- Phone (clickable tel link)
- Hostel Interested In
- Date (relative time: "5 min ago", "1 hour ago")
- Status (badge)
- Actions (view, email, WhatsApp, status dropdown)

**Inquiry Detail Modal:**
- Full student information
- Complete message text
- Direct contact buttons
- Status display

**Export Feature:**
- Export all inquiries to CSV
- Filename: `inquiries_YYYY-MM-DD.csv`
- Includes all fields

### 4. Admin Layout Features

**Sidebar Navigation:**
- 📊 Dashboard
- 🏠 Hostels
- 📩 Inquiries
- 🖼️ Media Library (TODO)
- ⚙️ Settings (TODO)
- 🚪 Logout

**Top Header:**
- Menu toggle (mobile)
- Page title
- Notification bell (with badge)
- Admin profile (avatar + name)

**Responsive Design:**
- Mobile-first approach
- Sidebar collapses on mobile
- Touch-friendly buttons
- Responsive tables

## 🔧 Technical Implementation

### Frontend Stack
- **Framework**: Next.js 13.5.6
- **Language**: TypeScript
- **Styling**: Custom CSS (no framework dependencies)
- **State Management**: React useState/useEffect

### Backend (TODO)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (for images)
- **Authentication**: Firebase Auth
- **Notifications**: Slack/Better Stack

### File Structure
```
hostel-nextjs/
├── components/
│   └── admin/
│       └── AdminLayout.tsx
├── pages/
│   ├── admin/
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── hostels/
│   │   └── inquiries/
│   └── _app.tsx
├── styles/
│   ├── admin.css
│   └── globals.css
└── lib/
    └── firebase.ts (TODO)
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd /Users/breezyyy/Downloads/hostel-nextjs
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Access Admin Panel
```
http://localhost:3000/admin/login
```

### 4. Login
Use demo credentials:
- Email: `admin@staylo.com`
- Password: `admin123`

## 📝 TODO: Implementation Checklist

### Phase 1: Firebase Setup
- [ ] Create Firebase project
- [ ] Configure Firestore database
- [ ] Set up Firebase Storage
- [ ] Implement Firebase Authentication
- [ ] Create `/lib/firebase.ts` configuration

### Phase 2: API Routes
- [ ] Create `/api/hostels` endpoints (GET, POST, PUT, DELETE)
- [ ] Create `/api/inquiries` endpoints (GET, PUT)
- [ ] Create `/api/upload` for image uploads
- [ ] Add authentication middleware

### Phase 3: Data Integration
- [ ] Connect dashboard to Firestore
- [ ] Implement hostel CRUD operations
- [ ] Implement inquiry management
- [ ] Add image upload to Firebase Storage
- [ ] Implement real-time updates

### Phase 4: Additional Features
- [ ] Media library page (`/admin/media`)
- [ ] Settings page (`/admin/settings`)
- [ ] Edit hostel page (`/admin/hostels/[id]/edit`)
- [ ] View hostel detail page (`/admin/hostels/[id]`)
- [ ] Email templates for responses
- [ ] Analytics integration (Google Analytics)

### Phase 5: Security & Production
- [ ] Implement proper authentication guards
- [ ] Add role-based access control
- [ ] Set up Slack/Better Stack notifications
- [ ] Add error boundaries
- [ ] Implement loading states
- [ ] Add form validation
- [ ] Set up production environment variables

## 🛡️ Security Considerations

### Current Implementation (Demo)
- Mock authentication (localStorage)
- No route protection
- No data validation

### Production Requirements
1. **Authentication**
   - Firebase Auth with email/password
   - Secure session management
   - Password requirements enforcement

2. **Route Protection**
   - Server-side authentication checks
   - Redirect unauthorized users
   - Protected API routes

3. **Data Validation**
   - Input sanitization
   - File upload validation
   - XSS protection
   - CSRF tokens

4. **Environment Variables**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   FIREBASE_ADMIN_SDK_KEY=
   ```

## 📱 Responsive Breakpoints

```css
/* Desktop (default) */
@media (min-width: 769px) {
  .admin-sidebar { width: 260px; }
}

/* Mobile */
@media (max-width: 768px) {
  .admin-sidebar { transform: translateX(-100%); }
  .admin-sidebar.open { transform: translateX(0); }
}
```

## 🎯 Key Features Summary

✅ **Implemented:**
- Complete admin layout with sidebar
- Dashboard with statistics
- Hostels list with filters & search
- Add new hostel form with image upload
- Inquiries management with filters
- Inquiry detail modal
- CSV export functionality
- Responsive design
- Red theme throughout
- Mock authentication

🔨 **To Implement:**
- Firebase integration
- Real data persistence
- Image upload to Firebase Storage
- Edit hostel functionality
- Media library
- Settings page
- Email notifications
- Real-time updates
- Production authentication

## 📞 Contact Actions

### Email Integration
```typescript
<a href={`mailto:${inquiry.email}`}>Send Email</a>
```

### WhatsApp Integration
```typescript
<a
  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
  target="_blank"
  rel="noopener noreferrer"
>
  WhatsApp
</a>
```

## 🎨 Styling Guidelines

### Component Classes
- `.page-header` - Page title section
- `.filters-bar` - Filters and search container
- `.table-container` - Table wrapper
- `.data-table` - Main data table
- `.modal-overlay` - Modal backdrop
- `.form-section` - Form section divider

### Utility Classes
- `.text-muted` - Muted text color
- `.text-center` - Center align text
- `.mb-20` - Margin bottom 20px
- `.mt-20` - Margin top 20px

### Status Badges
```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Featured</span>
<span class="badge badge-danger">Unavailable</span>
```

## 🔗 Navigation Structure

```
/admin
├── /admin/login (public)
├── /admin (protected - dashboard)
├── /admin/hostels (protected - list)
├── /admin/hostels/new (protected - add)
├── /admin/hostels/[id]/edit (protected - edit)
├── /admin/inquiries (protected - list)
├── /admin/media (protected - library)
└── /admin/settings (protected - settings)
```

## 💡 Tips for Customization

1. **Change Theme Color**: Update CSS variables in `styles/admin.css`
   ```css
   :root {
     --primary: #your-color;
     --primary-dark: #your-dark-color;
     --primary-light: #your-light-color;
   }
   ```

2. **Add New Stats Card**: Copy existing stat-card structure in dashboard

3. **Add New Table Column**: Update both `<th>` and `<td>` in data-table

4. **Add New Filter**: Add button to `.filter-tabs` and update filter logic

## 📊 Data Models

### Hostel
```typescript
interface Hostel {
  id: string;
  name: string;
  location: string;
  price: number;
  description: string;
  amenities: string[];
  ownerName: string;
  ownerContact: string;
  ownerEmail?: string;
  status: 'active' | 'unavailable' | 'featured';
  images: string[]; // URLs
  views: number;
  createdAt: string;
  updatedAt: string;
}
```

### Inquiry
```typescript
interface Inquiry {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  hostelInterested: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'contacted';
}
```

## 🚨 Error Handling

Currently using simple alerts. For production:
- Implement toast notifications
- Add error boundaries
- Log errors to monitoring service
- Show user-friendly error messages

## 📈 Performance Optimization

### Current
- Static data (mock)
- No optimization needed

### For Production
- Implement pagination (20 items per page)
- Add lazy loading for images
- Use React.memo for expensive components
- Implement data caching
- Add loading skeletons

---

**Version**: 1.0.0
**Last Updated**: January 2024
**Built with**: Next.js 13.5.6 + TypeScript + Custom CSS

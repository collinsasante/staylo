# 📚 Staylo API Documentation

Complete API reference for the Staylo Hostel Management Platform.

**Base URL:** `http://localhost:3000/api` (development)
**Production:** `https://your-domain.com/api`

---

## 🔐 Authentication

Most admin endpoints require authentication. Include the Firebase ID token in the Authorization header:

```http
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

### Getting a Token:
After logging in via Firebase, retrieve the token:
```javascript
const token = await user.getIdToken();
```

---

## 📊 Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

---

## 🏠 Hostels API

### List All Hostels

```http
GET /api/hostels
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | - | Filter by status: `active`, `unavailable`, `featured` |
| `search` | string | - | Search by name, location, or description |
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 20 | Results per page (max 100) |
| `sortBy` | string | `createdAt` | Sort field: `createdAt`, `price`, `views`, `name` |
| `order` | string | `desc` | Sort order: `asc` or `desc` |

**Example Request:**
```http
GET /api/hostels?status=active&page=1&limit=10&sortBy=price&order=asc
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "hostel123",
      "name": "Sunrise Hostel",
      "location": "Accra, Greater Accra",
      "price": 1200,
      "description": "Modern hostel near campus",
      "amenities": ["WiFi", "Security", "Water Supply"],
      "ownerName": "Mr. Kofi Mensah",
      "ownerContact": "+233 24 123 4567",
      "ownerEmail": "kofi@example.com",
      "status": "active",
      "images": ["https://res.cloudinary.com/.../image1.jpg"],
      "views": 342,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Get Single Hostel

```http
GET /api/hostels/{id}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "hostel123",
    "name": "Sunrise Hostel",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Hostel not found"
}
```

---

### Create Hostel

```http
POST /api/hostels
```

**Authentication:** Required
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "hostelData": {
    "name": "New Hostel",
    "location": "Kumasi, Ashanti",
    "price": 900,
    "description": "Comfortable student accommodation",
    "amenities": ["WiFi", "Kitchen", "Laundry"],
    "ownerName": "Mrs. Ama Boateng",
    "ownerContact": "+233 20 987 6543",
    "ownerEmail": "ama@example.com",
    "status": "active"
  },
  "imageUrls": [
    "https://res.cloudinary.com/.../image1.jpg",
    "https://res.cloudinary.com/.../image2.jpg"
  ]
}
```

**Example Response (201):**
```json
{
  "success": true,
  "data": { "id": "hostel456" },
  "message": "Hostel created successfully"
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "error": "Missing required fields: name, location, price"
}
```

---

### Update Hostel

```http
PUT /api/hostels/{id}
```

**Authentication:** Required
**Content-Type:** `application/json`

**Request Body:** (partial update supported)
```json
{
  "price": 950,
  "status": "featured"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Hostel updated successfully"
}
```

---

### Delete Hostel

```http
DELETE /api/hostels/{id}
```

**Authentication:** Required

**Example Response:**
```json
{
  "success": true,
  "message": "Hostel deleted successfully"
}
```

---

## 📩 Inquiries API

### List All Inquiries

```http
GET /api/inquiries
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `unread`, `read`, `contacted` |

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "inquiry123",
      "studentName": "John Mensah",
      "email": "john@student.edu.gh",
      "phone": "+233 24 111 2222",
      "hostelInterested": "Sunrise Hostel - Accra",
      "message": "I would like to know about availability...",
      "date": "2024-01-20T10:30:00Z",
      "status": "unread",
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

---

### Create Inquiry (Public)

```http
POST /api/inquiries
```

**Authentication:** Not required (public endpoint)
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "studentName": "John Mensah",
  "email": "john@student.edu.gh",
  "phone": "+233 24 111 2222",
  "hostelInterested": "Sunrise Hostel",
  "message": "I am interested in booking..."
}
```

**Example Response (201):**
```json
{
  "success": true,
  "data": { "id": "inquiry456" },
  "message": "Inquiry submitted successfully"
}
```

**Note:** This endpoint automatically sends:
- Email notification to admin
- Confirmation email to student
- Slack notification (if configured)

---

### Get Single Inquiry

```http
GET /api/inquiries/{id}
```

**Authentication:** Required

---

### Update Inquiry Status

```http
PUT /api/inquiries/{id}
```

**Authentication:** Required
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Allowed Status Values:** `unread`, `read`, `contacted`

**Example Response:**
```json
{
  "success": true,
  "message": "Inquiry status updated successfully"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Invalid status. Must be: unread, read, or contacted"
}
```

---

### Delete Inquiry

```http
DELETE /api/inquiries/{id}
```

**Authentication:** Required

---

## 📈 Statistics API

### Get Dashboard Stats

```http
GET /api/stats
```

**Authentication:** Required

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalHostels": 24,
    "activeHostels": 20,
    "featuredHostels": 6,
    "unavailableHostels": 4,
    "totalInquiries": 156,
    "unreadInquiries": 12,
    "readInquiries": 45,
    "contactedInquiries": 99,
    "totalViews": 3420,
    "mostViewed": [
      {
        "id": "hostel123",
        "name": "Sunrise Hostel - Accra",
        "views": 342
      },
      {
        "id": "hostel456",
        "name": "Campus Lodge - Kumasi",
        "views": 298
      }
    ],
    "recentInquiries": [
      {
        "studentName": "John Mensah",
        "hostelInterested": "Sunrise Hostel",
        "date": "2024-01-20T10:30:00Z",
        "status": "unread"
      }
    ]
  }
}
```

---

## 📤 Upload API

### Upload Images to Cloudinary

```http
POST /api/upload
```

**Authentication:** Not required (but consider adding it)
**Content-Type:** `multipart/form-data`

**Form Data:**
- `images`: File[] (multiple files supported)

**Limits:**
- Max file size: 5MB per file
- Max files: 10 per request
- Allowed formats: PNG, JPG, WEBP

**Example Request (using FormData):**
```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "urls": [
      "https://res.cloudinary.com/.../image1.jpg",
      "https://res.cloudinary.com/.../image2.jpg"
    ]
  },
  "message": "Images uploaded successfully"
}
```

**Features:**
- Automatic optimization
- Auto WebP conversion for modern browsers
- Resizing to max 1920px width
- Quality: auto:good

---

## 🛡️ Security Features

### Rate Limiting

All endpoints are rate-limited:
- **Limit:** 100 requests per 15 minutes per IP
- **Response (429):**
```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "retryAfter": 345
}
```

### XSS Protection

All string inputs are automatically sanitized to prevent XSS attacks.

### CORS

CORS is enabled for all endpoints. Configure allowed origins in production.

---

## 📋 Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## 🔧 Middleware Stack

All endpoints use the following middleware:

1. **CORS** - Cross-origin resource sharing
2. **Rate Limiting** - IP-based request throttling
3. **Logging** - Request/response logging with timing
4. **Error Handler** - Catches and formats errors
5. **Validation** - Input sanitization (XSS prevention)

---

## 📱 Example Usage

### JavaScript/TypeScript

```typescript
// List hostels with filtering
const response = await fetch('/api/hostels?status=active&page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
const data = await response.json();

// Create hostel
const response = await fetch('/api/hostels', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    hostelData: { /* ... */ },
    imageUrls: [/* ... */],
  }),
});

// Submit inquiry (public)
const response = await fetch('/api/inquiries', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    studentName: 'John Doe',
    email: 'john@example.com',
    // ...
  }),
});
```

### cURL

```bash
# List hostels
curl -X GET "http://localhost:3000/api/hostels?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create hostel
curl -X POST "http://localhost:3000/api/hostels" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "hostelData": {
      "name": "New Hostel",
      "location": "Accra",
      "price": 1000
    }
  }'

# Submit inquiry
curl -X POST "http://localhost:3000/api/inquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "email": "john@example.com",
    "phone": "+233 24 123 4567",
    "hostelInterested": "Sunrise Hostel",
    "message": "I am interested..."
  }'
```

---

## 🚀 Testing

Use tools like:
- **Postman** - API testing GUI
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension
- **cURL** - Command line

---

## 📦 Environment Variables

Required for full functionality:

```env
# Firebase (Database & Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Cloudinary (Image Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Notifications (Optional)
ADMIN_EMAIL=admin@staylo.com
SLACK_WEBHOOK_URL=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📞 Support

For API issues:
1. Check request format and required fields
2. Verify authentication token is valid
3. Check rate limits haven't been exceeded
4. Review logs for detailed error messages

---

**API Version:** 1.0
**Last Updated:** January 2025
**Status:** Production Ready 🎉

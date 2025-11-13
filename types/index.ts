// Hostel Types
export interface Hostel {
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
  images: string[]; // Firebase Storage URLs
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHostelInput {
  name: string;
  location: string;
  price: number;
  description: string;
  amenities: string[];
  ownerName: string;
  ownerContact: string;
  ownerEmail?: string;
  status: 'active' | 'unavailable' | 'featured';
}

// Inquiry Types
export interface Inquiry {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  hostelInterested: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'contacted';
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryInput {
  studentName: string;
  email: string;
  phone: string;
  hostelInterested: string;
  message: string;
}

// Admin User Type
export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
  details?: string[];
  retryAfter?: number;
  stack?: string;
}

// Pagination Types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Stats Types
export interface DashboardStats {
  totalHostels: number;
  activeHostels: number;
  featuredHostels: number;
  unavailableHostels: number;
  totalInquiries: number;
  unreadInquiries: number;
  readInquiries: number;
  contactedInquiries: number;
  totalViews: number;
  mostViewed: {
    id: string;
    name: string;
    views: number;
  }[];
}

// News/Post Types
export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  images?: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
}

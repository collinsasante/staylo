import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { Hostel, CreateHostelInput, Inquiry, CreateInquiryInput } from '../types';

// Collections
const HOSTELS_COLLECTION = 'hostels';
const INQUIRIES_COLLECTION = 'inquiries';

// ============================================
// Hostel Operations
// ============================================

export const createHostel = async (
  data: CreateHostelInput,
  imageUrls: string[]
): Promise<string> => {
  const hostelData = {
    ...data,
    images: imageUrls,
    views: 0,
    createdAt: Timestamp.now().toDate().toISOString(),
    updatedAt: Timestamp.now().toDate().toISOString(),
  };

  const docRef = await addDoc(collection(db, HOSTELS_COLLECTION), hostelData);
  return docRef.id;
};

export const getHostel = async (id: string): Promise<Hostel | null> => {
  const docRef = doc(db, HOSTELS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Hostel;
  }
  return null;
};

export const getAllHostels = async (): Promise<Hostel[]> => {
  const q = query(collection(db, HOSTELS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Hostel[];
};

export const getHostelsByStatus = async (
  status: 'active' | 'unavailable' | 'featured'
): Promise<Hostel[]> => {
  const q = query(
    collection(db, HOSTELS_COLLECTION),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Hostel[];
};

export const updateHostel = async (
  id: string,
  data: Partial<CreateHostelInput>
): Promise<void> => {
  const docRef = doc(db, HOSTELS_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now().toDate().toISOString(),
  });
};

export const deleteHostel = async (id: string): Promise<void> => {
  const docRef = doc(db, HOSTELS_COLLECTION, id);
  await deleteDoc(docRef);
};

export const incrementHostelViews = async (id: string): Promise<void> => {
  const docRef = doc(db, HOSTELS_COLLECTION, id);
  await updateDoc(docRef, {
    views: increment(1),
  });
};

export const getMostViewedHostels = async (limitCount: number = 5): Promise<Hostel[]> => {
  const q = query(
    collection(db, HOSTELS_COLLECTION),
    orderBy('views', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Hostel[];
};

// ============================================
// Inquiry Operations
// ============================================

export const createInquiry = async (data: CreateInquiryInput): Promise<string> => {
  const inquiryData = {
    ...data,
    status: 'unread' as const,
    date: Timestamp.now().toDate().toISOString(),
    createdAt: Timestamp.now().toDate().toISOString(),
    updatedAt: Timestamp.now().toDate().toISOString(),
  };

  const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), inquiryData);
  return docRef.id;
};

export const getInquiry = async (id: string): Promise<Inquiry | null> => {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Inquiry;
  }
  return null;
};

export const getAllInquiries = async (): Promise<Inquiry[]> => {
  const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Inquiry[];
};

export const getInquiriesByStatus = async (
  status: 'unread' | 'read' | 'contacted'
): Promise<Inquiry[]> => {
  const q = query(
    collection(db, INQUIRIES_COLLECTION),
    where('status', '==', status),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Inquiry[];
};

export const updateInquiryStatus = async (
  id: string,
  status: 'unread' | 'read' | 'contacted'
): Promise<void> => {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now().toDate().toISOString(),
  });
};

export const deleteInquiry = async (id: string): Promise<void> => {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  await deleteDoc(docRef);
};

export const getRecentInquiries = async (limitCount: number = 10): Promise<Inquiry[]> => {
  const q = query(
    collection(db, INQUIRIES_COLLECTION),
    orderBy('date', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Inquiry[];
};

// ============================================
// Dashboard Stats
// ============================================

export const getDashboardStats = async () => {
  const [hostels, inquiries] = await Promise.all([
    getAllHostels(),
    getAllInquiries(),
  ]);

  const stats = {
    totalHostels: hostels.length,
    activeHostels: hostels.filter((h) => h.status === 'active').length,
    featuredHostels: hostels.filter((h) => h.status === 'featured').length,
    unavailableHostels: hostels.filter((h) => h.status === 'unavailable').length,
    totalInquiries: inquiries.length,
    unreadInquiries: inquiries.filter((i) => i.status === 'unread').length,
    readInquiries: inquiries.filter((i) => i.status === 'read').length,
    contactedInquiries: inquiries.filter((i) => i.status === 'contacted').length,
    totalViews: hostels.reduce((sum, h) => sum + h.views, 0),
    mostViewed: hostels
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((h) => ({
        id: h.id,
        name: h.name,
        views: h.views,
      })),
  };

  return stats;
};

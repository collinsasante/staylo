import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { NewsPost, CreateNewsInput } from '../types';

const NEWS_COLLECTION = 'news';

// Helper function to convert Firestore document to NewsPost
function docToNewsPost(doc: any): NewsPost {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    author: data.author || 'Admin',
    category: data.category || 'General',
    tags: data.tags || [],
    featuredImage: data.featuredImage || '',
    images: data.images || [],
    status: data.status || 'draft',
    views: data.views || 0,
    publishedAt: data.publishedAt?.toDate?.()?.toISOString() || data.publishedAt || null,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
}

// Get all news posts
export async function getAllNews(): Promise<NewsPost[]> {
  try {
    const newsCollection = collection(db, NEWS_COLLECTION);
    const newsQuery = query(newsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(newsQuery);

    return snapshot.docs.map(docToNewsPost);
  } catch (error) {
    console.error('Error fetching all news:', error);
    throw new Error('Failed to fetch news posts');
  }
}

// Get published news posts
export async function getPublishedNews(): Promise<NewsPost[]> {
  try {
    const newsCollection = collection(db, NEWS_COLLECTION);
    const snapshot = await getDocs(newsCollection);

    // Filter and sort in memory to avoid index requirements
    return snapshot.docs
      .map(docToNewsPost)
      .filter(post => post.status === 'published')
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA; // Descending order
      });
  } catch (error) {
    console.error('Error fetching published news:', error);
    throw new Error('Failed to fetch published news');
  }
}

// Get news by status
export async function getNewsByStatus(status: 'draft' | 'published' | 'archived'): Promise<NewsPost[]> {
  try {
    const newsCollection = collection(db, NEWS_COLLECTION);
    const snapshot = await getDocs(newsCollection);

    // Filter and sort in memory to avoid index requirements
    return snapshot.docs
      .map(docToNewsPost)
      .filter(post => post.status === status)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order
      });
  } catch (error) {
    console.error(`Error fetching ${status} news:`, error);
    throw new Error(`Failed to fetch ${status} news`);
  }
}

// Get news by category
export async function getNewsByCategory(category: string): Promise<NewsPost[]> {
  try {
    const newsCollection = collection(db, NEWS_COLLECTION);
    const snapshot = await getDocs(newsCollection);

    // Filter and sort in memory to avoid index requirements
    return snapshot.docs
      .map(docToNewsPost)
      .filter(post => post.category === category && post.status === 'published')
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA; // Descending order
      });
  } catch (error) {
    console.error(`Error fetching news by category ${category}:`, error);
    throw new Error(`Failed to fetch news by category`);
  }
}

// Get single news post by ID
export async function getNewsById(id: string): Promise<NewsPost | null> {
  try {
    const docRef = doc(db, NEWS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docToNewsPost(docSnap);
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    throw new Error('Failed to fetch news post');
  }
}

// Get news post by slug
export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const newsCollection = collection(db, NEWS_COLLECTION);
    const newsQuery = query(newsCollection, where('slug', '==', slug));
    const snapshot = await getDocs(newsQuery);

    if (snapshot.empty) {
      return null;
    }

    return docToNewsPost(snapshot.docs[0]);
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    throw new Error('Failed to fetch news post');
  }
}

// Create news post
export async function createNews(input: CreateNewsInput): Promise<NewsPost> {
  try {
    const now = Timestamp.now();

    const newsData = {
      ...input,
      images: input.images || [],
      views: 0,
      publishedAt: input.publishedAt ? Timestamp.fromDate(new Date(input.publishedAt)) : null,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, NEWS_COLLECTION), newsData);
    const newDoc = await getDoc(docRef);

    return docToNewsPost(newDoc);
  } catch (error) {
    console.error('Error creating news:', error);
    throw new Error('Failed to create news post');
  }
}

// Update news post
export async function updateNews(id: string, updates: Partial<CreateNewsInput>): Promise<NewsPost> {
  try {
    const docRef = doc(db, NEWS_COLLECTION, id);

    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    if (updates.publishedAt) {
      updateData.publishedAt = Timestamp.fromDate(new Date(updates.publishedAt));
    }

    await updateDoc(docRef, updateData);

    const updatedDoc = await getDoc(docRef);
    return docToNewsPost(updatedDoc);
  } catch (error) {
    console.error('Error updating news:', error);
    throw new Error('Failed to update news post');
  }
}

// Delete news post
export async function deleteNews(id: string): Promise<void> {
  try {
    const docRef = doc(db, NEWS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting news:', error);
    throw new Error('Failed to delete news post');
  }
}

// Increment news views
export async function incrementNewsViews(id: string): Promise<void> {
  try {
    const docRef = doc(db, NEWS_COLLECTION, id);
    await updateDoc(docRef, {
      views: increment(1),
    });
  } catch (error) {
    console.error('Error incrementing news views:', error);
    // Don't throw error for view increment failures
  }
}

// Get recent news (published only)
export async function getRecentNews(limit: number = 5): Promise<NewsPost[]> {
  try {
    const newsCollection = collection(db, NEWS_COLLECTION);
    const snapshot = await getDocs(newsCollection);

    // Filter and sort in memory to avoid index requirements
    return snapshot.docs
      .map(docToNewsPost)
      .filter(post => post.status === 'published')
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA; // Descending order
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent news:', error);
    throw new Error('Failed to fetch recent news');
  }
}

// Get popular news (by views)
export async function getPopularNews(limit: number = 5): Promise<NewsPost[]> {
  try {
    const newsCollection = collection(db, NEWS_COLLECTION);
    const snapshot = await getDocs(newsCollection);

    // Filter and sort in memory to avoid index requirements
    return snapshot.docs
      .map(docToNewsPost)
      .filter(post => post.status === 'published')
      .sort((a, b) => b.views - a.views) // Descending order by views
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching popular news:', error);
    throw new Error('Failed to fetch popular news');
  }
}

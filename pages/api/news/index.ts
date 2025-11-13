import { NextApiRequest, NextApiResponse } from 'next';
import {
  getAllNews,
  getPublishedNews,
  getNewsByStatus,
  getNewsByCategory,
  createNews,
} from '../../../lib/news';
import { ApiResponse, NewsPost, CreateNewsInput } from '../../../types';
import {
  compose,
  withCors,
  withRateLimit,
  withValidation,
  withLogging,
  withErrorHandler,
} from '../../../lib/middleware';

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<NewsPost[] | NewsPost>>) {
  if (req.method === 'GET') {
    return handleGet(req, res, req.query);
  } else if (req.method === 'POST') {
    return handlePost(req, res, req.body);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<NewsPost[]>>,
  query: any
) {
  const {
    status,
    category,
    search,
    page = '1',
    limit = '12',
    sortBy = 'publishedAt',
    order = 'desc',
  } = query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  // Validation
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({
      success: false,
      error: 'Invalid page number',
    });
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      error: 'Invalid limit (must be between 1 and 100)',
    });
  }

  try {
    // Fetch news based on filters
    let allNews: NewsPost[];

    if (category) {
      allNews = await getNewsByCategory(category);
    } else if (status && ['draft', 'published', 'archived'].includes(status)) {
      allNews = await getNewsByStatus(status as 'draft' | 'published' | 'archived');
    } else if (status === 'all') {
      allNews = await getAllNews();
    } else {
      // Default: get published news only
      allNews = await getPublishedNews();
    }

    // Apply search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      allNews = allNews.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.author.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    allNews.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortBy) {
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'views':
          aVal = a.views;
          bVal = b.views;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'publishedAt':
        default:
          aVal = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          bVal = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const total = allNews.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedNews = allNews.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedNews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch news',
    });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<NewsPost>>,
  body: any
) {
  try {
    const { newsData } = body;

    if (!newsData) {
      return res.status(400).json({
        success: false,
        error: 'Missing news data',
      });
    }

    // Validate required fields
    const requiredFields = ['title', 'slug', 'excerpt', 'content', 'author', 'category', 'featuredImage'];
    const missingFields = requiredFields.filter((field) => !newsData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        details: missingFields.map((field) => `${field} is required`),
      });
    }

    // Create news input
    const newsInput: CreateNewsInput = {
      title: newsData.title,
      slug: newsData.slug,
      excerpt: newsData.excerpt,
      content: newsData.content,
      author: newsData.author,
      category: newsData.category,
      tags: newsData.tags || [],
      featuredImage: newsData.featuredImage,
      images: newsData.images || [],
      status: newsData.status || 'draft',
      publishedAt: newsData.publishedAt || undefined,
    };

    const newPost = await createNews(newsInput);

    return res.status(201).json({
      success: true,
      data: newPost,
      message: 'News post created successfully',
    });
  } catch (error: any) {
    console.error('Error creating news:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create news post',
    });
  }
}

export default compose(
  withCors,
  withRateLimit,
  withValidation,
  withLogging,
  withErrorHandler
)(handler);

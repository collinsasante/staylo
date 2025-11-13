import { NextApiRequest, NextApiResponse } from 'next';
import {
  getNewsById,
  getNewsBySlug,
  updateNews,
  deleteNews,
  incrementNewsViews,
} from '../../../lib/news';
import { ApiResponse, NewsPost } from '../../../types';
import {
  compose,
  withCors,
  withRateLimit,
  withLogging,
  withErrorHandler,
} from '../../../lib/middleware';

async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<NewsPost | null>>) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'News ID or slug is required',
    });
  }

  if (req.method === 'GET') {
    return handleGet(req, res, id);
  } else if (req.method === 'PUT') {
    return handlePut(req, res, id, req.body);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res, id);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<NewsPost | null>>,
  id: string
) {
  try {
    // Try to get by ID first, then by slug
    let newsPost = await getNewsById(id);

    if (!newsPost) {
      newsPost = await getNewsBySlug(id);
    }

    if (!newsPost) {
      return res.status(404).json({
        success: false,
        error: 'News post not found',
      });
    }

    // Increment views (non-blocking)
    incrementNewsViews(newsPost.id).catch((err) =>
      console.error('Failed to increment views:', err)
    );

    return res.status(200).json({
      success: true,
      data: newsPost,
    });
  } catch (error: any) {
    console.error('Error fetching news post:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch news post',
    });
  }
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<NewsPost>>,
  id: string,
  body: any
) {
  try {
    const { updates } = body;

    if (!updates) {
      return res.status(400).json({
        success: false,
        error: 'Updates data is required',
      });
    }

    const updatedPost = await updateNews(id, updates);

    return res.status(200).json({
      success: true,
      data: updatedPost,
      message: 'News post updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating news post:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update news post',
    });
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>,
  id: string
) {
  try {
    await deleteNews(id);

    return res.status(200).json({
      success: true,
      data: null,
      message: 'News post deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting news post:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete news post',
    });
  }
}

export default compose(
  withCors,
  withRateLimit,
  withLogging,
  withErrorHandler
)(handler);

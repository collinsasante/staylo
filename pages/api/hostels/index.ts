import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllHostels, createHostel, getHostelsByStatus } from '../../../lib/db';
import {
  withCors,
  withErrorHandler,
  withRateLimit,
  withLogging,
  compose,
} from '../../../lib/middleware';
import { ApiResponse, Hostel } from '../../../types';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Hostel | Hostel[] | any>>
) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res, query);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        error: `Method ${method} not allowed`,
      });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>,
  query: any
) {
  const {
    status,
    search,
    page = '1',
    limit = '20',
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  // Parse pagination params
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  // Validate pagination
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

  // Fetch hostels
  let allHostels: Hostel[];

  if (status && ['active', 'unavailable', 'featured'].includes(status)) {
    allHostels = await getHostelsByStatus(status);
  } else {
    allHostels = await getAllHostels();
  }

  // Apply search filter
  if (search) {
    const searchLower = (search as string).toLowerCase();
    allHostels = allHostels.filter(
      (hostel) =>
        hostel.name.toLowerCase().includes(searchLower) ||
        hostel.location.toLowerCase().includes(searchLower) ||
        hostel.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  allHostels.sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (sortBy) {
      case 'price':
        aVal = a.price;
        bVal = b.price;
        break;
      case 'views':
        aVal = a.views;
        bVal = b.views;
        break;
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'createdAt':
      default:
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
    }

    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Calculate pagination
  const total = allHostels.length;
  const totalPages = Math.ceil(total / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedHostels = allHostels.slice(startIndex, endIndex);

  return res.status(200).json({
    success: true,
    data: paginatedHostels,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
    },
  });
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ id: string }>>
) {
  const { hostelData, imageUrls } = req.body;

  if (!hostelData || !hostelData.name || !hostelData.location || !hostelData.price) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, location, price',
    });
  }

  const id = await createHostel(hostelData, imageUrls || []);

  return res.status(201).json({
    success: true,
    data: { id },
    message: 'Hostel created successfully',
  });
}

// Apply all middleware using compose
export default compose(
  withCors,
  withRateLimit,
  withLogging,
  withErrorHandler
)(handler);

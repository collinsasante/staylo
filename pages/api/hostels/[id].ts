import type { NextApiRequest, NextApiResponse } from 'next';
import { getHostel, updateHostel, deleteHostel } from '../../../lib/db';
import { withCors, withErrorHandler } from '../../../lib/middleware';
import { ApiResponse, Hostel } from '../../../types';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Hostel | null>>
) {
  const { method, query } = req;
  const id = query.id as string;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Hostel ID is required',
    });
  }

  switch (method) {
    case 'GET':
      return handleGet(req, res, id);
    case 'PUT':
      return handlePut(req, res, id);
    case 'DELETE':
      return handleDelete(req, res, id);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({
        success: false,
        error: `Method ${method} not allowed`,
      });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Hostel | null>>,
  id: string
) {
  const hostel = await getHostel(id);

  if (!hostel) {
    return res.status(404).json({
      success: false,
      error: 'Hostel not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: hostel,
  });
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  id: string
) {
  const updates = req.body;

  await updateHostel(id, updates);

  return res.status(200).json({
    success: true,
    message: 'Hostel updated successfully',
  });
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  id: string
) {
  await deleteHostel(id);

  return res.status(200).json({
    success: true,
    message: 'Hostel deleted successfully',
  });
}

export default withCors(withErrorHandler(handler));

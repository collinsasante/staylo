import type { NextApiRequest, NextApiResponse } from 'next';
import { getInquiry, updateInquiryStatus, deleteInquiry } from '../../../lib/db';
import { withCors, withErrorHandler } from '../../../lib/middleware';
import { ApiResponse, Inquiry } from '../../../types';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Inquiry | null>>
) {
  const { method, query } = req;
  const id = query.id as string;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Inquiry ID is required',
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
  res: NextApiResponse<ApiResponse<Inquiry | null>>,
  id: string
) {
  const inquiry = await getInquiry(id);

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      error: 'Inquiry not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: inquiry,
  });
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  id: string
) {
  const { status } = req.body;

  if (!status || !['unread', 'read', 'contacted'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status. Must be: unread, read, or contacted',
    });
  }

  await updateInquiryStatus(id, status);

  return res.status(200).json({
    success: true,
    message: 'Inquiry status updated successfully',
  });
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
  id: string
) {
  await deleteInquiry(id);

  return res.status(200).json({
    success: true,
    message: 'Inquiry deleted successfully',
  });
}

export default withCors(withErrorHandler(handler));

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllInquiries, createInquiry, getInquiriesByStatus } from '../../../lib/db';
import {
  withCors,
  withErrorHandler,
  withRateLimit,
  withLogging,
  compose,
} from '../../../lib/middleware';
import {
  sendInquiryNotification,
  sendInquiryConfirmation,
} from '../../../lib/notifications';
import { ApiResponse, Inquiry } from '../../../types';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
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
  res: NextApiResponse<ApiResponse<Inquiry[]>>,
  _query: any
) {
  const { status } = _query;

  let inquiries: Inquiry[];

  if (status && ['unread', 'read', 'contacted'].includes(status)) {
    inquiries = await getInquiriesByStatus(status);
  } else {
    inquiries = await getAllInquiries();
  }

  return res.status(200).json({
    success: true,
    data: inquiries,
  });
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ id: string }>>
) {
  const inquiryData = req.body;

  if (
    !inquiryData.studentName ||
    !inquiryData.email ||
    !inquiryData.phone ||
    !inquiryData.hostelInterested ||
    !inquiryData.message
  ) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
  }

  const id = await createInquiry(inquiryData);

  // Send notifications (don't wait for them to complete)
  Promise.all([
    sendInquiryNotification(inquiryData),
    sendInquiryConfirmation({
      studentName: inquiryData.studentName,
      email: inquiryData.email,
      hostelInterested: inquiryData.hostelInterested,
    }),
  ]).catch((error) => {
    console.error('Error sending notifications:', error);
    // Don't fail the request if notifications fail
  });

  return res.status(201).json({
    success: true,
    data: { id },
    message: 'Inquiry submitted successfully',
  });
}

// Apply all middleware using compose
export default compose(
  withCors,
  withRateLimit,
  withLogging,
  withErrorHandler
)(handler);

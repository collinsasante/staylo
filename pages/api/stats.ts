import type { NextApiRequest, NextApiResponse } from 'next';
import { getDashboardStats } from '../../lib/db';
import { withCors, withErrorHandler } from '../../lib/middleware';
import { ApiResponse, DashboardStats } from '../../types';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DashboardStats>>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  }

  const stats = await getDashboardStats();

  return res.status(200).json({
    success: true,
    data: stats,
  });
}

export default withCors(withErrorHandler(handler));

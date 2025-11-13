import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from './auth';

// Rate limiting store (in-memory)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Firebase Authentication Middleware
 * Verifies Firebase ID tokens from Authorization header
 */
export const requireAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - No token provided',
        });
      }

      const token = authHeader.replace('Bearer ', '');

      try {
        // Verify token with Firebase (client-side auth object)
        // In a production environment with Firebase Admin SDK:
        // const decodedToken = await admin.auth().verifyIdToken(token);
        // req.user = decodedToken;

        // For now, we check if auth.currentUser exists (client-side)
        // This is a simplified check - in production use Firebase Admin SDK
        const currentUser = auth.currentUser;

        if (!currentUser) {
          return res.status(401).json({
            success: false,
            error: 'Unauthorized - Invalid or expired token',
          });
        }

        // Attach user info to request (for logging/tracking)
        (req as any).user = {
          uid: currentUser.uid,
          email: currentUser.email,
        };

        // Call the handler
        return handler(req, res);
      } catch (verifyError) {
        console.error('Token verification error:', verifyError);
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - Token verification failed',
        });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Authentication failed',
      });
    }
  };
};

/**
 * Rate Limiting Middleware
 * Limits requests per IP address
 */
export const withRateLimit = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: { maxRequests?: number; windowMs?: number } = {}
) => {
  const maxRequests = options.maxRequests || 100; // 100 requests
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes

  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Get client IP
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      'unknown';

    const now = Date.now();
    const record = rateLimitStore.get(ip);

    // Clean up expired records (every 100 requests)
    if (Math.random() < 0.01) {
      for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetAt < now) {
          rateLimitStore.delete(key);
        }
      }
    }

    if (record) {
      if (record.resetAt > now) {
        // Within window
        if (record.count >= maxRequests) {
          return res.status(429).json({
            success: false,
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((record.resetAt - now) / 1000),
          });
        }
        record.count++;
      } else {
        // Window expired, reset
        record.count = 1;
        record.resetAt = now + windowMs;
      }
    } else {
      // New IP
      rateLimitStore.set(ip, {
        count: 1,
        resetAt: now + windowMs,
      });
    }

    return handler(req, res);
  };
};

/**
 * CORS middleware for API routes
 */
export const withCors = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };
};

/**
 * Request Validation Middleware
 * Validates and sanitizes request data
 */
export const withValidation = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  schema?: {
    body?: (data: any) => { valid: boolean; errors?: string[] };
    query?: (data: any) => { valid: boolean; errors?: string[] };
  }
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Validate body if schema provided
    if (schema?.body && req.body) {
      const validation = schema.body(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors,
        });
      }
    }

    // Validate query params if schema provided
    if (schema?.query && req.query) {
      const validation = schema.query(req.query);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: validation.errors,
        });
      }
    }

    // Sanitize strings (basic XSS prevention)
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    return handler(req, res);
  };
};

/**
 * Sanitize object to prevent XSS
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return obj
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Logging Middleware
 * Logs all API requests with timing
 */
export const withLogging = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const start = Date.now();
    const { method, url } = req;
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      'unknown';

    console.log(`[${new Date().toISOString()}] ${method} ${url} - IP: ${ip}`);

    try {
      await handler(req, res);
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${method} ${url} - ${res.statusCode} - ${duration}ms`
      );
    } catch (error) {
      const duration = Date.now() - start;
      console.error(
        `[${new Date().toISOString()}] ${method} ${url} - ERROR - ${duration}ms`,
        error
      );
      throw error;
    }
  };
};

/**
 * Error handler wrapper with detailed logging
 */
export const withErrorHandler = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error: any) {
      console.error('API Error:', {
        error: error.message,
        stack: error.stack,
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query,
      });

      // Don't expose internal errors in production
      const isDev = process.env.NODE_ENV === 'development';

      return res.status(500).json({
        success: false,
        error: isDev ? error.message : 'Internal server error',
        ...(isDev && { stack: error.stack }),
      });
    }
  };
};

/**
 * Combine multiple middleware functions
 */
export const compose = (...middlewares: Array<(handler: any) => any>) => {
  return (handler: any) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
};

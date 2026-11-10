import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Error handling middleware
export async function errorMiddleware(
  req: NextRequest,
  next: () => Promise<Response>
): Promise<Response> {
  try {
    return await next();
  } catch (error: any) {
    // Extract relevant information for logging
    const userId = error.userId || (req as any).auth?.user?.id;
    const route = req.nextUrl.pathname;
    
    // Create error context for logging
    const errorContext = {
      route,
      userId,
      method: req.method,
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.ip,
      errorName: error.name,
      errorMessage: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    // Log the error with context
    await logger.error('Unhandled API error', errorContext);

    // Determine status code
    const statusCode = error.statusCode || error.status || 500;

    // Never expose sensitive information in production
    const isProd = process.env.NODE_ENV === 'production';
    const safeErrorMessage = isProd 
      ? 'Internal server error' 
      : error.message;

    // Return appropriate response
    return NextResponse.json(
      {
        error: safeErrorMessage,
        // Include requestId for debugging in development
        ...(isProd ? {} : { requestId: errorContext.timestamp })
      },
      { status: statusCode }
    );
  }
}

// Specific error handler for API routes
export function handleApiError(
  error: any,
  req: NextRequest
): NextResponse {
  // Extract request context
  const userId = (req as any).auth?.user?.id;
  const route = req.nextUrl.pathname;

  // Log error with context
  logger.error('API route error', {
    route,
    userId,
    method: req.method,
    errorName: error.name,
    errorMessage: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });

  // Determine appropriate status code
  let statusCode = 500;
  if (error.name === 'ValidationError') {
    statusCode = 400;
  } else if (error.name === 'AuthorizationError') {
    statusCode = 401;
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
  } else if (error.status) {
    statusCode = error.status;
  }

  // Never expose sensitive information in production
  const isProd = process.env.NODE_ENV === 'production';
  const safeErrorMessage = isProd 
    ? 'Internal server error' 
    : error.message;

  return NextResponse.json(
    {
      error: safeErrorMessage,
      // Include requestId for debugging in development
      ...(isProd ? {} : { requestId: Date.now() })
    },
    { status: statusCode }
  );
}

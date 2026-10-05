export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  // Log error internally for debugging
  console.error('[Unhandled Server Error]:', {
    message: err.message,
    name: err.name,
    path: req.originalUrl,
    method: req.method,
  });

  // Handle unique constraint violations from Postgres without exposing internal details
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'An account with this email address already exists. Please sign in instead.',
    });
  }

  // Handle foreign key or check violations
  if (err.code === '23503' || err.code === '23514') {
    return res.status(400).json({
      success: false,
      error: 'Invalid reference or constraint in submitted data.',
    });
  }

  // Default safe response
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 
      ? 'An unexpected error occurred while processing your request. Please try again shortly.' 
      : err.message || 'Operation failed',
  });
};

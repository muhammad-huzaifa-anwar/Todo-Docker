export const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' })
}

export const errorHandler = (err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(status).json({
    message: err.message || 'Server error',
  })
}
// Export the middleware functions
// This allows you to import them in your main server file and use them in the Express app
// Example usage in your main server file (e.g., app.js):

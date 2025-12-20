const { app, initializeApp } = require('./src/app');

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Initialize database and other services
    await initializeApp();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Aine Learning Aid Backend Server running on port ${PORT}`);
      console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
      console.log(`🤖 AI endpoints available at: http://localhost:${PORT}/api/ai`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { startServer };
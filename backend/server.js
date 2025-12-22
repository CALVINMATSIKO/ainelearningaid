const { app, initializeApp } = require('./src/app');

// Initialize the app
initializeApp().then(() => {
  console.log('App initialized successfully');

  // Start server in development mode
  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}).catch((error) => {
  console.error('Failed to initialize app:', error);
  process.exit(1);
});

// Export the app for Vercel serverless
module.exports = app;
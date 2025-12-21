const { app, initializeApp } = require('./src/app');

// Initialize the app for serverless
initializeApp().then(() => {
  console.log('App initialized for serverless deployment');
}).catch((error) => {
  console.error('Failed to initialize app:', error);
});

// Export the app for Vercel serverless
module.exports = app;
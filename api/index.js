const { app, initializeApp } = require('../backend/src/app');

// Initialize database on cold start
let initialized = false;

const handler = async (req, res) => {
  if (!initialized) {
    try {
      await initializeApp();
      initialized = true;
      console.log('App initialized for Vercel serverless');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
  return app(req, res);
};

module.exports = handler;
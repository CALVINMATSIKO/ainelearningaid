const { app, initializeApp } = require('./src/app');

// Initialize database on cold start
let initialized = false;

const handler = async (req, res) => {
  console.log('Vercel handler called for:', req.url);
  if (!initialized) {
    try {
      console.log('Initializing app...');
      await initializeApp();
      initialized = true;
      console.log('App initialized for Vercel serverless');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ error: 'Internal server error', details: error.message });
      return;
    }
  }
  try {
    return app(req, res);
  } catch (error) {
    console.error('App error:', error);
    res.status(500).json({ error: 'App error', details: error.message });
  }
};

module.exports = handler;
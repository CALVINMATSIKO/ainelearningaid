/**
 * Environment variable validation for production
 */

const requiredEnvVars = [
  'JWT_SECRET',
  'GROQ_API_KEY',
  'NODE_ENV'
];

const optionalEnvVars = [
  'PORT',
  'DATABASE_PATH',
  'OPENAI_API_KEY',
  'LOG_LEVEL',
  'FRONTEND_URL',
  'CACHE_TTL',
  'RATE_LIMIT_WINDOW',
  'RATE_LIMIT_MAX'
];

function validateEnvironment() {
  const missing = [];
  const warnings = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check optional variables and warn if not set in production
  if (process.env.NODE_ENV === 'production') {
    for (const envVar of optionalEnvVars) {
      if (!process.env[envVar]) {
        warnings.push(`${envVar} is not set (optional but recommended for production)`);
      }
    }
  }

  // Validate specific values
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }

  if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
    warnings.push('FRONTEND_URL should be set in production for CORS');
  }

  // Report issues
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('Please set these variables in your .env file or environment.');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Environment validation warnings:');
    warnings.forEach(warning => console.warn(`   - ${warning}`));
  }

  if (missing.length === 0) {
    console.log('✅ Environment variables validated successfully');
  }
}

module.exports = { validateEnvironment };
# Aine Learning Aid - Deployment Guide

This guide covers deploying the Aine Learning Aid application to production using Vercel or Netlify.

## Architecture Overview

- **Frontend**: React + TypeScript + Vite (static site)
- **Backend**: Node.js + Express + SQLite (serverless functions)
- **Database**: SQLite (file-based, suitable for low-traffic applications)

## Prerequisites

1. **Vercel Account** or **Netlify Account** (free tier available)
2. **GitHub Repository** with the project code
3. **Environment Variables** configured

## Environment Variables

### Backend (.env)
```bash
PORT=5000
DATABASE_PATH=./database/aine.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=production
LOG_LEVEL=info
FRONTEND_URL=https://your-frontend-domain.com
CACHE_TTL=900000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=50
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Deployment Options

### Option 1: Vercel (Recommended)

#### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration from `vercel.json`
3. Set environment variables in Vercel dashboard
4. Deploy

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Vercel Configuration
- Frontend builds automatically from `frontend/` directory
- Backend runs as serverless functions
- Static assets are served via Vercel's CDN

### Option 2: Netlify

#### Automatic Deployment
1. Connect your GitHub repository to Netlify
2. Netlify will use `netlify.toml` for configuration
3. Set environment variables in Netlify dashboard
4. Set build command: `npm run build --prefix frontend`
5. Set publish directory: `frontend/dist`
6. Deploy

#### Netlify Functions
- Backend code in `backend/` directory becomes serverless functions
- API routes are automatically prefixed with `/.netlify/functions/`

## Database Setup

### SQLite Limitations in Serverless
- **Vercel/Netlify**: File system is ephemeral
- **Data Persistence**: Database resets on function cold starts
- **Recommendation**: For production with data persistence, migrate to:
  - Vercel Postgres
  - PlanetScale
  - Supabase
  - Railway

### Initial Database Setup
```bash
# Run migrations (if using the migration system)
cd backend
npm run migrate

# Or initialize manually
npm run start  # This will create the database from init.sql
```

## Post-Deployment Configuration

### 1. Update CORS Origins
Update `FRONTEND_URL` in backend environment variables to match your deployed frontend domain.

### 2. Update API Base URL
Update `VITE_API_BASE_URL` in frontend environment variables.

### 3. Database Backups
```bash
# Manual backup
cd backend
npm run backup

# Backups are stored in backend/database/backups/
```

### 4. Health Checks
- Health endpoint: `https://your-domain.com/api/health`
- Check database connectivity and AI service status

## Monitoring and Maintenance

### Logs
- **Vercel**: View logs in dashboard or use `vercel logs`
- **Netlify**: View function logs in dashboard

### Performance
- Frontend: Use Vercel/Netlify analytics
- Backend: Monitor function execution times
- Database: Monitor query performance

### Scaling Considerations
- **Free Tier Limits**:
  - Vercel: 100GB bandwidth/month, 100 hours/month
  - Netlify: 100GB bandwidth/month, 125k functions/month
- **Paid Upgrades**: Available when limits are exceeded

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` matches your frontend domain
   - Check allowed origins in CORS configuration

2. **Database Connection**
   - SQLite may not persist in serverless environments
   - Consider cloud database for production data

3. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are listed in package.json

4. **Function Timeouts**
   - AI requests may take time; increase function timeout limits
   - Vercel: Max 30s (free), 5min (paid)
   - Netlify: Max 10s (free), 15min (paid)

### Environment Validation
The application includes environment variable validation. Check logs for warnings about missing or insecure configurations.

## Security Considerations

- **API Keys**: Store securely in environment variables
- **JWT Secrets**: Use strong, random secrets (min 32 characters)
- **Rate Limiting**: Configured to prevent abuse
- **CORS**: Restrict to your domains only
- **Headers**: Security headers configured via Helmet

## Cost Optimization

- **Caching**: Implemented for AI responses and static assets
- **Compression**: Gzip/brotli enabled
- **CDN**: Automatic via Vercel/Netlify
- **Database**: SQLite is free but limited; consider upgrades for growth

## Backup and Recovery

- **Automated Backups**: Run `npm run backup` regularly
- **Manual Recovery**: Use backup files to restore database
- **Data Export**: Consider regular data exports for safety

## Support

For issues:
1. Check deployment logs
2. Verify environment variables
3. Test locally with production settings
4. Review Vercel/Netlify documentation

---

**Note**: This is a free, educational tool. For high-traffic production use, consider upgrading to paid plans or optimizing the architecture further.
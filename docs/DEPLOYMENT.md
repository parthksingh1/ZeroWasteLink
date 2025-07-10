# 🚀 Deployment Guide

## Deployment Options

### 1. Vercel (Recommended for Frontend)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps
1. **Connect GitHub repository**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Configure environment variables**
   - Go to Vercel dashboard
   - Add environment variables from `.env`

3. **Deploy**
   - Push to main branch
   - Automatic deployment

#### Environment Variables
```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### 2. Railway (Recommended for Full Stack)

#### Prerequisites
- Railway account
- GitHub repository

#### Steps
1. **Connect GitHub repository**
   - Go to Railway dashboard
   - Connect GitHub repository

2. **Configure services**
   - Add MongoDB service
   - Add Node.js service

3. **Set environment variables**
   - Add all environment variables
   - Configure domains

### 3. Docker Deployment

#### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000 5000

CMD ["npm", "start"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/zerowaste
    depends_on:
      - mongo

  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### Deploy with Docker
```bash
docker-compose up -d
```

### 4. AWS Deployment

#### Prerequisites
- AWS account
- AWS CLI configured

#### Steps
1. **Create ECR repository**
   ```bash
   aws ecr create-repository --repository-name zerowaste-link
   ```

2. **Build and push Docker image**
   ```bash
   docker build -t zerowaste-link .
   docker tag zerowaste-link:latest account.dkr.ecr.region.amazonaws.com/zerowaste-link:latest
   docker push account.dkr.ecr.region.amazonaws.com/zerowaste-link:latest
   ```

3. **Deploy with ECS**
   - Create ECS cluster
   - Create task definition
   - Create service

### 5. DigitalOcean App Platform

#### Prerequisites
- DigitalOcean account
- GitHub repository

#### Steps
1. **Create new app**
   - Connect GitHub repository
   - Choose Node.js runtime

2. **Configure build settings**
   ```yaml
   build_command: npm run build
   run_command: npm start
   ```

3. **Set environment variables**
   - Add all required environment variables

## Environment Configuration

### Production Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zerowaste

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret

# AI Services
OPENAI_API_KEY=your-openai-key
DEEPSEEK_API_KEY=your-deepseek-key

# Image Storage
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Security
JWT_SECRET=your-jwt-secret
BCRYPT_ROUNDS=12

# Email (Production)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-key
```

## Database Setup

### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create cluster
3. Create database user
4. Get connection string
5. Add to environment variables

### Self-hosted MongoDB
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Create database
mongo zerowaste-link
```

## SSL/TLS Configuration

### Let's Encrypt (Free)
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/zerowaste-link
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring and Logging

### PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "zerowaste-link" -- start

# Monitor
pm2 monit

# Logs
pm2 logs
```

### Application Monitoring
- Use New Relic or Datadog
- Set up error tracking with Sentry
- Monitor performance metrics

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement service worker
- Optimize images

### Backend
- Use Redis for caching
- Implement database connection pooling
- Add rate limiting
- Use load balancer

## Security Checklist

- [ ] Enable HTTPS
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use CORS properly
- [ ] Keep dependencies updated
- [ ] Enable security headers
- [ ] Implement CSP (Content Security Policy)

## Backup Strategy

### Database Backup
```bash
# Create backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/zerowaste"

# Restore backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/zerowaste" dump/
```

### Automated Backups
- Use MongoDB Atlas automated backups
- Set up S3 backup for files
- Regular backup testing

## Troubleshooting

### Common Issues
1. **Database connection failed**
   - Check MongoDB URI
   - Verify network access
   - Check authentication

2. **Build failures**
   - Check Node.js version
   - Clear node_modules
   - Verify environment variables

3. **Performance issues**
   - Check database indexes
   - Monitor memory usage
   - Optimize queries

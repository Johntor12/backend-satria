# Deployment Guide - Satria Backend

This guide covers deploying the Satria backend from localhost development to production environments.

## Prerequisites

- Docker and Docker Compose installed locally
- Production database ready (PostgreSQL 15+)
- Domain name configured (if using custom domain)
- Cloud platform account (Railway, Render, AWS, GCP, or Heroku)

## Local Testing with Docker

### 1. Build Docker Image Locally

```bash
npm run docker:build
```

This creates a `satria-api:latest` Docker image using the multi-stage build process.

### 2. Start Services with Docker Compose

```bash
npm run docker:up
```

This starts both PostgreSQL and the API service. Services will:

- Create a new PostgreSQL database on port 5432
- Build and start the API on port 5000
- Run health checks to ensure both services are ready

### 3. View Logs

```bash
npm run docker:logs
```

### 4. Stop Services

```bash
npm run docker:down
```

### 5. Run Migrations in Docker

```bash
npm run docker:seed
```

## Cloud Deployment Options

### Option 1: Railway.app (Recommended - Easiest)

Railway is recommended for beginners as it automatically handles Docker deployment.

#### Steps:

1. **Sign up** at https://railway.app

2. **Create a new project** and select "Deploy from GitHub"

3. **Connect your GitHub repository**

4. **Add PostgreSQL plugin:**
   - Click "Add service" → Select "PostgreSQL"
   - Railway will automatically create and configure the database

5. **Configure environment variables:**
   - Click on your API service
   - Go to "Variables" tab
   - Add:
     ```
     NODE_ENV=production
     CORS_ORIGIN=https://yourdomain.com
     JWT_SECRET=[generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
     DATABASE_URL=$DATABASE_URL  # Railway provides this automatically
     PORT=5000
     ```

6. **Deploy:**
   - Railway automatically deploys on GitHub push
   - Watch deployment in "Deploy" tab

#### Important Notes:

- Railway detects Node.js project automatically
- Runs `npm install` and `npm run build` automatically
- Runs `npm start` by default
- Free tier includes $5/month credit

### Option 2: Render.com

#### Steps:

1. **Sign up** at https://render.com

2. **Create new Web Service:**
   - Select "Build and deploy from GitHub"
   - Connect repository

3. **Configure settings:**
   - **Name:** satria-api
   - **Environment:** Docker
   - **Region:** Choose closest to users
   - **Branch:** main

4. **Add Environment Variables:**
   - NODE_ENV=production
   - JWT_SECRET=[generate random key]
   - CORS_ORIGIN=https://yourdomain.com
   - DATABASE_URL=postgresql://user:password@host:port/dbname

5. **Add PostgreSQL Database:**
   - Create new PostgreSQL database instance
   - Use connection string in DATABASE_URL

6. **Deploy:**
   - Render will detect Dockerfile and build image
   - Runs migrations on deploy

#### Important Notes:

- Free tier available ($0/month, services spin down after 15 min inactivity)
- Paid tier ($7+/month) recommended for production

### Option 3: AWS EC2 + RDS

#### Steps:

1. **Create RDS PostgreSQL instance:**
   - Engine: PostgreSQL 15
   - Instance class: db.t3.micro (free tier)
   - Storage: 20GB gp2
   - Public accessibility: No (unless needed)
   - Security group: Allow inbound on 5432

2. **Create EC2 instance:**
   - AMI: Ubuntu 22.04 LTS
   - Instance type: t3.micro (free tier)
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

3. **SSH into EC2 instance:**

   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

4. **Install Docker:**

   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker ubuntu
   ```

5. **Clone repository:**

   ```bash
   git clone https://github.com/yourusername/backend-satria.git
   cd backend-satria
   ```

6. **Create .env file:**

   ```bash
   cp .env.example .env
   # Edit .env with production values:
   # DATABASE_URL=postgresql://user:password@rds-endpoint:5432/satria_db
   # JWT_SECRET=[generate random key]
   # NODE_ENV=production
   ```

7. **Deploy with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

8. **Set up reverse proxy (Nginx):**

   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add:

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

9. **Enable HTTPS with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 4: Heroku (Legacy but Still Works)

Heroku recently stopped free tier but paid dyos are available.

#### Steps:

1. **Install Heroku CLI:**

   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login and create app:**

   ```bash
   heroku login
   heroku create satria-api
   ```

3. **Add PostgreSQL:**

   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set environment variables:**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_jwt_secret_here
   heroku config:set CORS_ORIGIN=https://yourdomain.com
   ```

5. **Deploy:**

   ```bash
   git push heroku main
   ```

6. **Run migrations:**
   ```bash
   heroku run npm run migrate
   ```

## Post-Deployment Checklist

- [ ] Verify API health endpoint: `GET /api/health`
- [ ] Test authentication: `POST /api/auth/login`
- [ ] Test CORS is working from frontend domain
- [ ] Verify database connection with query
- [ ] Check application logs for errors
- [ ] Test all CRUD endpoints with JWT token
- [ ] Verify risk calculations are working
- [ ] Set up database backups
- [ ] Configure monitoring and alerting
- [ ] Set up CI/CD pipeline for automatic deployment

## Environment Variables Reference

| Variable       | Purpose                       | Example                               |
| -------------- | ----------------------------- | ------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string  | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`   | Secret for signing JWT tokens | 32+ character random string           |
| `NODE_ENV`     | Environment mode              | `production`                          |
| `PORT`         | Server port                   | `5000`                                |
| `CORS_ORIGIN`  | Allowed frontend domains      | `https://yourdomain.com`              |

## Generating JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Health Check Endpoint

Test if API is running:

```bash
curl https://yourdomain.com/api/health
```

Expected response:

```json
{ "status": "ok" }
```

## Troubleshooting

**Database Connection Error:**

- Verify DATABASE_URL format: `postgresql://user:password@host:port/database?schema=public`
- Check PostgreSQL is running and accessible
- Verify network security rules allow connection

**JWT Token Issues:**

- Ensure JWT_SECRET is consistent across deployments
- Check token expiration (currently 7 days)
- Verify Authorization header format: `Bearer <token>`

**CORS Errors:**

- Verify CORS_ORIGIN matches frontend domain exactly (include protocol)
- Check frontend is sending requests with credentials if needed

**Build Failures:**

- Review build logs for TypeScript errors
- Ensure all environment variables are set
- Check Dockerfile compatibility with your system

## Database Migrations in Production

Prisma migrations are run automatically by the `npm run deploy` script before starting the server.

To manually run migrations:

```bash
npm run migrate
```

To create new migration:

```bash
npm run migrate:dev -- --name migration_name
```

## Monitoring & Logging

Recommended logging services:

- **Railway/Render:** Built-in log viewing in dashboard
- **AWS:** CloudWatch Logs
- **Datadog:** APM and log aggregation
- **LogRocket:** Session replay and error tracking

## Backup Strategy

1. **Database backups:**
   - Railway: Automatic daily backups (7-day retention)
   - Render: Automatic backups included
   - AWS RDS: Enable automated backups (35-day retention recommended)

2. **Code backups:**
   - Use GitHub as primary backup
   - Consider private S3 bucket for additional copies

## Scaling Considerations

When traffic increases:

- **Vertical scaling:** Increase server memory/CPU
- **Horizontal scaling:** Run multiple API instances behind load balancer
- **Database:** Consider read replicas or connection pooling
- **Caching:** Add Redis for session/data caching

## Security Checklist

- [ ] Use HTTPS only (not HTTP)
- [ ] Enable HSTS headers
- [ ] Set secure JWT_SECRET (32+ characters)
- [ ] Use environment variables for secrets (never commit .env)
- [ ] Enable database encryption at rest
- [ ] Set up regular security updates
- [ ] Use strong database passwords
- [ ] Enable API rate limiting
- [ ] Set up Web Application Firewall (WAF) if using AWS

## Support & Resources

- Prisma Documentation: https://www.prisma.io/docs/
- Express Documentation: https://expressjs.com/
- Railway Help: https://railway.app/help
- PostgreSQL Documentation: https://www.postgresql.org/docs/

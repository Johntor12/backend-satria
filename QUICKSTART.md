# Quick Start Guide - Satria Backend

## Development Setup (Localhost)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your local PostgreSQL credentials:

```
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/satria_db"
JWT_SECRET="your-secret-key-here"
NODE_ENV=development
```

### 3. Setup Database

```bash
# Create database and run migrations
npx prisma migrate dev

# Seed with sample data
npm run seed
npm run seed:bookmarks
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Production Deployment (Docker)

### 1. Build Docker Image

```bash
npm run docker:build
```

### 2. Create Production .env File

```bash
cp .env.example .env
```

Update with production values:

```
DATABASE_URL="postgresql://user:password@your-host:5432/satria_db"
JWT_SECRET="[generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"]"
NODE_ENV=production
CORS_ORIGIN="https://yourdomain.com"
```

### 3. Start with Docker Compose

```bash
npm run docker:up
```

This starts:

- PostgreSQL database on port 5432
- API server on port 5000

### 4. View Logs

```bash
npm run docker:logs
```

### 5. Run Migrations

```bash
npm run docker:seed
```

### 6. Stop Services

```bash
npm run docker:down
```

## Available Commands

| Command                  | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Start dev server with hot reload        |
| `npm run build`          | Build TypeScript to JavaScript          |
| `npm run start`          | Run production server                   |
| `npm run seed`           | Populate database with sample companies |
| `npm run seed:bookmarks` | Populate database with sample bookmarks |
| `npm run migrate`        | Run Prisma migrations (production)      |
| `npm run migrate:dev`    | Run Prisma migrations (development)     |
| `npm run docker:build`   | Build Docker image                      |
| `npm run docker:up`      | Start services with docker-compose      |
| `npm run docker:down`    | Stop all services                       |
| `npm run docker:logs`    | View API container logs                 |
| `npm run docker:seed`    | Run seeding inside Docker container     |
| `npm run prod`           | Run production server locally           |

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires JWT token)

### Companies

- `POST /api/companies` - Create company (requires auth)
- `GET /api/companies` - Get all user's companies (requires auth)
- `GET /api/companies/:id` - Get company by ID (requires auth)
- `PATCH /api/companies/:id` - Update company (requires auth)
- `DELETE /api/companies/:id` - Delete company (requires auth)

### Bookmarks

- `POST /api/bookmarks` - Create bookmark (requires auth)
- `GET /api/bookmarks` - Get all user's bookmarks (requires auth)
- `GET /api/bookmarks/:id` - Get bookmark by ID (requires auth)
- `PATCH /api/bookmarks/:id` - Update bookmark (requires auth)
- `DELETE /api/bookmarks/:id` - Delete bookmark (requires auth)
- `GET /api/bookmarks/status/:status` - Get bookmarks by status (requires auth)

## Testing Authentication

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "password": "SecurePassword123!",
    "fullName": "John Doe"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

Response will include JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "username": "user123",
    "fullName": "John Doe"
  }
}
```

### 3. Use Token for Protected Endpoints

```bash
curl -X GET http://localhost:5000/api/companies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Ensure PostgreSQL is running. For Docker, use `npm run docker:up`.

### Port Already in Use

```
Error: listen EADDRINUSE :::5000
```

**Solution:** Change PORT in .env or kill existing process:

```bash
lsof -i :5000
kill -9 <PID>
```

### TypeScript Build Errors

```bash
npm run build
```

This will show detailed errors. Ensure all imports are correct.

### Docker Permission Denied

```
permission denied while trying to connect to the Docker daemon
```

**Solution:**

```bash
# Linux
sudo usermod -aG docker $USER
newgrp docker
# or use sudo
sudo npm run docker:build
```

## Database Access

### Local Development (via psql)

```bash
psql -U postgres -d satria_db -h localhost
```

### Via Prisma Studio

```bash
npx prisma studio
```

Opens web UI at `http://localhost:5555` to browse/edit database.

## Deployment Options

See `DEPLOYMENT.md` for detailed guides on deploying to:

- Railway (Recommended - easiest)
- Render.com
- AWS EC2 + RDS
- Heroku
- DigitalOcean
- GCP Cloud Run

## Support

For issues or questions:

1. Check logs: `npm run docker:logs`
2. Review error messages in .env configuration
3. Ensure all required environment variables are set
4. Check `DEPLOYMENT.md` for deployment-specific issues

# Render Deployment

This is the recommended zero-cost deployment path for the Satria backend when using Supabase as the production database.

## Why Render

- Free web service available for a real public backend
- Direct GitHub deploy from this repository
- Works well with the existing Express + Prisma setup
- Easy environment variable management

Render free web services spin down after inactivity. The next request will cold-start the service.

## Required Environment Variables

Set these in the Render dashboard:

```bash
DATABASE_URL=postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.kxhsuzulmnpixxyzeadj.supabase.co:5432/postgres?schema=public&sslmode=require
JWT_SECRET=your-32-plus-character-random-secret
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

Do not set `PORT` manually on Render. Render injects it automatically and the app already reads it.

## Repo Configuration

This repository includes [render.yaml](/home/johntor12/backend-satria/render.yaml) with the intended service settings:

- Service type: `web`
- Plan: `free`
- Build command: `npm ci && npm run build`
- Start command: `npm run migrate && npm start`
- Health check path: `/api/health`

## Deployment Steps

1. Push your latest changes to GitHub `main`.
2. Sign in to Render and choose `New +` -> `Blueprint`.
3. Select this repository: `Johntor12/backend-satria`.
4. Render will detect `render.yaml` and prepare the `satria-backend` web service.
5. Enter the required environment variables in the dashboard.
6. Create the service and wait for the first deploy to finish.
7. Open the generated `onrender.com` URL and call `/api/health`.

## Verification

After the first deploy, verify:

```bash
curl https://your-render-service.onrender.com/api/health
```

Expected result:

- `success: true`
- `database: connected`

Then test:

- login with an imported user
- `GET /api/company-collections` with a valid JWT
- one create request for bookmarks or companies

## Notes

- Production CORS is now restricted to the single value in `CORS_ORIGIN`.
- Seed scripts should not be used in production.
- Prisma migrations run at startup through the Render start command.

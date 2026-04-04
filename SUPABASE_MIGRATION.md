# Supabase Migration

This project can migrate its local PostgreSQL data into a Supabase-hosted Postgres instance without changing the application schema.

## Prerequisites

- `pg_dump`, `psql`, `npm`, and `npx` installed locally
- A reachable Supabase direct Postgres connection on port `5432`
- The Supabase database password for the `postgres` role
- A current local PostgreSQL database containing the data you want to move

## Connection Strings

Use the direct Supabase connection string with SSL required:

```bash
export SUPABASE_DATABASE_URL='postgresql://postgres:satria-database@db.kxhsuzulmnpixxyzeadj.supabase.co:5432/postgres?schema=public&sslmode=require'
```

Set the local database you want to export:

```bash
export LOCAL_DATABASE_URL='postgresql://postgres:postgres@localhost:5432/satria_db?schema=public'
```

## One-Command Migration

The repository includes a scripted migration flow that:

1. Applies Prisma migrations to Supabase
2. Dumps local data for `User`, `CompanyCollection`, `Bookmark`, and `BookmarkCompany`
3. Truncates those same tables on Supabase
4. Imports the local data dump
5. Prints verification counts

Run it from the repository root:

```bash
npm run migrate:supabase
```

## Manual Equivalent

If you want to run each step manually:

```bash
DATABASE_URL="$SUPABASE_DATABASE_URL" npx prisma migrate deploy
```

```bash
pg_dump "$LOCAL_DATABASE_URL" \
  --data-only \
  --no-owner \
  --no-privileges \
  -t '"User"' \
  -t '"CompanyCollection"' \
  -t '"Bookmark"' \
  -t '"BookmarkCompany"' \
  > /tmp/satria-data.sql
```

```bash
psql "$SUPABASE_DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
TRUNCATE TABLE "BookmarkCompany", "Bookmark", "CompanyCollection", "User" RESTART IDENTITY CASCADE;
SQL
```

```bash
psql "$SUPABASE_DATABASE_URL" -v ON_ERROR_STOP=1 -f /tmp/satria-data.sql
```

## Verification

Check row counts on Supabase:

```bash
psql "$SUPABASE_DATABASE_URL" -c 'SELECT COUNT(*) FROM "User";'
psql "$SUPABASE_DATABASE_URL" -c 'SELECT COUNT(*) FROM "CompanyCollection";'
psql "$SUPABASE_DATABASE_URL" -c 'SELECT COUNT(*) FROM "Bookmark";'
psql "$SUPABASE_DATABASE_URL" -c 'SELECT COUNT(*) FROM "BookmarkCompany";'
```

After updating your deployed app to use `SUPABASE_DATABASE_URL` as `DATABASE_URL`, test:

- `GET /api/health`
- Login for an imported user
- One create/read/update/delete flow for companies or bookmarks

## Notes

- This flow assumes Supabase can be treated as a replaceable target for this app's tables.
- It does not use Supabase Auth or Row Level Security.
- Prefer a fresh `pg_dump` from local Postgres over importing the checked-in `backup.sql` directly.

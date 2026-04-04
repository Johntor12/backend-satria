#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_SQL="$(mktemp /tmp/satria-supabase-data-XXXXXX.sql)"

cleanup() {
  rm -f "$TMP_SQL"
}

trap cleanup EXIT

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_env() {
  if [ -z "${!1:-}" ]; then
    echo "Missing required environment variable: $1" >&2
    exit 1
  fi
}

load_env_file() {
  local env_file="$1"
  if [ -f "$env_file" ]; then
    set -a
    # shellcheck disable=SC1090
    . "$env_file"
    set +a
  fi
}

strip_prisma_schema_param() {
  printf '%s' "$1" | sed -E 's/([?&])schema=public(&|$)/\1/g; s/[?&]$//; s/\?&/\?/g; s/\?$/ /' | tr -d '\n' | sed 's/ $//'
}

require_command pg_dump
require_command psql
require_command npx

load_env_file "$ROOT_DIR/.env"
load_env_file "$ROOT_DIR/.env.local"

if [ -z "${LOCAL_DATABASE_URL:-}" ] && [ -n "${DB_USER:-}" ] && [ -n "${DB_PASSWORD:-}" ] && [ -n "${DB_HOST:-}" ] && [ -n "${DB_PORT:-}" ] && [ -n "${DB_NAME:-}" ]; then
  LOCAL_DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
fi

require_env SUPABASE_DATABASE_URL
require_env LOCAL_DATABASE_URL

LOCAL_DATABASE_URL_PG="$(strip_prisma_schema_param "$LOCAL_DATABASE_URL")"
SUPABASE_DATABASE_URL_PG="$(strip_prisma_schema_param "$SUPABASE_DATABASE_URL")"

case "$SUPABASE_DATABASE_URL" in
  *sslmode=require*) ;;
  *)
    echo "SUPABASE_DATABASE_URL must include sslmode=require" >&2
    exit 1
    ;;
esac

echo "Applying Prisma migrations to Supabase..."
(
  cd "$ROOT_DIR"
  DATABASE_URL="$SUPABASE_DATABASE_URL" npx prisma migrate deploy
)

echo "Exporting local application data..."
pg_dump "$LOCAL_DATABASE_URL_PG" \
  --data-only \
  --no-owner \
  --no-privileges \
  -t '"User"' \
  -t '"CompanyCollection"' \
  -t '"Bookmark"' \
  -t '"BookmarkCompany"' \
  > "$TMP_SQL"

echo "Resetting target tables on Supabase..."
psql "$SUPABASE_DATABASE_URL_PG" -v ON_ERROR_STOP=1 <<'SQL'
TRUNCATE TABLE "BookmarkCompany", "Bookmark", "CompanyCollection", "User" RESTART IDENTITY CASCADE;
SQL

echo "Importing local data into Supabase..."
psql "$SUPABASE_DATABASE_URL_PG" -v ON_ERROR_STOP=1 -f "$TMP_SQL"

echo "Verifying imported row counts..."
psql "$SUPABASE_DATABASE_URL_PG" -v ON_ERROR_STOP=1 <<'SQL'
SELECT 'User' AS table_name, COUNT(*) AS row_count FROM "User"
UNION ALL
SELECT 'CompanyCollection' AS table_name, COUNT(*) AS row_count FROM "CompanyCollection"
UNION ALL
SELECT 'Bookmark' AS table_name, COUNT(*) AS row_count FROM "Bookmark"
UNION ALL
SELECT 'BookmarkCompany' AS table_name, COUNT(*) AS row_count FROM "BookmarkCompany";
SQL

echo "Supabase migration completed."

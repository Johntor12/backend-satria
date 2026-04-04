# Database Migration & Deployment Strategy

This guide covers safely migrating from development to production environments.

## Understanding Your Database Setup

### Current Schema (Existing)
Your production-ready database includes:

**User Model**
- id (unique identifier)
- email (unique)
- username (unique)
- password (hashed with bcrypt)
- fullName
- createdAt, updatedAt (timestamps)

**CompanyCollection Model**
- id (unique identifier)
- userId (foreign key to User)
- companyName
- Risk signals: etr_score, margin_score, rp_haven_score, debt_score, ownership_score, conduct_score
- Calculated: riskScore, riskTier
- createdAt, updatedAt

**Bookmark Model**
- id (unique identifier)
- userId (foreign key to User)
- name
- description (optional)
- status (PENDING, REVIEWING, COMPLETED)
- createdAt, updatedAt

**BookmarkCompany (Junction Table)**
- bookmarkId (foreign key to Bookmark)
- companyId (foreign key to CompanyCollection)
- bookmarkedAt (timestamp)

## Pre-Deployment Database Tasks

### 1. Create Production Database

**For PostgreSQL on your server:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create production database
CREATE DATABASE satria_db_prod;
CREATE USER satria_prod WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE satria_db_prod TO satria_prod;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO satria_prod;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO satria_prod;

# Exit psql
\q
```

**For Railway.app/Render.com:**
- Database is created automatically when you add PostgreSQL plugin
- Connection string provided in platform dashboard

### 2. Set Production DATABASE_URL

```bash
# Format for connection string
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public

# Example (never use this in production!)
# postgresql://satria_prod:MySecurePassword123!@db.example.com:5432/satria_db_prod?schema=public
```

## Deployment Scenarios

### Scenario 1: Fresh Production Deployment (New Database)

This is the **easiest** option - no existing data to migrate.

```bash
# 1. Set production environment
export NODE_ENV=production
export DATABASE_URL="postgresql://user:password@host:5432/db"
export JWT_SECRET="your-32-char-random-secret-here"

# 2. Build application
npm run build

# 3. Run migrations (creates all tables from scratch)
npm run migrate

# 4. Seed initial data (optional)
npm run seed
npm run seed:bookmarks

# 5. Test health endpoint
curl https://yourdomain.com/api/health
```

### Scenario 2: Migrating from Development to Production (Transfer Data)

If you have data in development that you want to keep:

```bash
# 1. Backup development database
pg_dump -U postgres -d satria_db > backup-dev-$(date +%Y%m%d).sql

# 2. Create production database (see section above)

# 3. Deploy new schema
npm run deploy

# 4. Export data from development
pg_dump -U postgres -d satria_db \
  -t "\"User\"" \
  -t "\"CompanyCollection\"" \
  -t "\"Bookmark\"" \
  -t "\"BookmarkCompany\"" \
  --data-only > data-export.sql

# 5. Import to production
psql -U satria_prod -d satria_db_prod < data-export.sql

# 6. Verify import
psql -U satria_prod -d satria_db_prod -c "SELECT COUNT(*) FROM \"User\";"
```

### Scenario 3: Existing Database (Schema Update)

If you already have a production database that needs schema updates:

```bash
# 1. BACKUP FIRST (always!)
pg_dump -U satria_prod -d satria_db_prod > backup-$(date +%Y%m%d_%H%M%S).sql

# 2. Apply migrations
npm run migrate

# 3. Verify no errors
# Check logs for any migration issues

# 4. Test endpoints with production data
curl -H "Authorization: Bearer $TOKEN" https://yourdomain.com/api/company-collections

# 5. If issues, RESTORE from backup
psql -U satria_prod -d satria_db_prod < backup-$(date +%Y%m%d_%H%M%S).sql
```

## Docker Migration Steps

### Local Testing (Recommended First Step)

```bash
# 1. Start Docker environment
npm run docker:up

# 2. Wait for postgres to be healthy (15-30 seconds)
sleep 30

# 3. Run migrations inside container
npm run docker:seed
npm run docker:seed:bookmarks

# 4. Test endpoints
curl http://localhost:5000/api/health

# 5. If successful, stop and proceed to production
npm run docker:down
```

### Production Docker Deployment

```bash
# 1. Build production image
npm run docker:build

# 2. Create production .env file
cp .env.example .env.prod
# Edit .env.prod with production values

# 3. Push to Docker registry (optional, for cloud platforms)
docker tag satria-api:latest your-registry/satria-api:latest
docker push your-registry/satria-api:latest

# 4. On production server, pull and start
docker pull your-registry/satria-api:latest
docker-compose -f docker-compose.prod.yml up -d

# 5. Run migrations
docker-compose exec api npm run migrate

# 6. Verify health
curl http://localhost:5000/api/health
```

## Verification After Migration

### 1. Database Connectivity
```bash
# Test from application
curl https://yourdomain.com/api/health
# Expected: { "success": true, "database": "connected" }
```

### 2. Tables Exist
```bash
psql -U satria_prod -d satria_db_prod -c "\dt"
# Should show: users, company_collections, bookmarks, bookmark_companies
```

### 3. Authentication Works
```bash
# Register new user
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123!",
    "fullName": "Test User"
  }'

# Login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 4. Protected Endpoints Work
```bash
# Get token from login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test protected endpoint
curl -X GET https://yourdomain.com/api/company-collections \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Data Isolation Works
```bash
# Create two users and verify data is separated

# User 1 creates company
TOKEN1="user1_token..."
curl -X POST https://yourdomain.com/api/company-collections \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{...}'

# User 2 gets companies (should not see User 1's data)
TOKEN2="user2_token..."
curl -X GET https://yourdomain.com/api/company-collections \
  -H "Authorization: Bearer $TOKEN2"
# Should return empty or only User 2's companies
```

## Rollback Procedure (If Something Goes Wrong)

### Step 1: Stop the Application
```bash
# Docker
npm run docker:down

# Or manually
docker-compose down
# Or kill process
kill -9 <PID>
```

### Step 2: Restore Database from Backup
```bash
psql -U satria_prod -d satria_db_prod < backup-$(date +%Y%m%d_%H%M%S).sql
```

### Step 3: Restart with Previous Version
```bash
# If using Docker
docker pull previous-image-version
docker-compose up -d

# Or redeploy previous code version
git checkout previous-commit-hash
npm run deploy
```

### Step 4: Investigate Issue
```bash
# Check logs
npm run docker:logs

# Check database state
psql -U satria_prod -d satria_db_prod -c "\d"

# Check application error logs
tail -f logs/application.log
```

## Migration Timing Recommendations

### Zero-Downtime Migration (Recommended)

1. **Blue-Green Deployment:**
   - Deploy new version to separate infrastructure
   - Test thoroughly with production data
   - Route traffic to new version
   - Keep old version as fallback

2. **Scheduled Maintenance Window:**
   - Inform users of 30-minute maintenance window
   - Stop all API connections
   - Run migrations
   - Restart service
   - Verify all systems
   - Communicate service restoration

3. **Canary Deployment:**
   - Route 5% of traffic to new version
   - Monitor for errors
   - Gradually increase to 100%
   - Easy rollback if issues

### Recommended Approach for Satria
Given your system size, **scheduled maintenance** is best:

```bash
# Schedule in off-peak hours (e.g., 2 AM)
# Send user notification 24 hours before

# During window:
1. Disable new requests (return 503 Maintenance)
2. Wait for in-flight requests to complete
3. Backup database
4. Run migrations
5. Seed data if needed
6. Run smoke tests
7. Re-enable API
8. Monitor for 1 hour
9. Communicate completion
```

## Monitoring After Migration

### Key Metrics to Watch

1. **Response Times**
   - Baseline: ~100ms
   - Alert if > 1s

2. **Error Rates**
   - Baseline: < 0.1%
   - Alert if > 1%

3. **Database Connections**
   - Monitor pool usage
   - Should be < 80% of max

4. **Disk Space**
   - Monitor database size
   - Plan for growth

### Health Check Dashboard
```bash
# Create simple monitoring script
curl https://yourdomain.com/api/health
# Response time < 500ms = healthy
# If > 1s, investigate database performance
```

## Common Migration Issues & Solutions

### Issue: "Database already exists"
```
ERROR: database "satria_db_prod" already exists
```
**Solution:** Use existing database or drop and recreate
```bash
# Drop existing (careful!)
dropdb -U postgres satria_db_prod

# Recreate
createdb -U postgres -O satria_prod satria_db_prod
```

### Issue: "Connection refused"
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running and DATABASE_URL is correct
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Verify connection string
echo $DATABASE_URL
```

### Issue: "Permission denied" on tables
```
ERROR: permission denied for relation users
```
**Solution:** Grant permissions to user
```bash
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO satria_prod;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO satria_prod;
```

### Issue: "Foreign key constraint failed"
```
ERROR: insert or update on table "company_collections" violates foreign key constraint
```
**Solution:** Ensure users exist before companies
```bash
# Check
SELECT COUNT(*) FROM "User";

# If 0, seed users first
npm run seed
```

## Best Practices Summary

✅ **DO:**
- Backup before any migration
- Test migrations locally first
- Run migrations with DATABASE_URL set
- Verify data after migration
- Monitor application after deployment
- Keep previous version as fallback
- Document all changes

❌ **DON'T:**
- Skip backups
- Migrate during peak hours
- Mix old and new code versions
- Ignore error messages
- Deploy without testing
- Use same database for dev and prod
- Commit secrets to git

## References

- Prisma Migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate
- PostgreSQL Backup: https://www.postgresql.org/docs/current/backup.html
- Database Best Practices: https://www.postgresql.org/docs/current/runtime.html

---

For platform-specific migration guides, see DEPLOYMENT.md

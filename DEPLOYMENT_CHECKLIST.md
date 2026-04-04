# 🚀 Production Deployment Checklist

Complete this checklist before deploying to production. Each item should be verified and checked off.

## Pre-Deployment (1-2 Days Before)

### Code & Build Verification

- [ ] All code changes committed to git
- [ ] No uncommitted files: `git status` shows clean
- [ ] Latest code pulled: `git pull origin main`
- [ ] TypeScript builds without errors: `npm run build`
- [ ] No linting errors: `npm run lint --if-present`
- [ ] Tests pass: `npm test --if-present`

### Documentation Review

- [ ] README.md updated with latest info
- [ ] API endpoints documented
- [ ] Environment variables documented in .env.example
- [ ] Deployment instructions clear
- [ ] Team members notified

### Security Audit

- [ ] No secrets in git: Check `.env` not committed
- [ ] Passwords use bcrypt hashing
- [ ] JWT_SECRET is 32+ characters
- [ ] CORS_ORIGIN set to correct domain
- [ ] NODE_ENV set to 'production'
- [ ] No console.log statements with sensitive data

### Database Preparation

- [ ] Production database created
- [ ] Backup of any existing data taken
- [ ] Connection string verified: `postgresql://user:pass@host:port/db`
- [ ] Database user permissions correct (GRANT commands)
- [ ] PostgreSQL version 15+ confirmed

## Deployment Day (Execution Phase)

### 48 Hours Before

- [ ] Notify team and stakeholders of deployment window
- [ ] Confirm downtime window (if needed)
- [ ] Brief team on rollback procedure
- [ ] Prepare rollback database backup

### 2 Hours Before

- [ ] Announce maintenance window to users
- [ ] Final backup of production database: `pg_dump -U user -d dbname > backup-$(date +%Y%m%d).sql`
- [ ] Verify rollback plan is accessible
- [ ] Team members standing by

### During Deployment

#### Step 1: Environment Setup

- [ ] Set environment variables
  ```bash
  export NODE_ENV=production
  export DATABASE_URL="postgresql://user:pass@host:port/db"
  export JWT_SECRET="your-32-character-secret"
  export CORS_ORIGIN="https://yourdomain.com"
  export PORT=5000
  ```

#### Step 2: Build Application

- [ ] Build application: `npm run build`
- [ ] Verify dist/ folder created
- [ ] Check for build errors

#### Step 3: Run Migrations

- [ ] Run migrations: `npm run migrate`
- [ ] Verify all tables created
- [ ] No migration errors in logs
- [ ] Database schema matches schema.prisma

#### Step 4: Seed Data (If Needed)

- [ ] Optional: `npm run seed` (creates sample data)
- [ ] Optional: `npm run seed:bookmarks`
- [ ] Verify seed completed successfully

#### Step 5: Start Application

- [ ] Start production server: `npm run prod`
- [ ] Server starts without errors
- [ ] Listening on port 5000
- [ ] No database connection errors

#### Step 6: Health Checks

- [ ] Test health endpoint: `curl http://localhost:5000/api/health`
- [ ] Response contains `"database": "connected"`
- [ ] Status code is 200

#### Step 7: Smoke Tests (Critical Paths)

- [ ] User registration: `POST /api/auth/register`
- [ ] User login: `POST /api/auth/login`
- [ ] Get current user: `GET /api/auth/me` (with token)
- [ ] Create company: `POST /api/company-collections` (with token)
- [ ] Get companies: `GET /api/company-collections` (with token)
- [ ] Create bookmark: `POST /api/bookmarks` (with token)
- [ ] Get bookmarks: `GET /api/bookmarks` (with token)

### After Service Restart

#### Monitoring Phase (First Hour)

- [ ] Monitor error logs: `npm run docker:logs`
- [ ] Response time normal (~100-200ms)
- [ ] No spike in error rate
- [ ] Database queries performing well
- [ ] Memory usage stable

#### Monitoring Phase (First Day)

- [ ] No unexpected errors in logs
- [ ] API response times consistent
- [ ] All endpoints functioning
- [ ] Users can login and access data
- [ ] Risk calculations working

## Post-Deployment (After 24 Hours)

### Verification Tests

- [ ] All endpoints tested with real data
- [ ] User data properly isolated
- [ ] Authentication tokens working
- [ ] Password hashing verified
- [ ] Risk scores calculated correctly
- [ ] Bookmarks display properly
- [ ] Database queries optimized

### Performance Check

- [ ] Page load times < 2 seconds
- [ ] API response times < 500ms
- [ ] Database connection pool stable
- [ ] Memory usage < 500MB
- [ ] CPU usage < 50%

### Security Verification

- [ ] No sensitive data in logs
- [ ] JWT tokens secure
- [ ] CORS working correctly
- [ ] Unauthorized requests blocked (401/403)
- [ ] SQL injection protection working

### Backup & Recovery

- [ ] Backup created and verified
- [ ] Backup stored safely (off-site)
- [ ] Recovery procedure tested
- [ ] Point-in-time restore tested

## Rollback Procedure (If Issues Occur)

### Immediate Actions

- [ ] STOP: Don't proceed with troubleshooting if critical
- [ ] NOTIFY: Tell team and stakeholders immediately
- [ ] ISOLATE: Remove from load balancer if applicable

### Step 1: Stop Current Service

```bash
# Docker
npm run docker:down

# Or manually stop process
kill -9 <PID>
```

### Step 2: Restore Previous Version

```bash
# Option A: From git
git checkout previous-working-commit
npm run build

# Option B: From backup
rm -rf dist/
# Redeploy from previous container image or artifact
```

### Step 3: Restore Database

```bash
# Restore from backup
psql -U satria_prod -d satria_db_prod < backup-20240115.sql

# Verify restoration
SELECT COUNT(*) FROM "User";
```

### Step 4: Start Previous Version

```bash
npm run prod
# or docker-compose up -d
```

### Step 5: Verify Rollback Success

- [ ] Health endpoint responds
- [ ] Users can login
- [ ] Data is intact
- [ ] No errors in logs

### Step 6: Post-Incident

- [ ] Document what went wrong
- [ ] Identify root cause
- [ ] Create GitHub issue to fix
- [ ] Update deployment procedure if needed
- [ ] Schedule post-mortem discussion

## Production Monitoring Setup

### Daily Tasks

- [ ] Check logs for errors
- [ ] Monitor database size growth
- [ ] Verify backups completed
- [ ] Review response times

### Weekly Tasks

- [ ] Check disk space usage
- [ ] Review user feedback
- [ ] Update dependencies if needed
- [ ] Test backup restoration

### Monthly Tasks

- [ ] Review performance metrics
- [ ] Update security patches
- [ ] Run full system test
- [ ] Check database optimization

## Success Criteria ✅

Your deployment is successful when:

✅ Application starts without errors
✅ Health endpoint responds with 200
✅ Database connectivity verified
✅ All smoke tests pass
✅ No critical errors in logs
✅ Response times < 500ms
✅ Users can login successfully
✅ Data is properly isolated per user
✅ All CRUD operations working
✅ Risk calculations correct
✅ No security warnings
✅ Backups created and verified

## Emergency Contacts

- **DevOps Lead:** [Phone/Email]
- **Database Admin:** [Phone/Email]
- **Security Team:** [Phone/Email]
- **Product Manager:** [Phone/Email]

## Post-Deployment Communication

### Notify Team

```
Subject: Satria Backend Deployment Complete ✅

Version: 1.0.0
Environment: Production
Time: [deployment-time]
Status: SUCCESS

Key changes:
- [List major changes]

Next steps:
- Monitoring enabled
- Backups verified
- Ready for production traffic

No user action required.
```

### Update Status Page

- Mark as "Operational"
- Add deployment notes
- Include end time

## Documentation Links

- 📖 [README.md](./README.md) - Complete project documentation
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Platform-specific deployment guides
- ⚡ [QUICKSTART.md](./QUICKSTART.md) - Quick reference guide
- 💾 [DATABASE_MIGRATION.md](./DATABASE_MIGRATION.md) - Migration procedures
- ✅ [PRODUCTION_READY.md](./PRODUCTION_READY.md) - Deployment summary

## Sign-Off

By checking below, you confirm the deployment was successful and ready for production:

- [ ] **DevOps Engineer:** Deployment completed successfully
  - Name: ********\_******** Date: **\_\_\_**

- [ ] **QA/Testing:** Smoke tests passed
  - Name: ********\_******** Date: **\_\_\_**

- [ ] **Database Admin:** Data integrity verified
  - Name: ********\_******** Date: **\_\_\_**

- [ ] **Product Manager:** Business requirements met
  - Name: ********\_******** Date: **\_\_\_**

---

**Remember:** When in doubt, rollback and debug! Production stability is more important than deployment speed.

Last Updated: 2024

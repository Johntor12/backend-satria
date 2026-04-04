# Satria Backend API

Production-ready Express.js backend with PostgreSQL, user authentication, company risk assessment, and bookmark management system.

## 🚀 Quick Start

### Development (Localhost)
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 3. Setup database
npx prisma migrate dev
npm run seed
npm run seed:bookmarks

# 4. Start dev server
npm run dev
```

Server runs on `http://localhost:5000`

### Production (Docker)
```bash
# 1. Build Docker image
npm run docker:build

# 2. Start services
npm run docker:up

# 3. View logs
npm run docker:logs

# 4. Stop services
npm run docker:down
```

## 📋 Features

- **User Authentication**
  - JWT-based authentication with 7-day expiration
  - Secure password hashing with bcrypt
  - User registration and login
  - Protected endpoints with role-based access control

- **Company Collection Management**
  - Full CRUD operations for company data
  - Risk assessment calculations with 6 weighted signals
  - Risk tier classification (CRITICAL, HIGH, MEDIUM, LOW)
  - User-isolated data (each user sees only their companies)

- **Bookmark System**
  - Create bookmarks with collection of companies
  - Many-to-many relationship between bookmarks and companies
  - Bookmark status tracking (PENDING, REVIEWING, COMPLETED)
  - User-isolated bookmarks

- **Database**
  - PostgreSQL 15 with Prisma ORM
  - Automatic migrations with `npx prisma migrate`
  - Data seeding with sample companies and bookmarks
  - Composite indexes for optimal query performance

- **API Design**
  - RESTful architecture with proper HTTP status codes
  - Standardized JSON responses
  - Error handling and validation
  - CORS support for cross-origin requests

- **Deployment Ready**
  - Docker containerization with multi-stage builds
  - docker-compose for local production testing
  - Health check endpoints for monitoring
  - Environment-based configuration

## 📁 Project Structure

```
backend-satria/
├── src/
│   ├── server.ts                 # Express app initialization
│   ├── config/
│   │   └── database.ts           # PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.ts     # Authentication logic
│   │   ├── companyCollectionController.ts
│   │   └── bookmarkCollectionController.ts
│   ├── middleware/
│   │   └── authMiddleware.ts     # JWT verification
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── companyCollection.ts
│   │   ├── bookmarkCollection.ts
│   │   └── health.ts
│   ├── utils/
│   │   ├── authUtils.ts          # JWT & bcrypt utilities
│   │   ├── riskCalculation.ts    # Risk score calculation
│   │   └── validators.ts
│   └── generated/
│       └── prisma/               # Generated Prisma client
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Company seeding
│   └── seed-bookmarks.ts         # Bookmark seeding
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD pipeline
├── Dockerfile                    # Container image definition
├── docker-compose.yml            # Local development setup
├── .env.example                  # Environment template
├── package.json
├── tsconfig.json
├── DEPLOYMENT.md                 # Deployment guide
├── QUICKSTART.md                 # Quick start guide
└── setup-production.sh           # Production setup script
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/auth/register` | Create new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Companies
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/company-collections` | Create company | ✅ |
| GET | `/api/company-collections` | Get all companies | ✅ |
| GET | `/api/company-collections/:id` | Get company by ID | ✅ |
| PATCH | `/api/company-collections/:id` | Update company | ✅ |
| DELETE | `/api/company-collections/:id` | Delete company | ✅ |

### Bookmarks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/bookmarks` | Create bookmark | ✅ |
| GET | `/api/bookmarks` | Get all bookmarks | ✅ |
| GET | `/api/bookmarks/:id` | Get bookmark by ID | ✅ |
| PATCH | `/api/bookmarks/:id` | Update bookmark | ✅ |
| DELETE | `/api/bookmarks/:id` | Delete bookmark | ✅ |
| GET | `/api/bookmarks/status/:status` | Get by status | ✅ |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## 🔐 Authentication

### Getting Started

1. **Register a new user:**
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

2. **Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

Response includes JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "user123",
    "fullName": "John Doe"
  }
}
```

3. **Use token for protected endpoints:**
```bash
curl -X GET http://localhost:5000/api/company-collections \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🧮 Risk Assessment

Risk scores are calculated based on 6 weighted signals:

| Signal | Weight | Range | Impact |
|--------|--------|-------|--------|
| ETR Score | 0.20 | 0-1000 | Environmental/ESG risk |
| Margin Score | 0.15 | 0-100 | Financial margin risk |
| RP Haven Score | 0.20 | 0-1000 | Risk paradises exposure |
| Debt Score | 0.15 | 0-100 | Leverage risk |
| Ownership Score | 0.15 | 0-100 | Ownership structure risk |
| Conduct Score | 0.15 | 0-100 | Historical conduct risk |

**Risk Tiers:**
- CRITICAL: Score > 750
- HIGH: Score 500-750
- MEDIUM: Score 250-500
- LOW: Score < 250

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm run start            # Run production server locally

# Database
npm run seed             # Seed companies sample data
npm run seed:bookmarks   # Seed bookmarks sample data
npm run migrate          # Run Prisma migrations (production)
npm run migrate:dev      # Run Prisma migrations (development)

# Docker
npm run docker:build     # Build Docker image
npm run docker:up        # Start services with docker-compose
npm run docker:down      # Stop all services
npm run docker:logs      # View API container logs
npm run docker:seed      # Run seeding inside Docker

# Production
npm run deploy           # Build and run migrations
npm run prod             # Run production server locally
```

## 📊 Database Schema

### User Model
```typescript
model User {
  id                String @id @default(cuid())
  email             String @unique
  username          String @unique
  password          String (hashed)
  fullName          String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  companies         CompanyCollection[]
  bookmarks         Bookmark[]
}
```

### CompanyCollection Model
```typescript
model CompanyCollection {
  id                String @id @default(cuid())
  userId            String
  companyName       String
  riskScore         Float
  riskTier          RiskTier
  
  // Risk signals (weighted calculation)
  etr_score         Float
  margin_score      Float
  rp_haven_score    Float
  debt_score        Float
  ownership_score   Float
  conduct_score     Float
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user              User @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookmarks         BookmarkCompany[]
}
```

### Bookmark Model
```typescript
model Bookmark {
  id                String @id @default(cuid())
  userId            String
  name              String
  description       String?
  status            BookmarkStatus @default(PENDING)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user              User @relation(fields: [userId], references: [id], onDelete: Cascade)
  companies         BookmarkCompany[]
}
```

## 🐳 Docker Deployment

### Local Testing
```bash
npm run docker:up
```

This starts:
- PostgreSQL 15 on port 5432
- API server on port 5000

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides on deploying to:
- **Railway.app** (Recommended - easiest)
- Render.com
- AWS EC2 + RDS
- Heroku
- DigitalOcean
- GCP Cloud Run

## 🔍 Health Checks

### Database Connection
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected",
  "databaseTime": "2024-01-15T10:30:00.000Z"
}
```

## 📝 Environment Variables

Required variables in `.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for signing JWT tokens | 32+ character random string |
| `NODE_ENV` | Environment mode | `production` or `development` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Allowed frontend domains | `https://yourdomain.com` |

### Generating JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚨 Error Handling

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Company retrieved |
| 201 | Created | New company created |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing JWT token |
| 403 | Forbidden | User doesn't own resource |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database connection failed |

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## 🧪 Testing Endpoints

### 1. Register and Login Flow
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test123!","fullName":"Test User"}'

# Login (get token)
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' | jq -r '.token')

echo "Token: $TOKEN"
```

### 2. Create Company
```bash
curl -X POST http://localhost:5000/api/company-collections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "etr_score": 350,
    "margin_score": 45,
    "rp_haven_score": 200,
    "debt_score": 60,
    "ownership_score": 70,
    "conduct_score": 55
  }'
```

### 3. Get Companies
```bash
curl -X GET http://localhost:5000/api/company-collections \
  -H "Authorization: Bearer $TOKEN"
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide for development
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide
- **[Prisma Documentation](https://www.prisma.io/docs/)** - Database ORM docs
- **[Express Documentation](https://expressjs.com/)** - Web framework docs

## 🐛 Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running and DATABASE_URL is correct.

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in .env or kill process: `lsof -i :5000 | kill -9 <PID>`

### JWT Token Invalid
```
Error: Unauthorized - Invalid token
```
**Solution:** Ensure JWT_SECRET is consistent and token hasn't expired (7 days).

### Docker Permission Denied
```
permission denied while trying to connect to the Docker daemon
```
**Solution:** Add user to docker group: `sudo usermod -aG docker $USER`

## 📞 Support

For issues or questions:
1. Check logs with `npm run docker:logs`
2. Review error messages and status codes
3. Verify all environment variables are set
4. See DEPLOYMENT.md for deployment-specific help

## 📄 License

ISC

## 👥 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

Built with ❤️ using Express.js, PostgreSQL, and TypeScript
### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=satria_db
```

### 4. Run Database Migrations

Apply the Prisma schema to your database:

```bash
npx prisma migrate dev --name initial_setup
```

### 5. Seed the Database (Optional)

Populate your database with sample data:

```bash
# Seed companies
npm run seed

# Seed bookmarks
npm run seed:bookmarks

# Or seed both
npm run seed && npm run seed:bookmarks
```

This will create sample data for testing and development.

### 6. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend-satria/
├── src/
│   ├── config/
│   │   └── database.ts          # PostgreSQL connection pool
│   ├── controllers/
│   │   └── companyCollectionController.ts  # Business logic for companies
│   ├── generated/
│   │   └── prisma/              # Generated Prisma client
│   ├── prisma/
│   │   └── client.ts            # Prisma client instance
│   ├── routes/
│   │   ├── companyCollection.ts # Company collection routes
│   │   └── health.ts            # Health check endpoint
│   └── server.ts                # Express app setup
├── prisma/
│   ├── migrations/              # Database migrations
│   ├── schema.prisma            # Prisma schema definition
│   ├── seed.ts                  # Database seeder script
│   └── config.ts                # Prisma configuration
├── dist/                         # Compiled TypeScript (generated)
├── .env                          # Local environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── nodemon.json                  # Nodemon configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with auto-reload (using nodemon)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server from compiled dist folder
- `npm run seed` - Populate database with sample CompanyCollection data
- `npm run seed:bookmarks` - Populate database with sample BookmarkCollection data

## 🔌 API Endpoints

### Health Check

- **GET** `/api/health`
- Returns server status and database connection status
- Response:
  ```json
  {
    "success": true,
    "message": "Server is healthy",
    "timestamp": "2026-03-31T12:00:00.000Z",
    "database": "connected",
    "databaseTime": "2026-03-31T12:00:00.000Z"
  }
  ```

### CompanyCollection API

#### Get All Companies

- **GET** `/api/company-collections`
- Returns all company collections
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "companyName": "TechCorp Industries",
        "companyNickname": "TechCorp",
        "sector": "Technology",
        "riskScore": 85,
        "riskTier": "Critical",
        "etr": 12,
        "gap": 8,
        "methods": ["Transfer Pricing", "Royalty Stripping"],
        "revenue": 2500000,
        "createdAt": "2026-03-31T12:00:00.000Z",
        "updatedAt": "2026-03-31T12:00:00.000Z"
      }
    ]
  }
  ```

#### Get Company by ID

- **GET** `/api/company-collections/:id`
- Returns a specific company collection
- Response: Same structure as above for single object

#### Create Company

- **POST** `/api/company-collections`
- Body:
  ```json
  {
    "companyName": "New Company Inc",
    "companyNickname": "NewCo",
    "sector": "Technology",
    "riskScore": 50,
    "riskTier": "Medium",
    "etr": 20,
    "gap": 5,
    "methods": ["Transfer Pricing"],
    "revenue": 1000000
  }
  ```

#### Update Company

- **PUT** `/api/company-collections/:id`
- Body: Same as create, all fields optional

#### Delete Company

- **DELETE** `/api/company-collections/:id`
- Response:
  ```json
  {
    "success": true,
    "message": "CompanyCollection deleted successfully"
  }
  ```

### BookmarkCollection API

#### Get All Bookmarks

- **GET** `/api/bookmark-collections`
- Returns all bookmark collections
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Prisma Documentation",
        "description": "Official Prisma ORM documentation and guides",
        "url": "https://www.prisma.io/docs",
        "createdAt": "2026-03-31T12:00:00.000Z",
        "updatedAt": "2026-03-31T12:00:00.000Z"
      }
    ]
  }
  ```

#### Get Bookmark by ID

- **GET** `/api/bookmark-collections/:id`
- Returns a specific bookmark collection

#### Create Bookmark

- **POST** `/api/bookmark-collections`
- Body:
  ```json
  {
    "name": "My Bookmark",
    "description": "Optional description",
    "url": "https://example.com"
  }
  ```

#### Update Bookmark

- **PUT** `/api/bookmark-collections/:id`
- Body: Same as create, all fields optional

#### Delete Bookmark

- **DELETE** `/api/bookmark-collections/:id`
- Response:
  ```json
  {
    "success": true,
    "message": "BookmarkCollection deleted successfully"
  }
  ```

## 🗄️ Database Connection

The application uses a PostgreSQL connection pool for efficient database management. The pool is configured in `src/config/database.ts` and automatically handles:

- Connection pooling
- Error handling
- Idle client cleanup

## 🔧 Development Tips

### Testing Database Connection

Once your server is running, test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

### Checking Logs

Development logs will show in the terminal with timestamps and request information.

### Adding New Routes

1. Create a new file in `src/routes/` (e.g., `users.ts`)
2. Define your routes using Express Router
3. Import and register in `src/server.ts`:

```typescript
import usersRoutes from "./routes/users";
app.use("/api/users", usersRoutes);
```

## 📦 Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **cors** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management
- **typescript** - TypeScript language support
- **ts-node** - TypeScript execution for Node.js
- **nodemon** - Auto-reload during development

## 🔐 Security Notes

- Never commit `.env` file to version control
- Use `.env.example` as a template for new developers
- Always validate and sanitize user input
- Use parameterized queries to prevent SQL injection
- Consider adding authentication middleware for protected routes

## 📝 Next Steps

1. Create database schema and tables
2. Add more route handlers as needed
3. Implement database queries in route handlers
4. Add request validation middleware
5. Set up error handling and logging
6. Add unit tests
7. Configure CORS for specific domains in production

## 🐛 Troubleshooting

### Database Connection Failed

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `createdb satria_db`

### Port Already in Use

- Change the PORT in `.env` file
- Or kill the process using the port: `lsof -ti:5000 | xargs kill -9`

### TypeScript Errors

- Run `npm run build` to check for compilation errors
- Ensure all imports are correct
- Check TypeScript version: `npx tsc --version`

## 📄 License

ISC

---

Happy coding! 🎉

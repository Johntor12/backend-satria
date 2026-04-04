#!/bin/bash
# Production Deployment Setup Script
# This script helps set up the backend for production deployment

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║      Satria Backend - Production Deployment Setup             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_status "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js is not installed"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_status "npm installed: $NPM_VERSION"
else
    print_error "npm is not installed"
    exit 1
fi

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_status "Docker installed: $DOCKER_VERSION"
else
    print_warning "Docker is not installed (required for containerized deployment)"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    DC_VERSION=$(docker-compose --version)
    print_status "Docker Compose installed: $DC_VERSION"
else
    print_warning "Docker Compose is not installed (required for containerized deployment)"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "Step 1: Install Dependencies"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
    print_status "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "Step 2: Generate JWT Secret"
echo "═══════════════════════════════════════════════════════════════"
echo ""

JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
print_status "Generated JWT_SECRET: ${JWT_SECRET:0:16}..."

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "Step 3: Configure Environment Variables"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    print_status ".env file created"
    echo ""
    echo "Please edit .env with your production values:"
    echo "  - DATABASE_URL: PostgreSQL connection string"
    echo "  - CORS_ORIGIN: Your frontend domain"
    echo ""
    print_warning "Edit .env before proceeding with deployment"
    echo ""
    echo "Current .env template:"
    cat .env
else
    print_status ".env file already exists"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "Step 4: Build TypeScript"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "Building TypeScript to JavaScript..."
npm run build
print_status "Build completed successfully"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "Step 5: Docker Setup"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if command -v docker &> /dev/null; then
    read -p "Do you want to build Docker image? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Building Docker image..."
        npm run docker:build
        print_status "Docker image built: satria-api:latest"
    fi
else
    print_warning "Docker not installed, skipping Docker build"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "Production Deployment Setup Summary"
echo "═══════════════════════════════════════════════════════════════"
echo ""

print_status "Prerequisites checked"
print_status "Dependencies installed"
print_status "TypeScript built successfully"
print_status "Environment configured"

echo ""
echo "Next steps:"
echo ""
echo "1. Edit .env with production values:"
echo "   nano .env"
echo ""
echo "2. Choose your deployment option:"
echo ""
echo "   Option A: Local Docker (testing only):"
echo "   npm run docker:up"
echo ""
echo "   Option B: Railway.app (recommended):"
echo "   - Push to GitHub"
echo "   - Connect repo at https://railway.app"
echo "   - Add PostgreSQL plugin"
echo "   - Set environment variables"
echo ""
echo "   Option C: Render.com:"
echo "   - Push to GitHub"
echo "   - Create Web Service at https://render.com"
echo "   - Connect GitHub repo"
echo "   - Add PostgreSQL database"
echo ""
echo "   Option D: AWS EC2 + RDS:"
echo "   - SSH into EC2 instance"
echo "   - Run: docker-compose up -d"
echo ""
echo "3. Run database migrations:"
echo "   npm run migrate"
echo ""
echo "4. Seed database (optional):"
echo "   npm run seed"
echo "   npm run seed:bookmarks"
echo ""
echo "5. Test health endpoint:"
echo "   curl https://yourdomain.com/api/health"
echo ""
echo "For detailed deployment guide, see DEPLOYMENT.md"
echo ""

print_status "Setup complete! 🎉"

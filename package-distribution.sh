#!/bin/bash

# Configuration
PACKAGE_NAME="admin-dashboard"
VERSION="1.0.0"
DIST_DIR="dist"

echo "📦 Creating distribution package..."

# Create distribution directory
mkdir -p $DIST_DIR

# Copy necessary files
echo "📋 Copying files..."
cp -r frontend $DIST_DIR/
cp -r admin-backend $DIST_DIR/
cp docker-compose.yml $DIST_DIR/
cp docker-compose.prod.yml $DIST_DIR/
cp deploy.sh $DIST_DIR/
cp -r deploy $DIST_DIR/

# Remove unnecessary files to reduce size
echo "🧹 Cleaning up unnecessary files..."
find $DIST_DIR -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find $DIST_DIR -name ".git" -type d -exec rm -rf {} + 2>/dev/null || true
find $DIST_DIR -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find $DIST_DIR -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find $DIST_DIR -name "*.log" -delete 2>/dev/null || true

# Create README for distribution
cat > $DIST_DIR/README.md << 'EOF'
# Admin Dashboard - Distribution Package

## 🚀 Quick Start

### Prerequisites
- Docker và Docker Compose

### Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Setup
1. Setup environment: `cd admin-backend && cp env.example .env`
2. Edit `.env` file with your configuration
3. Run: `docker-compose up --build -d`

### Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

## 📋 Files Structure
- `frontend/` - Next.js frontend application
- `admin-backend/` - NestJS backend API
- `docker-compose.yml` - Development setup
- `docker-compose.prod.yml` - Production setup
- `deploy.sh` - Quick deploy script
- `deploy/` - Deployment documentation

## 🔧 Management
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs

# Restart
docker-compose restart
```
EOF

# Make scripts executable
chmod +x $DIST_DIR/deploy.sh

# Create archive
echo "📦 Creating archive..."
tar -czf "${PACKAGE_NAME}-${VERSION}.tar.gz" $DIST_DIR

# Cleanup
rm -rf $DIST_DIR

echo "✅ Distribution package created: ${PACKAGE_NAME}-${VERSION}.tar.gz"
echo ""
echo "📋 To share with others:"
echo "1. Send the .tar.gz file"
echo "2. Recipient extracts and runs ./deploy.sh"
echo "3. Or manually follows the README instructions" 
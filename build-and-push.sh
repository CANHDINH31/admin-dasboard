#!/bin/bash

# Configuration
REGISTRY="your-registry"  # Thay đổi thành registry của bạn (Docker Hub, AWS ECR, etc.)
FRONTEND_IMAGE="admin-dashboard-frontend"
BACKEND_IMAGE="admin-dashboard-backend"
VERSION="latest"

echo "🚀 Building and pushing Docker images..."

# Build frontend image
echo "📦 Building frontend image..."
cd frontend
docker build -t $FRONTEND_IMAGE:$VERSION .
docker tag $FRONTEND_IMAGE:$VERSION $REGISTRY/$FRONTEND_IMAGE:$VERSION
cd ..

# Build backend image
echo "📦 Building backend image..."
cd admin-backend
docker build -t $BACKEND_IMAGE:$VERSION .
docker tag $BACKEND_IMAGE:$VERSION $REGISTRY/$BACKEND_IMAGE:$VERSION
cd ..

# Push images
echo "📤 Pushing images to registry..."
docker push $REGISTRY/$FRONTEND_IMAGE:$VERSION
docker push $REGISTRY/$BACKEND_IMAGE:$VERSION

echo "✅ Images pushed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update docker-compose.yml with your registry URLs"
echo "2. Share the deployment files with others"
echo "3. Or deploy to cloud platform" 
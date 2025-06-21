#!/bin/bash

echo "🚀 Admin Dashboard - Quick Deploy"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Setup environment variables
echo "📝 Setting up environment variables..."
if [ ! -f admin-backend/.env ]; then
    cp admin-backend/env.example admin-backend/.env
    echo "✅ Created .env file from template"
    echo "⚠️  Please edit admin-backend/.env and update JWT_SECRET!"
else
    echo "✅ .env file already exists"
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5000"
    echo "   API Docs: http://localhost:5000/api/docs"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs: docker-compose logs"
    echo "   Stop services: docker-compose down"
    echo "   Restart: docker-compose restart"
else
    echo "❌ Some services failed to start. Check logs:"
    docker-compose logs
fi 
#!/bin/bash

# Build Docker image for Next.js frontend
echo "Building Next.js frontend Docker image..."

# Build the image
docker build -t admin-dashboard-frontend .

echo "Build completed!"
echo "To run the container:"
echo "docker run -p 3000:3000 admin-dashboard-frontend" 
#!/bin/bash

echo "Setting up environment variables for backend..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from env.example..."
    cp env.example .env
    echo "✅ .env file created successfully!"
    echo "⚠️  Please edit .env file and update the values, especially JWT_SECRET!"
else
    echo "✅ .env file already exists!"
fi

echo ""
echo "Environment variables setup complete!"
echo "Make sure to update the following in your .env file:"
echo "- JWT_SECRET: Change to a secure secret key"
echo "- MONGODB_URI: Update if using different database"
echo "- CORS_ORIGIN: Update if frontend runs on different port" 
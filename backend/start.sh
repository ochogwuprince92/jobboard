#!/bin/bash

# Job Board Backend Start Script

echo "🚀 Starting Job Board Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Please run: python3 -m venv venv"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo "⚠️  .env file not found!"
    echo "Copying from .env.example..."
    cp ../.env.example ../.env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Run migrations
echo "📦 Running migrations..."
python manage.py migrate

# Start the development server
echo "✅ Starting Django development server..."
python manage.py runserver

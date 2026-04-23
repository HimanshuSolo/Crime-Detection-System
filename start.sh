#!/bin/bash
# Quick start script for Crime Detection System

echo "🚀 Starting Crime Detection System..."
echo ""

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🪟 Windows detected. Using PowerShell..."
    
    # Start Django backend
    echo "📦 Starting Django Backend (Port 8000)..."
    Start-Process powershell -ArgumentList "cd Website; .\.venv\Scripts\Activate.ps1; python manage.py runserver"
    
    # Wait a moment
    Start-Sleep -Seconds 3
    
    # Start Next.js frontend
    echo "🎨 Starting Next.js Frontend (Port 3000)..."
    Start-Process powershell -ArgumentList "cd frontend; npm run dev"
    
    echo "✅ Both services started!"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
else
    echo "🐧 Unix/Linux/macOS detected..."
    
    # Start Django backend
    echo "📦 Starting Django Backend (Port 8000)..."
    cd Website
    source .venv/bin/activate
    python manage.py runserver &
    
    # Wait a moment
    sleep 3
    
    # Start Next.js frontend
    echo "🎨 Starting Next.js Frontend (Port 3000)..."
    cd ../frontend
    npm run dev &
    
    echo "✅ Both services started!"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
    
    # Keep script running
    wait
fi

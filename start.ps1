# PowerShell Startup Script for Crime Detection System
# Run this with: powershell -ExecutionPolicy Bypass -File .\start.ps1

Write-Host "🚀 Starting Crime Detection System..." -ForegroundColor Cyan
Write-Host ""

# Function to start Django
function Start-Django {
    Write-Host "📦 Starting Django Backend (Port 8000)..." -ForegroundColor Green
    $djangoProcess = Start-Process -NoNewWindow -PassThru -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Website'; & '.\.venv\Scripts\Activate.ps1'; python manage.py runserver"
    return $djangoProcess
}

# Function to start Next.js
function Start-NextJS {
    Write-Host "🎨 Starting Next.js Frontend (Port 3000)..." -ForegroundColor Green
    $nextProcess = Start-Process -NoNewWindow -PassThru -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
    return $nextProcess
}

try {
    # Check if backend venv exists
    if (-Not (Test-Path "Website\.venv")) {
        Write-Host "⚠️  Virtual environment not found. Creating..." -ForegroundColor Yellow
        cd Website
        python -m venv .venv
        & ".\.venv\Scripts\Activate.ps1"
        pip install -r requirements.txt
        cd ..
    }
    
    # Check if frontend node_modules exists
    if (-Not (Test-Path "frontend\node_modules")) {
        Write-Host "⚠️  Node modules not found. Installing..." -ForegroundColor Yellow
        cd frontend
        npm install
        cd ..
    }
    
    # Start both services
    $django = Start-Django
    Start-Sleep -Seconds 5
    $nextjs = Start-NextJS
    
    Write-Host ""
    Write-Host "✅ Both services started!" -ForegroundColor Green
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   Backend:  http://localhost:8000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop services..." -ForegroundColor Yellow
    Write-Host ""
    
    # Wait for user to stop
    while ($true) {
        Start-Sleep -Seconds 1
        if (-Not (Get-Process -Id $django.Id -ErrorAction SilentlyContinue)) {
            Write-Host "Django process stopped." -ForegroundColor Red
            break
        }
    }
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
finally {
    Write-Host "Cleaning up..." -ForegroundColor Yellow
    try { Stop-Process -Id $django.Id -ErrorAction SilentlyContinue }
    catch { }
    try { Stop-Process -Id $nextjs.Id -ErrorAction SilentlyContinue }
    catch { }
    Write-Host "✅ Services stopped." -ForegroundColor Green
}

# Setup Guide for Crime Detection System (Restructured)

## Overview

Your crime detection system has been restructured with:
- **Frontend**: Next.js (modern React framework)
- **Backend**: Django (unchanged)
- **ML Model**: TensorFlow/Keras (unchanged)

## Prerequisites

Before starting, ensure you have:

```bash
# Node.js 18+
node --version

# Python 3.8+
python --version

# Git (optional)
git --version
```

## Installation Steps

### 1. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Run development server
npm run dev
```

**Expected output:**
```
> Next.js 14.0.0
> Local:        http://localhost:3000
```

### 2. Backend Setup (Django)

Open a **new terminal/PowerShell** window:

```bash
cd Website

# Create virtual environment (first time only)
python -m venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations (first time)
python manage.py migrate

# Run development server
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
```

## Running Both Services

### Option 1: Manual (Recommended for Development)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd Website
# Activate venv if not already active
.\.venv\Scripts\activate
python manage.py runserver
```

### Option 2: Using Startup Script (Windows)

```powershell
# Run PowerShell script
.\start.ps1
```

### Option 3: Docker (Recommended for Production)

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Verify Installation

1. **Frontend:** Open http://localhost:3000
   - Should see home page with "Crime Detection System"

2. **Backend:** Open http://localhost:8000
   - Should see Django admin interface

3. **API Connection:** Try uploading a video
   - Frontend should be able to send request to backend

## Common Issues

### CORS Errors
If frontend can't connect to backend:

1. Check `Website/Website/settings.py` has CORS configuration:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

2. Install django-cors-headers if missing:
```bash
pip install django-cors-headers
```

3. Restart Django server

### Port Already in Use
If port 3000 or 8000 is already in use:

```bash
# Next.js on different port
npm run dev -- -p 3001

# Django on different port
python manage.py runserver 8001
```

Then update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### ModuleNotFoundError
If you see missing module errors:

```bash
cd Website
pip install -r requirements.txt
```

### Node Modules Issues
If frontend has issues:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Project Structure After Restructure

```
crime-detection-system/
├── frontend/                        ← Next.js Frontend (NEW)
│   ├── app/                         ← Pages and layouts
│   ├── public/                      ← Static files
│   ├── package.json                 ← Dependencies
│   └── .env.local                   ← API configuration
│
├── Website/                         ← Django Backend (EXISTING)
│   ├── core/                        ← Django app
│   ├── manage.py                    ← Django CLI
│   ├── requirements.txt             ← Python dependencies
│   └── .venv/                       ← Virtual environment
│
├── Machine Learning/                ← ML Models (EXISTING)
│   ├── model_train.ipynb
│   └── Models/
│
├── docker-compose.yml               ← Docker configuration (NEW)
├── RESTRUCTURE.md                   ← Restructuring guide (NEW)
└── start.ps1                        ← Quick start script (NEW)
```

## Next Steps

1. ✅ Setup frontend and backend
2. ✅ Verify both are running
3. ✅ Test video upload at http://localhost:3000/analyze
4. ✅ Check live stream at http://localhost:3000/stream
5. ✅ Review logs if issues occur

## Configuration

### Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`Website/.env` - if using django-environ):
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Development Workflow

### Making Changes

**Frontend Changes:**
- Edit files in `frontend/app/` or `frontend/components/`
- Next.js hot-reloads automatically

**Backend Changes:**
- Edit files in `Website/core/`
- Django auto-reloads on save

### Adding Dependencies

**Frontend:**
```bash
cd frontend
npm install package-name
```

**Backend:**
```bash
cd Website
pip install package-name
pip freeze > requirements.txt
```

## Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd Website
python manage.py collectstatic
gunicorn Website.wsgi:application
```

### Using Docker

```bash
# Build images
docker-compose build

# Run services
docker-compose up -d

# View status
docker-compose ps
```

## Support

- **Frontend Issues**: Check `frontend/README.md`
- **Backend Issues**: Check Django logs with `python manage.py runserver --verbose`
- **ML Issues**: Check ML models in `Machine Learning/Models/`

## Troubleshooting Commands

```bash
# Clear Next.js cache
rm -rf frontend/.next

# Check Python version
python --version

# Check Node version
npm --version

# Test API endpoint
curl http://localhost:8000/api/

# Check if ports are in use
# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```

---

**Happy Coding! 🚀**

For more details, see:
- [RESTRUCTURE.md](RESTRUCTURE.md) - Full restructuring guide
- [frontend/README.md](frontend/README.md) - Frontend documentation
- [Website/README.md](Website/README.md) - Backend documentation

# Crime Detection System - Restructured

Complete crime detection system with **Next.js Frontend** and **Django Backend**.

## 📁 Project Structure

```
crime-detection-system/
├── frontend/                    # Next.js Frontend (Port 3000)
│   ├── app/                     # Next.js app directory
│   ├── components/              # Reusable components
│   ├── public/                  # Static assets
│   ├── package.json             # Frontend dependencies
│   └── README.md                # Frontend documentation
│
├── Website/                     # Django Backend (Port 8000)
│   ├── core/                    # Core Django app
│   ├── templates/               # Django templates (deprecated)
│   ├── static/                  # Static files
│   ├── media/                   # Uploaded media
│   ├── manage.py                # Django management
│   └── requirements.txt          # Backend dependencies
│
├── Machine Learning/            # ML Models & Training
│   ├── model_train.ipynb        # Model training notebook
│   ├── Models/                  # Trained models
│   └── README.md
│
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.8+ (for backend)
- **pip** (Python package manager)

### Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

### Backend Setup (Django)

```bash
# Navigate to backend
cd Website

# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

## 🔌 API Integration

The Next.js frontend communicates with Django backend:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/` | POST | Upload and analyze video |
| `/getstream/` | GET | Get live stream |
| `/gettokenstream/<token>/` | GET | Get stream by token |

### Configure API URL

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 Features

### Frontend (Next.js)
- ✅ Modern React-based UI
- ✅ Video upload interface
- ✅ Real-time live streaming
- ✅ Responsive design
- ✅ Token-based stream sharing

### Backend (Django)
- ✅ Video processing
- ✅ ML model integration
- ✅ Real-time frame analysis
- ✅ Stream serving (MJPEG)
- ✅ Database storage

### ML Model
- ✅ CNN-based crime detection
- ✅ Real-time frame analysis
- ✅ Confidence scoring

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run linter
```

### Backend Development
```bash
cd Website
python manage.py runserver      # Start dev server
python manage.py makemigrations # Create migrations
python manage.py migrate        # Apply migrations
```

## 📦 Deployment

### Using Docker (Recommended)

```bash
# Build and run both services
docker-compose up -d
```

### Manual Deployment

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
gunicorn Website.wsgi:application --bind 0.0.0.0:8000
```

## 🔐 CORS Configuration

Django is pre-configured to accept requests from Next.js frontend. Update `Website/Website/settings.py` if needed:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## 📊 Database

Django uses SQLite by default (located at `Website/db.sqlite3`).

To use PostgrSQL or MySQL, update `Website/Website/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'crime_detection',
        'USER': 'postgres',
        # ... other config
    }
}
```

## 🎯 Key Endpoints

### Video Upload & Analysis
```
POST /api/
Content-Type: multipart/form-data
Params: vid (video file)
```

### Get Live Stream (MJPEG)
```
GET /getstream/
```

### Get Stream with Token
```
GET /gettokenstream/<token>/
```

## 🐛 Troubleshooting

### CORS Issues
If frontend can't connect to backend, ensure:
1. Django server is running on `http://localhost:8000`
2. CORS settings in Django allow your frontend URL
3. Environment variable `NEXT_PUBLIC_API_URL` is correct

### Video Not Processing
1. Check Django server logs
2. Ensure ML model file exists: `Website/Models/CustomCNN.h5`
3. Verify TensorFlow/OpenCV are installed

### Build Issues
1. Clear Next.js cache: `rm -rf frontend/.next`
2. Reinstall dependencies: `rm -rf frontend/node_modules && npm install`
3. Update Node.js to latest LTS

## 📚 Documentation

- [Frontend Documentation](frontend/README.md)
- Original Project: [PRESENTATION.md](PRESENTATION.md)

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

All rights reserved.

## 👨‍💻 Support

For issues or questions, refer to individual README files in `frontend/` and `Website/` directories.

---

**Last Updated:** March 2026
**Frontend:** Next.js 14
**Backend:** Django 4.x
**ML Framework:** TensorFlow/Keras

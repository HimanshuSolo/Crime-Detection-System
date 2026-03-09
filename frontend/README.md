# Crime Detection Frontend - Next.js

This is the Next.js frontend for the Crime Detection System. It communicates with the Django backend to provide a modern user interface.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env.local` and set the Django backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Features

- **Video Upload & Analysis** - Upload videos for ML-based crime detection
- **Live Streaming** - Real-time video stream monitoring
- **Token-based Streaming** - Share specific analysis streams with tokens
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Modern UI** - Built with clean, intuitive interface

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Homepage
│   ├── analyze/              # Video analysis page
│   ├── stream/               # Live stream page
│   │   └── [token]/          # Token-based stream page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── public/                   # Static assets
├── lib/                      # Utilities and helpers
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## API Integration

The frontend communicates with Django backend at:
- `POST /api/` - Upload and analyze video
- `GET /getstream/` - Get live stream
- `GET /gettokenstream/<token>/` - Get stream by token

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client
- **CSS3** - Styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to submit issues and enhancement requests.

# Crime Detection System - Project Overview

## Project Overview

**Project Name**: Crime Detection System

**Goal**: Use AI/ML to detect suspicious activity in real-time video feeds and classify them as either "Peaceful" or "Suspicious"

**Key Value Proposition**: Automated surveillance system that can process live video streams and provide instant alerts

---

## Architecture (Two Main Components)

### 1. Machine Learning Module (`Machine Learning/`)
- **Purpose**: Trained deep learning models for binary classification (Peaceful/Suspicious)
- **Available Models**:
  - BaseModel.h5
  - CustomisedCNNModel.h5
  - VGGNet1.h5
- **Development Environment**: Jupyter notebooks for model training and experimentation
- **Functionality**: Analyzes video frames to classify suspicious vs. peaceful activity

### 2. Web Application Backend (`Website/`)
- **Framework**: Django-based API endpoint
- **Capabilities**:
  - Real-time video streaming and processing
  - REST API for integration with frontend clients
  - Evidence/document storage system
  - Live feed display with visual indicators

---

## Technical Flow

1. **Input**: User uploads or streams video feed
2. **Capture**: Application captures video frames using OpenCV
3. **Processing**: 
   - Frames resized to 150×150 pixels
   - Normalization applied
4. **Prediction**: Pre-trained TensorFlow model predicts classification
5. **Output**: 
   - Live feed displayed with color-coded boxes
   - Confidence score displayed alongside prediction
   - Frame skipping for performance optimization (processes every 3rd frame)

---

## Technical Stack

| Component | Technology |
|-----------|-----------|
| Backend | Django |
| ML Framework | TensorFlow/Keras |
| Video Processing | OpenCV (cv2) |
| Streaming Protocol | MJPEG (Real-time streaming) |
| Data Processing | NumPy |
| Deployment | Gunicorn |

---

## Key Features

✅ **Real-time Video Processing** - Processes live video streams instantly  
✅ **Binary Classification** - Classifies activity as Peaceful or Suspicious  
✅ **Confidence Scores** - Displays prediction confidence for transparency  
✅ **Performance Optimization** - Frame skipping reduces processing load  
✅ **Evidence Storage** - Document/media storage for recorded events  
✅ **Responsive Web Interface** - User-friendly dashboard  
✅ **Color-Coded Alerts** - Visual indicators (Green = Peaceful, Red = Suspicious)  

---

## Model Configuration

- **Classification Threshold**: 0.76 (confidence threshold for predictions)
- **Frame Size**: 150×150 pixels
- **Normalization**: Frame values divided by 255.0
- **Frame Skip Count**: 2 (processes every 3rd frame)

---

## Setup & Installation

### Prerequisites
```bash
pip install -r requirements.txt
```

### Required Dependencies
- django
- gunicorn
- tensorflow
- opencv-python
- numpy

### Getting Started

1. Navigate to the Website directory:
```bash
cd Website
```

2. Install dependencies:
```bash
pip3 install -r requirements.txt
```

3. Run migrations:
```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

4. Start the server:
```bash
python3 manage.py runserver
```

---

## How to Demo

1. Run the Django development server
2. Access the web interface through browser
3. Choose a video source (webcam or uploaded file)
4. View real-time detection results with:
   - Color-coded boxes indicating threat level
   - Confidence scores
   - Live classification updates

---

## Project Structure

```
crime-detection-system/
├── Machine Learning/
│   ├── model_train.ipynb          # Model training notebook
│   ├── Models/                     # Pre-trained model files
│   │   ├── BaseModel.h5
│   │   ├── CustomisedCNNModel.h5
│   │   └── VGGNet1.h5
│   └── stats/                      # Training statistics
│
└── Website/
    ├── core/                       # Django app with main logic
    │   ├── models.py              # Database models
    │   ├── views.py               # Video processing & streaming
    │   ├── forms.py               # Upload forms
    │   └── urls.py                # Route definitions
    ├── templates/                 # HTML templates
    │   ├── home.html
    │   ├── stream.html
    │   └── streamtoken.html
    ├── static/                    # CSS, JS, assets
    ├── Models/                    # Model deployment files
    ├── manage.py                  # Django management script
    └── requirements.txt           # Python dependencies
```

---

## Technical Highlights

### Real-Time Processing
- Efficient frame skipping reduces computational overhead
- MJPEG streaming protocol for live video transmission
- Optimized model inference for quick predictions

### Performance Considerations
- Frame resizing to 150×150 reduces computation time
- Threshold value (0.76) minimizes false positives
- Skips frames intelligently to balance accuracy and speed

### Classification Logic
- **Confidence > 0.76**: "Suspicious" activity (Red box)
- **Confidence ≤ 0.76**: "Peaceful" activity (Green box)

---

## Potential Questions & Answers

**Q: Why implement frame skipping?**  
A: Performance optimization - reduces processing load while maintaining adequate detection frequency

**Q: What does the threshold value (0.76) represent?**  
A: Model confidence threshold - predictions above this value are classified as "Suspicious"

**Q: Why multiple trained models?**  
A: Different architectures (BaseModel, CustomCNN, VGGNet1) tested to find best accuracy/speed trade-off

**Q: How does the system handle different video sources?**  
A: Uses OpenCV's VideoCapture which supports webcams, video files, and IP camera streams

---

## Future Enhancements

- Multi-class classification (not just binary)
- Improved model accuracy with more training data
- Real-time alert notifications
- Historical data analytics and reporting
- Mobile app integration
- Multi-stream processing capability

---

*Project created as part of AI/ML development initiative*

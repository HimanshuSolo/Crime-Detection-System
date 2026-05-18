"""Cleaned views for core app: streaming, upload API, alert API."""

import uuid
import json
import cv2
import numpy as np
from django.conf import settings
from django.http import JsonResponse, HttpResponse, StreamingHttpResponse
from django.shortcuts import redirect, render, reverse
from django.views.decorators import gzip
from django.views.decorators.csrf import csrf_exempt

from .forms import DocumentForm
from .models import DocModel
from .alerts import alert_tracker, trigger_alerts


# Lazy-loaded model
_model = None


def get_model():
    global _model
    if _model is None:
        try:
            from tensorflow import keras

            model_path = getattr(settings, "MODEL_PATH", "Models/CustomCNN.h5")
            _model = keras.models.load_model(model_path)
        except Exception:
            _model = None
    return _model


def add_cors_headers(response):
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Origin, Content-Type, Accept"
    return response


class VideoCamera:
    def __init__(self, url=None):
        self.font = cv2.FONT_HERSHEY_SIMPLEX
        self.status = True
        self.fontScale = 0.6
        self.thickness = 1
        self.SIZE = (150, 150)
        self.THRESH = settings.ALERT_CONFIG.get("DETECTION_THRESHOLD", 0.76)
        if url is None:
            self.url = 0
        elif isinstance(url, str) and (url.startswith("http") or url.startswith("rtsp")):
            self.url = url
        else:
            self.url = "." + url
        self.video = cv2.VideoCapture(self.url)
        self.skipCount = 2
        self.prev = None
        self.fcount = 0

    def __del__(self):
        try:
            if hasattr(self, "video") and self.video is not None:
                self.video.release()
        except Exception:
            pass

    def get_frame(self):
        ret, image = self.video.read()
        if not ret:
            self.status = False
            blank_frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(blank_frame, "Video Error: Stream Ended", (50, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            ret_enc, jpeg = cv2.imencode(".jpg", blank_frame)
            return jpeg.tobytes() if ret_enc else b""

        if self.fcount % self.skipCount == 0:
            tmp = cv2.resize(image, self.SIZE)
            tmp = tmp / 255.0
            model = get_model()
            if model is not None:
                pred = model.predict(np.array([tmp]))
                is_suspicious = pred[0][0] > self.THRESH
                string = "Suspicious" if is_suspicious else "Peaceful"
                string += f" {pred[0][0]:.2f}"
                self.prev = string

                alert_tracker.record_prediction(is_suspicious)
                if alert_tracker.should_trigger_alert():
                    trigger_alerts(prediction_score=pred[0][0], camera_url=self.url)
                    alert_tracker.mark_alert_sent()
            else:
                string = "ModelUnavailable"
                self.prev = string
        else:
            string = self.prev or ""

        if string.startswith("Peaceful"):
            label_text = "NORMAL"
            label_bg = (0, 170, 110)
        elif string == "ModelUnavailable":
            label_text = "MODEL UNAVAILABLE"
            label_bg = (90, 90, 90)
        else:
            label_text = "SUSPICIOUS"
            label_bg = (0, 0, 230)

        score = None
        if self.prev and self.prev.split(" ")[-1].replace(".", "", 1).isdigit():
            try:
                score = float(self.prev.split(" ")[-1])
            except ValueError:
                score = None

        alert_tracker.update_latest_status(label_text, score)

        label_font_scale = 0.55
        label_thickness = 1
        color = (255, 255, 255)
        (text_w, text_h), baseline = cv2.getTextSize(label_text, self.font, label_font_scale, label_thickness)
        pad_x = 8
        pad_y = 5
        img_h, img_w = image.shape[:2]
        right_margin = 14
        top_margin = 14
        bottom_right = (img_w - right_margin, top_margin + text_h + baseline + pad_y * 2)
        top_left = (max(10, bottom_right[0] - text_w - pad_x * 2), top_margin)
        text_origin = (top_left[0] + pad_x, top_left[1] + pad_y + text_h)

        cv2.rectangle(image, top_left, bottom_right, label_bg, cv2.FILLED)
        cv2.putText(image, label_text, text_origin, self.font, label_font_scale, color, label_thickness, cv2.LINE_AA)
        ret, jpeg = cv2.imencode(".jpg", image)
        self.fcount += 1
        return jpeg.tobytes()


def gen(camera):
    while camera.status:
        frame = camera.get_frame()
        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame + b"\r\n\r\n")


@gzip.gzip_page
def Stream(request):
    try:
        entry = DocModel.objects.all().last()
        if entry is None:
            return add_cors_headers(JsonResponse({"message": "No Video Files Yet!"}, status=404))
        return StreamingHttpResponse(gen(VideoCamera(entry.vid.url)), content_type="multipart/x-mixed-replace;boundary=frame")
    except Exception:
        print("aborted")
        return HttpResponse(status=500)


@gzip.gzip_page
def StreamToken(request, token):
    try:
        entry = DocModel.objects.filter(stoken=token).last()
        if entry is None:
            return add_cors_headers(JsonResponse({"message": "Token Not Registered"}, status=404))
        return StreamingHttpResponse(gen(VideoCamera(entry.vid.url)), content_type="multipart/x-mixed-replace;boundary=frame")
    except Exception:
        print("aborted")
        return HttpResponse(status=500)


@gzip.gzip_page
def StreamIP(request):
    try:
        ip_url = request.GET.get('url')
        if not ip_url:
            return add_cors_headers(JsonResponse({"message": "No IP URL provided"}, status=400))
        return add_cors_headers(StreamingHttpResponse(gen(VideoCamera(ip_url)), content_type="multipart/x-mixed-replace;boundary=frame"))
    except Exception:
        print("aborted")
        return HttpResponse(status=500)


def HomeView(request):
    if request.method == "POST":
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("streamroom")

    form = DocumentForm()
    return render(request, "home.html", {"form": form})


def StreamView(request):
    entry = DocModel.objects.all().last()
    if entry is None:
        return add_cors_headers(JsonResponse({"message": "No Video Files Yet!"}, status=404))
    return render(request, "stream.html")


def StreamTokenView(request, token):
    entry = DocModel.objects.filter(stoken=token).last()
    if entry is None:
        return add_cors_headers(JsonResponse({"message": "No Video Files Yet for this token!"}, status=404))
    return render(request, "streamtoken.html", {"token": token})


@csrf_exempt
def APIEnd(request):
    if request.method == "OPTIONS":
        return add_cors_headers(HttpResponse())

    if request.method == "POST":
        stoken = request.POST.get("stoken") or str(uuid.uuid4())
        vidFile = request.FILES.get("vid")
        if not vidFile:
            return add_cors_headers(JsonResponse({"status": "error", "message": "Missing 'vid' file field."}, status=400))

        DocModel(stoken=stoken, vid=vidFile).save()
        baseurl = request.build_absolute_uri(reverse("home"))
        return add_cors_headers(JsonResponse({
            "status": "ok",
            "token": stoken,
            "message": f"Files received for token {stoken}",
            "vidurl": baseurl + "streamtoken/" + stoken,
        }))

    return add_cors_headers(JsonResponse({"status": "idle", "message": "Send a POST request with a video file."}))


@csrf_exempt
def AlertAPI(request):
    if request.method == "OPTIONS":
        return add_cors_headers(HttpResponse())

    if request.method == "GET":
        response = JsonResponse({
            "status": "ok",
            "tracker": alert_tracker.get_stats(),
            "config": {
                "email_enabled": settings.ALERT_CONFIG.get("EMAIL_ENABLED", False),
                "sms_enabled": settings.ALERT_CONFIG.get("SMS_ENABLED", False),
                "detection_threshold": settings.ALERT_CONFIG.get("DETECTION_THRESHOLD", 0.76),
                "consecutive_threshold": settings.ALERT_CONFIG.get("CONSECUTIVE_THRESHOLD"),
                "frequency_threshold": settings.ALERT_CONFIG.get("FREQUENCY_THRESHOLD"),
                "alert_cooldown": settings.ALERT_CONFIG.get("ALERT_COOLDOWN"),
            },
                "latest_status": {
                    "label": alert_tracker.latest_label,
                    "score": alert_tracker.latest_score,
                    "updated_at": alert_tracker.latest_updated_at,
                },
        })
        return add_cors_headers(response)

    if request.method == "PUT":
        data = json.loads(request.body)
        if "email_enabled" in data:
            settings.ALERT_CONFIG["EMAIL_ENABLED"] = data["email_enabled"]
        if "sms_enabled" in data:
            settings.ALERT_CONFIG["SMS_ENABLED"] = data["sms_enabled"]
        if "alert_email" in data:
            settings.ALERT_CONFIG["ALERT_EMAIL"] = data["alert_email"]
        if "detection_threshold" in data:
            settings.ALERT_CONFIG["DETECTION_THRESHOLD"] = float(data["detection_threshold"])
        if "consecutive_threshold" in data:
            settings.ALERT_CONFIG["CONSECUTIVE_THRESHOLD"] = int(data["consecutive_threshold"])
        if "frequency_threshold" in data:
            settings.ALERT_CONFIG["FREQUENCY_THRESHOLD"] = int(data["frequency_threshold"])
        return add_cors_headers(JsonResponse({"status": "ok", "message": "Alert settings updated"}))

    return add_cors_headers(JsonResponse({"status": "error", "message": "Invalid request method"}, status=405))

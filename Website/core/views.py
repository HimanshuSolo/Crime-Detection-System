<<<<<<< HEAD
<<<<<<< HEAD
import uuid

import cv2
import numpy as np
from django.conf import settings
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import redirect, render, reverse
from django.views.decorators import gzip
from django.views.decorators.csrf import csrf_exempt

from .forms import DocumentForm
from .models import DocModel
=======
from django.views.decorators.clickjacking import xframe_options_exempt
import numpy as np
from django.shortcuts import render, redirect, reverse
from django.http import JsonResponse, HttpResponse, StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import DocModel
import json
from django.views.decorators import gzip
import cv2
from .forms import DocumentForm
from django.conf import settings
>>>>>>> c958c898 (batman)

model = settings.MODEL


class VideoCamera(object):
    def __init__(self, url=None):
        self.font = cv2.FONT_HERSHEY_SIMPLEX
        self.status = True
<<<<<<< HEAD
        self.fontScale = 0.6
        self.thickness = 1
=======
        self.org = (50, 80)
        self.fontScale = 1.4
        self.thickness = 3
>>>>>>> c958c898 (batman)
        self.SIZE = (150, 150)
        self.THRESH = 0.76
        self.url = 0 if url is None else "." + url
        self.video = cv2.VideoCapture(self.url)
        self.skipCount = 2
        self.prev = None
        self.fcount = 0

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ret, image = self.video.read()
        if not ret:
            self.status = False
            pass

        if self.fcount % self.skipCount == 0:
            tmp = cv2.resize(image, self.SIZE)
            tmp = tmp / 255.0
            pred = model.predict(np.array([tmp]))
            string = "Suspicious" if pred[0][0] > self.THRESH else "Peaceful"
<<<<<<< HEAD
            string += f" {pred[0][0]:.2f}"
=======
            string += f" {str(pred[0][0])}"
>>>>>>> c958c898 (batman)
            self.prev = string

        else:
            string = self.prev

        color = (255, 255, 255)
<<<<<<< HEAD
        label_bg = (0, 200, 100) if string.split(" ")[0] == "Peaceful" else (0, 0, 255)

        # Draw small label in top-right corner
        (text_w, text_h), baseline = cv2.getTextSize(
            string,
            self.font,
            self.fontScale,
            self.thickness,
        )
        pad_x = 8
        pad_y = 4
        img_h, img_w = image.shape[:2]
        top_left = (img_w - text_w - pad_x * 2 - 10, 8)
        bottom_right = (img_w - 8, text_h + baseline + pad_y * 2 + 8)
        text_origin = (top_left[0] + pad_x, top_left[1] + pad_y + text_h)

        cv2.rectangle(image, top_left, bottom_right, label_bg, cv2.FILLED)
        cv2.putText(
            image,
            string,
            text_origin,
=======
        image = (
            cv2.rectangle(image, (20, 20), (600, 100), (0, 200, 100), cv2.FILLED)
            if string.split(" ")[0] == "Peaceful"
            else cv2.rectangle(image, (20, 20), (600, 100), (0, 0, 255), cv2.FILLED)
        )
        image = cv2.putText(
            image,
            string,
            self.org,
>>>>>>> c958c898 (batman)
            self.font,
            self.fontScale,
            color,
            self.thickness,
            cv2.LINE_AA,
        )
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
        return StreamingHttpResponse(
            gen(VideoCamera(entry.vid.url)),
            content_type="multipart/x-mixed-replace;boundary=frame",
        )
<<<<<<< HEAD
    except StreamingHttpResponse.HttpResponseServerError:
=======
    except StreamingHttpResponse.HttpResponseServerError as e:
>>>>>>> c958c898 (batman)
        print("aborted")


@gzip.gzip_page
def StreamToken(request, token):
    try:
        entry = DocModel.objects.filter(stoken=token).last()
        return StreamingHttpResponse(
            gen(VideoCamera(entry.vid.url)),
            content_type="multipart/x-mixed-replace;boundary=frame",
        )
<<<<<<< HEAD
    except StreamingHttpResponse.HttpResponseServerError:
=======
    except StreamingHttpResponse.HttpResponseServerError as e:
>>>>>>> c958c898 (batman)
        print("aborted")


def HomeView(request):
    if request.method == "POST":
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("streamroom")

    else:
        form = DocumentForm()
        return render(request, "home.html", {"form": form})


# @xframe_options_exempt
def StreamView(request):
    entry = DocModel.objects.all().last()
    if entry is None:
        return JsonResponse({"message": "No Video Files Yet!"})
    return render(request, "stream.html")


# API End Point
def StreamTokenView(request, token):
    try:
        entry = DocModel.objects.filter(stoken=token).last()
        if entry is None:
            return JsonResponse({"message": "Token Not Registered"})

        return render(request, "streamtoken.html", {"token": token})

    except DocModel.DoesNotExist:
        return JsonResponse({"message": "Token Not Registered"})


@csrf_exempt
def APIEnd(request):
    if request.method == "POST":
<<<<<<< HEAD
        # Accept a provided token, or generate one if missing
        stoken = request.POST.get("stoken") or str(uuid.uuid4())

        vidFile = request.FILES.get("vid")
        if not vidFile:
            return JsonResponse(
                {"status": "error", "message": "Missing 'vid' file field."}, status=400
            )

        # Save the uploaded video under the token
        DocModel(stoken=stoken, vid=vidFile).save()

        baseurl = request.build_absolute_uri(reverse("home"))
        return JsonResponse(
            {
                "status": "ok",
                "token": stoken,
                "message": f"Files received for token {stoken}",
                "vidurl": baseurl + "streamtoken/" + stoken,
            }
        )

    return JsonResponse(
        {"status": "idle", "message": "Send a POST request with a video file."}
    )
=======
        try:
            stoken = request.POST["stoken"]
            vidFile = request.FILES["vid"]
            DocModel(stoken=stoken, vid=vidFile).save()
            baseurl = request.build_absolute_uri(reverse("home"))
            return JsonResponse(
                {
                    "status": "ok",
                    "message": f"Files Received from sender {stoken}",
                    "vidurl": baseurl + "streamtoken/" + stoken,
                }
            )
        except:
            return HttpResponse(status=400)

    return JsonResponse({"status": "Wait kro bhai"})
>>>>>>> c958c898 (batman)


# Create your views here.
=======
import uuid

import cv2
import numpy as np
from django.conf import settings
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import redirect, render, reverse
from django.views.decorators import gzip
from django.views.decorators.csrf import csrf_exempt

from .forms import DocumentForm
from .models import DocModel
from .alerts import alert_tracker, trigger_alerts

# Lazy load the model on first use
_model = None

def get_model():
    global _model
    if _model is None:
        from tensorflow import keras
        _model = keras.models.load_model('Models/CustomCNN.h5')
    return _model

def add_cors_headers(response):
    """Add CORS headers to response for cross-origin requests"""
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, PUT, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


class VideoCamera(object):
    def __init__(self, url=None):
        self.font = cv2.FONT_HERSHEY_SIMPLEX
        self.status = True
        self.fontScale = 0.6
        self.thickness = 1
        self.SIZE = (150, 150)
        self.THRESH = settings.ALERT_CONFIG.get('DETECTION_THRESHOLD', 0.76)
        self.url = 0 if url is None else "." + url
        self.video = cv2.VideoCapture(self.url)
        self.skipCount = 2
        self.prev = None
        self.fcount = 0

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ret, image = self.video.read()
        if not ret:
            self.status = False
            # Create a blank error frame instead of trying to process None
            blank_frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(blank_frame, "Video Error: Stream Ended", (50, 240),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            ret_enc, jpeg = cv2.imencode(".jpg", blank_frame)
            return jpeg.tobytes() if ret_enc else b""

        if self.fcount % self.skipCount == 0:
            tmp = cv2.resize(image, self.SIZE)
            tmp = tmp / 255.0
            model = get_model()
            pred = model.predict(np.array([tmp]))
            is_suspicious = pred[0][0] > self.THRESH
            string = "Suspicious" if is_suspicious else "Peaceful"
            string += f" {pred[0][0]:.2f}"
            self.prev = string

            alert_tracker.record_prediction(is_suspicious)

            if alert_tracker.should_trigger_alert():
                trigger_alerts(
                    prediction_score=pred[0][0],
                    camera_url=self.url,
                )
                alert_tracker.mark_alert_sent()

        else:
            string = self.prev

        color = (255, 255, 255)
        label_bg = (0, 200, 100) if string.split(" ")[0] == "Peaceful" else (0, 0, 255)

        # Draw small label in top-right corner
        (text_w, text_h), baseline = cv2.getTextSize(
            string,
            self.font,
            self.fontScale,
            self.thickness,
        )
        pad_x = 8
        pad_y = 4
        img_h, img_w = image.shape[:2]
        top_left = (img_w - text_w - pad_x * 2 - 10, 8)
        bottom_right = (img_w - 8, text_h + baseline + pad_y * 2 + 8)
        text_origin = (top_left[0] + pad_x, top_left[1] + pad_y + text_h)

        cv2.rectangle(image, top_left, bottom_right, label_bg, cv2.FILLED)
        cv2.putText(
            image,
            string,
            text_origin,
            self.font,
            self.fontScale,
            color,
            self.thickness,
            cv2.LINE_AA,
        )
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
        return StreamingHttpResponse(
            gen(VideoCamera(entry.vid.url)),
            content_type="multipart/x-mixed-replace;boundary=frame",
        )
    except StreamingHttpResponse.HttpResponseServerError:
        print("aborted")


@gzip.gzip_page
def StreamToken(request, token):
    try:
        entry = DocModel.objects.filter(stoken=token).last()
        return StreamingHttpResponse(
            gen(VideoCamera(entry.vid.url)),
            content_type="multipart/x-mixed-replace;boundary=frame",
        )
    except StreamingHttpResponse.HttpResponseServerError:
        print("aborted")


def HomeView(request):
    if request.method == "POST":
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("streamroom")

    else:
        form = DocumentForm()
        return render(request, "home.html", {"form": form})


# @xframe_options_exempt
def StreamView(request):
    entry = DocModel.objects.all().last()
    if entry is None:
        response = JsonResponse({"message": "No Video Files Yet!"})
        return add_cors_headers(response)
    return render(request, "stream.html")


def StreamTokenView(request, token):
    entry = DocModel.objects.filter(stoken=token).last()
    if entry is None:
        response = JsonResponse({"message": "No Video Files Yet for this token!"})
        return add_cors_headers(response)
    return render(request, "streamtoken.html", {"token": token})


# API End Point
@csrf_exempt
def APIEnd(request):
    # Handle CORS preflight request
    if request.method == "OPTIONS":
        response = JsonResponse({})
        return add_cors_headers(response)
    
    if request.method == "POST":
        # Accept a provided token, or generate one if missing
        stoken = request.POST.get("stoken") or str(uuid.uuid4())

        vidFile = request.FILES.get("vid")
        if not vidFile:
            response = JsonResponse(
                {"status": "error", "message": "Missing 'vid' file field."}, status=400
            )
            return add_cors_headers(response)

        # Save the uploaded video under the token
        DocModel(stoken=stoken, vid=vidFile).save()

        baseurl = request.build_absolute_uri(reverse("home"))
        response = JsonResponse(
            {
                "status": "ok",
                "token": stoken,
                "message": f"Files received for token {stoken}",
                "vidurl": baseurl + "streamtoken/" + stoken,
            }
        )
        return add_cors_headers(response)

    response = JsonResponse(
        {"status": "idle", "message": "Send a POST request with a video file."}
    )
    return add_cors_headers(response)


@csrf_exempt
def AlertAPI(request):
    # Handle CORS preflight request
    if request.method == "OPTIONS":
        response = JsonResponse({})
        return add_cors_headers(response)
    
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
        })
        return add_cors_headers(response)

    if request.method == "PUT":
        import json
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

        response = JsonResponse({"status": "ok", "message": "Alert settings updated"})
        return add_cors_headers(response)

    response = JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)
    return add_cors_headers(response)


# Create your views here.
>>>>>>> 37075273 (alert added)

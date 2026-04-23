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

model = settings.MODEL


class VideoCamera(object):
    def __init__(self, url=None):
        self.font = cv2.FONT_HERSHEY_SIMPLEX
        self.status = True
        self.fontScale = 0.6
        self.thickness = 1
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
            string += f" {pred[0][0]:.2f}"
            self.prev = string

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


# Create your views here.

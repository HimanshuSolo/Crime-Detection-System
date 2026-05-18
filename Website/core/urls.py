from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views import *

urlpatterns = [
    path("", HomeView, name="home"),

    # Streaming endpoints (support with and without trailing slashes)
    path("getstream", Stream, name="streamdt"),
    path("getstream/", Stream, name="streamdt_slash"),
    path("getipstream", StreamIP, name="streamip"),
    path("gettokenstream/<token>", StreamToken, name="streamtk"),
    path("gettokenstream/<token>/", StreamToken, name="streamtk_slash"),

    # Page views
    path("stream/", StreamView, name="streamroom"),
    path("streamtoken/<token>", StreamTokenView, name="stokenview"),
    path("streamtoken/<token>/", StreamTokenView, name="stokenview_slash"),

    # API endpoints (with and without trailing slash to avoid POST redirect issues)
    path("api/", APIEnd, name="api"),
    path("api", APIEnd, name="api_no_slash"),

    # Alert API
    path("api/alerts/", AlertAPI, name="alert_api"),
    path("api/alerts", AlertAPI, name="alert_api_no_slash"),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

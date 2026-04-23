from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views import *

urlpatterns = [
    path("", HomeView, name="home"),
    # Streaming endpoints (support with and without trailing slashes)
    path("getstream", Stream, name="streamdt"),
    path("getstream/", Stream, name="streamdt_slash"),
    path("gettokenstream/<token>", StreamToken, name="streamtk"),
    path("gettokenstream/<token>/", StreamToken, name="streamtk_slash"),
    # Page views (already include trailing slash)
    path("stream/", StreamView, name="streamroom"),
    path("streamtoken/<token>", StreamTokenView, name="stokenview"),
    path("streamtoken/<token>/", StreamTokenView, name="stokenview_slash"),
    # API endpoint (support with and without trailing slash to avoid POST redirect errors)
    path("api/", APIEnd, name="api"),
    path("api", APIEnd, name="api_no_slash"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.http import JsonResponse
from django.urls import path
from .views import predict_crime_api, all_crime_data
from .views import record_voice_api, get_audio_file
from django.conf import settings
from django.conf.urls.static import static
def api_home(request):
    return JsonResponse({"message": "Welcome to the Women Safety API!"})

urlpatterns = [
    path("", api_home, name="api-home"),  # Default API home route
    #path("crime-data/", get_crime_data, name="crime-data"),
    path("predict-crime/", predict_crime_api, name="predict-crime"),
    path("all-crime-data/", all_crime_data, name="all_crime_data"),
    path('record-voice/', record_voice_api, name='record-voice'),
    path('get-audio/<str:filename>/', get_audio_file, name='get_audio_file'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

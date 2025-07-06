from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def welcome_view(request):
    return JsonResponse({"message": "Welcome to the FitTrack API!"})

urlpatterns = [
    path('', welcome_view),  # Root URL
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('api.urls')),
]

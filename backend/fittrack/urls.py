from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),   # Authentication
    path('api/', include('api.urls')),             # Workout-related API
    path('', lambda request: JsonResponse({"message": "Welcome to the FitTrack API!"})),
]

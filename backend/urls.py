from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def redirect_to_api(request):
    return HttpResponseRedirect('/api/')

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT auth endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # app route
    path('api/', include('api.urls')),

    # redirect
    path('', redirect_to_api),
    path('api/', include('accounts.urls')),
]

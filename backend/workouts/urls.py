from django.urls import path
from .views import (
    WorkoutPlanListCreateView,
    WorkoutPlanRetrieveUpdateDestroyView,
    WorkoutLogListCreateView,
    WorkoutLogRetrieveUpdateDestroyView,
    workout_stats
)

urlpatterns = [
    path('workout-plans/', WorkoutPlanListCreateView.as_view(), name='workout-plans'),
    path('workout-plans/<uuid:pk>/', WorkoutPlanRetrieveUpdateDestroyView.as_view(), name='workout-plan-detail'),
    path('workout-logs/', WorkoutLogListCreateView.as_view(), name='workout-logs'),
    path('workout-logs/<uuid:pk>/', WorkoutLogRetrieveUpdateDestroyView.as_view(), name='workout-log-detail'),
    path('stats/', workout_stats, name='workout-stats'),
]

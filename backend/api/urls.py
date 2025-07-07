from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutPlanViewSet, ExerciseViewSet, WorkoutLogViewSet

router = DefaultRouter()
router.register(r'workout-plans', WorkoutPlanViewSet, basename='workoutplan')
router.register(r'exercises', ExerciseViewSet, basename='exercise')
router.register(r'workout-logs', WorkoutLogViewSet, basename='workoutlog')

urlpatterns = [
    path('', include(router.urls)),
]

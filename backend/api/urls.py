# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    ExerciseViewSet,
    WorkoutPlanViewSet,
    WorkoutExerciseViewSet,
    WorkoutLogViewSet
)

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('exercises', ExerciseViewSet)
router.register('workouts', WorkoutPlanViewSet)
router.register('workout-exercises', WorkoutExerciseViewSet)
router.register('logs', WorkoutLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

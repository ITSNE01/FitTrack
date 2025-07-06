from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutPlanViewSet, ExerciseViewSet, WorkoutLogViewSet

router = DefaultRouter()
router.register(r'workouts', WorkoutPlanViewSet)
router.register(r'exercises', ExerciseViewSet)
router.register(r'logs', WorkoutLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

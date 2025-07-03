from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Avg, Sum
from django.utils import timezone
from datetime import timedelta
from .models import WorkoutPlan, WorkoutLog
from .serializers import WorkoutPlanSerializer, WorkoutLogSerializer

class WorkoutPlanListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkoutPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return WorkoutPlan.objects.filter(user=self.request.user)

class WorkoutPlanRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkoutPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return WorkoutPlan.objects.filter(user=self.request.user)

class WorkoutLogListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkoutLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return WorkoutLog.objects.filter(user=self.request.user)

class WorkoutLogRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkoutLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return WorkoutLog.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def workout_stats(request):
    """Get workout statistics for the current user"""
    user = request.user
    
    # Get all workout logs for the user
    logs = WorkoutLog.objects.filter(user=user)
    
    # Basic stats
    total_workouts = logs.count()
    total_plans = WorkoutPlan.objects.filter(user=user).count()
    
    # Weekly stats
    week_ago = timezone.now().date() - timedelta(days=7)
    weekly_workouts = logs.filter(date__gte=week_ago).count()
    
    # Average duration
    avg_duration = logs.aggregate(Avg('duration'))['duration__avg'] or 0
    
    # Total duration
    total_duration = logs.aggregate(Sum('duration'))['duration__sum'] or 0
    
    return Response({
        'total_workouts': total_workouts,
        'total_plans': total_plans,
        'weekly_workouts': weekly_workouts,
        'average_duration': round(avg_duration, 2),
        'total_duration': total_duration,
    })

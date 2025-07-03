from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class WorkoutPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_plans')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    exercises = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"

class WorkoutLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_logs')
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    duration = models.IntegerField(help_text="Duration in minutes")
    exercises = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.workout_plan.title} - {self.date} - {self.user.username}"

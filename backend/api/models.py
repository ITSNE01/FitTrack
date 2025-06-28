# api/models.py

from django.contrib.auth.models import User
from django.db import models

class WorkoutPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    target_muscle = models.CharField(max_length=100)

class WorkoutExercise(models.Model):
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.FloatField(null=True, blank=True)

class WorkoutLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE)
    date_completed = models.DateField()
    notes = models.TextField(blank=True)

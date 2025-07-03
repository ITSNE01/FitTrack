from django.contrib import admin
from .models import WorkoutPlan, WorkoutLog

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('title', 'user__username')
    readonly_fields = ('id', 'created_at', 'updated_at')

@admin.register(WorkoutLog)
class WorkoutLogAdmin(admin.ModelAdmin):
    list_display = ('workout_plan', 'user', 'date', 'duration', 'created_at')
    list_filter = ('date', 'created_at')
    search_fields = ('workout_plan__title', 'user__username')
    readonly_fields = ('id', 'created_at')

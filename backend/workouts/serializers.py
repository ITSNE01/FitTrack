from rest_framework import serializers
from .models import WorkoutPlan, WorkoutLog, Exercise, WorkoutExercise

class ExerciseInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']

class WorkoutPlanSerializer(serializers.ModelSerializer):
    exercises = ExerciseInputSerializer(many=True)

    class Meta:
        model = WorkoutPlan
        fields = ['id', 'title', 'description', 'exercises', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        exercises_data = validated_data.pop('exercises', [])
        plan = WorkoutPlan.objects.create(user=user, **validated_data)

        for exercise_data in exercises_data:
            exercise, _ = Exercise.objects.get_or_create(name=exercise_data['name'], defaults={'description': exercise_data.get('description', '')})
            WorkoutExercise.objects.create(workout_plan=plan, exercise=exercise)

        return plan

class WorkoutLogSerializer(serializers.ModelSerializer):
    workout_plan = WorkoutPlanSerializer(read_only=True)
    workout_plan_id = serializers.UUIDField(write_only=True, source='workout_plan')

    class Meta:
        model = WorkoutLog
        fields = ['id', 'workout_plan', 'workout_plan_id', 'date', 'duration', 'exercises', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def validate_workout_plan(self, value):
        if value.user != self.context['request'].user:
            raise serializers.ValidationError("You can only log workouts for your own plans.")
        return value

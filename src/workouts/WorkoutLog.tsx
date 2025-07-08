import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  exercises: Exercise[];
}

interface ExerciseLog {
  exercise_name: string;
  sets_completed: number;
  reps_completed: number;
  weight_used?: number;
  notes?: string;
}

const WorkoutLog: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(30);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/workout-plans/', {
        headers: {
          Authorization: `Bearer ${user?.access}`,
        },
      });
      setWorkoutPlans(response.data);
    } catch (error) {
      showToast('Error fetching workout plans', 'error');
    }
  };

  const handlePlanSelect = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setExerciseLogs(
      plan.exercises.map(exercise => ({
        exercise_name: exercise.name,
        sets_completed: exercise.sets,
        reps_completed: exercise.reps,
        weight_used: exercise.weight || 0,
        notes: ''
      }))
    );
  };

  const updateExerciseLog = (index: number, field: keyof ExerciseLog, value: any) => {
    const updatedLogs = exerciseLogs.map((log, i) =>
      i === index ? { ...log, [field]: value } : log
    );
    setExerciseLogs(updatedLogs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      showToast('Please select a workout plan', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/workout-logs/', {
        workout_plan_id: selectedPlan.id,
        date,
        duration,
        exercises: exerciseLogs
      }, {
        headers: {
          Authorization: `Bearer ${user?.access}`,
        },
      });

      showToast('Workout logged successfully!', 'success');
      navigate('/workout-history');
    } catch (error) {
      showToast('Error logging workout', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary me-3"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft size={16} />
                </button>
                <h4 className="mb-0">Log Workout</h4>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">
                      <Calendar size={16} className="me-2" />
                      Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <Clock size={16} className="me-2" />
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Select Workout Plan</label>
                  <select
                    className="form-select"
                    value={selectedPlan?.id || ''}
                    onChange={(e) => {
                      const plan = workoutPlans.find(p => p.id === e.target.value);
                      if (plan) handlePlanSelect(plan);
                    }}
                    required
                  >
                    <option value="">Choose a workout plan...</option>
                    {workoutPlans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPlan && (
                  <div className="mb-4">
                    <h5>Log Exercises</h5>
                    <p className="text-muted">{selectedPlan.description}</p>

                    {exerciseLogs.map((log, index) => (
                      <div key={index} className="exercise-log-card mb-3">
                        <h6 className="mb-3">{log.exercise_name}</h6>
                        <div className="row">
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Sets Completed</label>
                            <input
                              type="number"
                              className="form-control"
                              value={log.sets_completed}
                              onChange={(e) => updateExerciseLog(index, 'sets_completed', parseInt(e.target.value))}
                              min="0"
                              required
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Reps Completed</label>
                            <input
                              type="number"
                              className="form-control"
                              value={log.reps_completed}
                              onChange={(e) => updateExerciseLog(index, 'reps_completed', parseInt(e.target.value))}
                              min="0"
                              required
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Weight Used (lbs)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={log.weight_used || ''}
                              onChange={(e) => updateExerciseLog(index, 'weight_used', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.5"
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Notes</label>
                            <input
                              type="text"
                              className="form-control"
                              value={log.notes || ''}
                              onChange={(e) => updateExerciseLog(index, 'notes', e.target.value)}
                              placeholder="How did it feel?"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gradient-primary"
                    disabled={loading || !selectedPlan}
                  >
                    {loading ? <span className="loading-spinner me-2"></span> : <Save size={16} className="me-2" />}
                    Log Workout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLog;

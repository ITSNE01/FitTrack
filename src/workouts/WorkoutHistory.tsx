import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Search, Filter } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';
import { format } from 'date-fns';

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
}

interface ExerciseLog {
  exercise_name: string;
  sets_completed: number;
  reps_completed: number;
  weight_used?: number;
  notes?: string;
}

interface WorkoutLog {
  id: string;
  workout_plan: WorkoutPlan;
  date: string;
  duration: number;
  exercises: ExerciseLog[];
  created_at: string;
}

const WorkoutHistory: React.FC = () => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchWorkoutLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [workoutLogs, searchTerm, dateFilter]);

  const fetchWorkoutLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/workout-logs/');
      setWorkoutLogs(response.data);
    } catch (error) {
      showToast('Error fetching workout history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...workoutLogs];

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.workout_plan.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.date);
        const filterDate = new Date(dateFilter);
        return logDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredLogs(filtered);
  };

  const getTotalVolume = (log: WorkoutLog) => {
    return log.exercises.reduce((total, exercise) => {
      return total + (exercise.sets_completed * exercise.reps_completed * (exercise.weight_used || 0));
    }, 0);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-2">Workout History</h1>
              <p className="text-muted">Track your fitness journey and progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by workout plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Filter size={16} />
            </span>
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setDateFilter('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stats-card">
            <div className="stats-number">{workoutLogs.length}</div>
            <p className="text-muted mb-0">Total Workouts</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card">
            <div className="stats-number">
              {workoutLogs.reduce((sum, log) => sum + log.duration, 0)}
            </div>
            <p className="text-muted mb-0">Minutes Trained</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card">
            <div className="stats-number">
              {Math.round(workoutLogs.reduce((sum, log) => sum + log.duration, 0) / (workoutLogs.length || 1))}
            </div>
            <p className="text-muted mb-0">Avg Duration</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card">
            <div className="stats-number">
              {Math.round(workoutLogs.reduce((sum, log) => sum + getTotalVolume(log), 0))}
            </div>
            <p className="text-muted mb-0">Total Volume</p>
          </div>
        </div>
      </div>

      {/* Workout Logs */}
      {filteredLogs.length === 0 ? (
        <div className="empty-state">
          <TrendingUp size={64} />
          <h3>No workout history found</h3>
          <p>
            {searchTerm || dateFilter 
              ? 'No workouts match your current filters' 
              : 'Start logging your workouts to see your progress here!'
            }
          </p>
        </div>
      ) : (
        <div className="row">
          {filteredLogs.map((log) => (
            <div key={log.id} className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-1">{log.workout_plan.title}</h5>
                      <p className="text-muted mb-0">{log.workout_plan.description}</p>
                    </div>
                    <TrendingUp className="text-success" size={20} />
                  </div>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center text-muted">
                        <Calendar size={16} className="me-2" />
                        <span>{format(new Date(log.date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-muted">
                        <Clock size={16} className="me-2" />
                        <span>{log.duration} minutes</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="mb-2">Exercises Completed:</h6>
                    {log.exercises.map((exercise, index) => (
                      <div key={index} className="exercise-summary">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-medium">{exercise.exercise_name}</span>
                          <span className="text-muted small">
                            {exercise.sets_completed} × {exercise.reps_completed}
                            {exercise.weight_used && exercise.weight_used > 0 && (
                              <span> @ {exercise.weight_used}lbs</span>
                            )}
                          </span>
                        </div>
                        {exercise.notes && (
                          <p className="text-muted small mb-0 mt-1">"{exercise.notes}"</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      Volume: {getTotalVolume(log)} lbs
                    </div>
                    <div className="text-muted small">
                      {log.exercises.length} exercises
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;

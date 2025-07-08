import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Calendar, Target } from 'lucide-react';
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
  created_at: string;
}

const WorkoutPlans: React.FC = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await axios.delete(`http://localhost:8000/api/workout-plans/${id}/`, {
          headers: {
            Authorization: `Bearer ${user?.access}`,
          },
        });
        setWorkoutPlans(workoutPlans.filter(plan => plan.id !== id));
        showToast('Workout plan deleted successfully', 'success');
      } catch (error) {
        showToast('Error deleting workout plan', 'error');
      }
    }
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
              <h1 className="h2 mb-2">Workout Plans</h1>
              <p className="text-muted">Create and manage your workout routines</p>
            </div>
            <Link to="/workout-plans/new" className="btn btn-gradient-primary">
              <Plus size={16} className="me-2" />
              Create New Plan
            </Link>
          </div>
        </div>
      </div>

      {workoutPlans.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="empty-state">
              <Target size={64} />
              <h3>No workout plans yet</h3>
              <p>Create your first workout plan to get started on your fitness journey!</p>
              <Link to="/workout-plans/new" className="btn btn-gradient-primary">
                <Plus size={16} className="me-2" />
                Create Your First Plan
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {workoutPlans.map((plan) => (
            <div key={plan.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">{plan.title}</h5>
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        Actions
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            to={`/workout-plans/${plan.id}/edit`}
                            className="dropdown-item"
                          >
                            <Edit size={16} className="me-2" />
                            Edit
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDelete(plan.id)}
                          >
                            <Trash2 size={16} className="me-2" />
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="card-text text-muted mb-3">{plan.description}</p>

                  <div className="mb-3">
                    <div className="d-flex align-items-center text-muted mb-2">
                      <Target size={16} className="me-2" />
                      <span>{plan.exercises.length} exercises</span>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <Calendar size={16} className="me-2" />
                      <span>Created {new Date(plan.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="exercises-preview">
                    <h6 className="mb-2">Exercises:</h6>
                    {plan.exercises.slice(0, 3).map((exercise, index) => (
                      <div key={index} className="exercise-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-medium">{exercise.name}</span>
                          <span className="text-muted small">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                      </div>
                    ))}
                    {plan.exercises.length > 3 && (
                      <div className="text-muted small mt-2">
                        +{plan.exercises.length - 3} more exercises
                      </div>
                    )}
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

export default WorkoutPlans;

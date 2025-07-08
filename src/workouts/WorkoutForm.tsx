import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
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
  id?: string;
  title: string;
  description: string;
  exercises: Exercise[];
}

const WorkoutForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WorkoutPlan>({
    title: '',
    description: '',
    exercises: []
  });

  useEffect(() => {
    if (id) {
      fetchWorkoutPlan();
    }
  }, [id]);

  const fetchWorkoutPlan = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/workout-plans/${id}/`, {
        headers: { Authorization: `Bearer ${user?.access}` }
      });
      setPlan(response.data);
    } catch (error) {
      showToast('Error fetching workout plan', 'error');
      navigate('/workout-plans');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (plan.exercises.length === 0) {
      showToast('Please add at least one exercise', 'error');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.access}`,
        },
      };

      if (id) {
        await axios.put(`http://localhost:8000/api/workout-plans/${id}/`, plan, config);
        showToast('Workout plan updated successfully', 'success');
      } else {
        await axios.post('http://localhost:8000/api/workout-plans/', plan, config);
        showToast('Workout plan created successfully', 'success');
      }

      navigate('/workout-plans');
    } catch (error) {
      showToast('Error saving workout plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addExercise = () => {
    setPlan({
      ...plan,
      exercises: [...plan.exercises, { name: '', sets: 3, reps: 10, weight: 0, notes: '' }]
    });
  };

  const removeExercise = (index: number) => {
    setPlan({
      ...plan,
      exercises: plan.exercises.filter((_, i) => i !== index)
    });
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = plan.exercises.map((exercise, i) =>
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setPlan({ ...plan, exercises: updatedExercises });
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
                  onClick={() => navigate('/workout-plans')}
                >
                  <ArrowLeft size={16} />
                </button>
                <h4 className="mb-0">
                  {id ? 'Edit Workout Plan' : 'Create New Workout Plan'}
                </h4>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plan.title}
                    onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                    required
                    placeholder="Enter workout plan title"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={plan.description}
                    onChange={(e) => setPlan({ ...plan, description: e.target.value })}
                    placeholder="Describe your workout plan"
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Exercises</h5>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={addExercise}
                  >
                    <Plus size={16} className="me-2" />
                    Add Exercise
                  </button>
                </div>

                {plan.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-form-card mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Exercise {index + 1}</h6>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeExercise(index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Exercise Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                          required
                          placeholder="e.g., Push-ups"
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <label className="form-label">Sets</label>
                        <input
                          type="number"
                          className="form-control"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <label className="form-label">Reps</label>
                        <input
                          type="number"
                          className="form-control"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <label className="form-label">Weight (lbs)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={exercise.weight || ''}
                          onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.5"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Notes</label>
                      <input
                        type="text"
                        className="form-control"
                        value={exercise.notes || ''}
                        onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                        placeholder="Optional notes about this exercise"
                      />
                    </div>
                  </div>
                ))}

                {plan.exercises.length === 0 && (
                  <div className="empty-state">
                    <Plus size={48} />
                    <p>No exercises added yet</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addExercise}
                    >
                      Add Your First Exercise
                    </button>
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/workout-plans')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-gradient-primary"
                    disabled={loading}
                  >
                    {loading ? <span className="loading-spinner me-2"></span> : <Save size={16} className="me-2" />}
                    {id ? 'Update Plan' : 'Create Plan'}
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

export default WorkoutForm;

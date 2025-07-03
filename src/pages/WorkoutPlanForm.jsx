import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutService, exerciseService } from '../services/api';

const WorkoutPlanForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      fetchWorkout();
    }
  }, [id]);

  const fetchWorkout = async () => {
    try {
      const workoutResponse = await workoutService.getById(id);
      const exerciseResponse = await exerciseService.getByWorkoutId(id);
      
      setTitle(workoutResponse.data.title);
      setDescription(workoutResponse.data.description || '');
      setExercises(exerciseResponse.data);
    } catch (error) {
      console.error('Error fetching workout:', error);
      setError('Error loading workout plan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let workoutId = id;
      
      if (isEdit) {
        await workoutService.update(id, { title, description });
      } else {
        const response = await workoutService.create({ title, description });
        workoutId = response.data.id;
      }

      // Handle exercises
      for (const exercise of exercises) {
        if (exercise.id) {
          // Update existing exercise
          await exerciseService.update(exercise.id, exercise);
        } else {
          // Create new exercise
          await exerciseService.create({
            ...exercise,
            workout_plan_id: workoutId
          });
        }
      }

      navigate('/plans');
    } catch (error) {
      console.error('Error saving workout:', error);
      setError('Error saving workout plan');
    } finally {
      setLoading(false);
    }
  };

  const addExercise = () => {
    setExercises([...exercises, {
      name: '',
      sets: 3,
      reps: 10,
      weight: 0
    }]);
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const removeExercise = async (index) => {
    const exercise = exercises[index];
    
    if (exercise.id) {
      try {
        await exerciseService.delete(exercise.id);
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Error deleting exercise');
        return;
      }
    }
    
    setExercises(exercises.filter((_, i) => i !== index));
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2>{isEdit ? 'Edit Workout Plan' : 'Create New Workout Plan'}</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Exercises</h5>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={addExercise}
                    >
                      Add Exercise
                    </button>
                  </div>
                  
                  {exercises.map((exercise, index) => (
                    <div key={index} className="exercise-item mb-3">
                      <div className="row">
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Exercise name"
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Sets"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                            min="1"
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Reps"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                            min="1"
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Weight"
                            value={exercise.weight}
                            onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <div className="col-md-2">
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeExercise(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/plans')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (isEdit ? 'Update Plan' : 'Create Plan')}
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

export default WorkoutPlanForm;

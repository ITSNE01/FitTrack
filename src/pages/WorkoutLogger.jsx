import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { workoutService, exerciseService, logService } from '../services/api';

const WorkoutLogger = () => {
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [workoutDate, setWorkoutDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchWorkoutData();
  }, [id]);

  const fetchWorkoutData = async () => {
    try {
      const [workoutResponse, exerciseResponse] = await Promise.all([
        workoutService.getById(id),
        exerciseService.getByWorkoutId(id)
      ]);
      
      setWorkout(workoutResponse.data);
      setExercises(exerciseResponse.data.map(exercise => ({
        ...exercise,
        sets_completed: exercise.sets,
        reps_completed: exercise.reps,
        weight_used: exercise.weight
      })));
    } catch (error) {
      console.error('Error fetching workout data:', error);
      setError('Error loading workout data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const logData = {
        workout_plan_id: parseInt(id),
        workout_date: workoutDate,
        notes,
        exercises: exercises.map(exercise => ({
          exercise_id: exercise.id,
          sets_completed: exercise.sets_completed,
          reps_completed: exercise.reps_completed,
          weight_used: exercise.weight_used
        }))
      };

      await logService.create(logData);
      navigate('/history');
    } catch (error) {
      console.error('Error logging workout:', error);
      setError('Error logging workout');
    } finally {
      setLoading(false);
    }
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  if (!workout) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2>Log Workout: {workout.title}</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="workoutDate" className="form-label">Workout Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="workoutDate"
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <h5>Exercises</h5>
                  {exercises.map((exercise, index) => (
                    <div key={exercise.id} className="exercise-item mb-3">
                      <h6>{exercise.name}</h6>
                      <div className="row">
                        <div className="col-md-4">
                          <label className="form-label">Sets Completed</label>
                          <input
                            type="number"
                            className="form-control"
                            value={exercise.sets_completed}
                            onChange={(e) => updateExercise(index, 'sets_completed', parseInt(e.target.value))}
                            min="0"
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Reps Completed</label>
                          <input
                            type="number"
                            className="form-control"
                            value={exercise.reps_completed}
                            onChange={(e) => updateExercise(index, 'reps_completed', parseInt(e.target.value))}
                            min="0"
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Weight Used</label>
                          <input
                            type="number"
                            className="form-control"
                            value={exercise.weight_used}
                            onChange={(e) => updateExercise(index, 'weight_used', parseFloat(e.target.value))}
                            min="0"
                            step="0.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did the workout go?"
                  />
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
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? 'Logging...' : 'Log Workout'}
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

export default WorkoutLogger;

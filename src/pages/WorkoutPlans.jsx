import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { workoutService } from '../services/api';

const WorkoutPlans = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutService.getAll();
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await workoutService.delete(id);
        setWorkouts(workouts.filter(workout => workout.id !== id));
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Error deleting workout plan');
      }
    }
  };

  if (loading) {
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
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Workout Plans</h1>
            <Link to="/plans/new" className="btn btn-primary">
              Create New Plan
            </Link>
          </div>
        </div>
      </div>
      
      <div className="row">
        {workouts.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">No Workout Plans Yet</h5>
                <p className="card-text">Create your first workout plan to get started!</p>
                <Link to="/plans/new" className="btn btn-primary">
                  Create Your First Plan
                </Link>
              </div>
            </div>
          </div>
        ) : (
          workouts.map(workout => (
            <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{workout.title}</h5>
                  <p className="card-text">{workout.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Created: {new Date(workout.created_at).toLocaleDateString()}
                    </small>
                  </p>
                  <div className="d-flex justify-content-between">
                    <Link 
                      to={`/plans/${workout.id}/log`} 
                      className="btn btn-success btn-sm"
                    >
                      Log Workout
                    </Link>
                    <div>
                      <Link 
                        to={`/plans/${workout.id}/edit`} 
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(workout.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutPlans;

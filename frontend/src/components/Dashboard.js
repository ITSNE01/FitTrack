import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login');
    }

    axios.get('workouts/')
      .then((res) => setWorkouts(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      });
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Workout Plans</h2>
      <Link to="/new-workout" className="btn btn-primary mb-3">
        + Add New Workout
      </Link>

      {workouts.length > 0 ? (
        <ul className="list-group">
          {workouts.map((w) => (
            <li key={w.id} className="list-group-item">
              <strong>{w.title}</strong><br />
              <small>{w.description}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No workouts yet. Create your first one!</p>
      )}
    </div>
  );
}

export default Dashboard;

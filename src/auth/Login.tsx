import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/token/', { username, password });

      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Login to FitTrack</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';

import Login from './auth/Login';
import Register from './auth/Register';
import { AuthProvider, useAuth } from './auth/AuthContext';

import Dashboard from './dashboard/Dashboard';
import WorkoutPlans from './workouts/WorkoutPlans';
import WorkoutForm from './workouts/WorkoutForm';
import WorkoutLog from './workouts/WorkoutLog';
import WorkoutHistory from './workouts/WorkoutHistory';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/workout-plans" element={user ? <WorkoutPlans /> : <Navigate to="/login" />} />
        <Route path="/workout-plans/new" element={user ? <WorkoutForm /> : <Navigate to="/login" />} />
        <Route path="/workout-plans/:id/edit" element={user ? <WorkoutForm /> : <Navigate to="/login" />} />
        <Route path="/workout-log" element={user ? <WorkoutLog /> : <Navigate to="/login" />} />
        <Route path="/workout-history" element={user ? <WorkoutHistory /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

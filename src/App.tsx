import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import WorkoutPlans from './components/WorkoutPlans';
import WorkoutForm from './components/WorkoutForm';
import WorkoutLog from './components/WorkoutLog';
import WorkoutHistory from './components/WorkoutHistory';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Toast from './components/Toast';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="loading-spinner"></div>
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
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
      <Toast />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutPlans from './pages/WorkoutPlans';
import WorkoutPlanForm from './pages/WorkoutPlanForm';
import WorkoutLogger from './pages/WorkoutLogger';
import WorkoutHistory from './pages/WorkoutHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container-fluid">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/plans" element={
                <ProtectedRoute>
                  <WorkoutPlans />
                </ProtectedRoute>
              } />
              <Route path="/plans/new" element={
                <ProtectedRoute>
                  <WorkoutPlanForm />
                </ProtectedRoute>
              } />
              <Route path="/plans/:id/edit" element={
                <ProtectedRoute>
                  <WorkoutPlanForm />
                </ProtectedRoute>
              } />
              <Route path="/plans/:id/log" element={
                <ProtectedRoute>
                  <WorkoutLogger />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <WorkoutHistory />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

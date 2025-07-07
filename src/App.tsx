import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ToastProvider } from '@/components/ui/use-toast';

import Login from './auth/Login';
import Register from './auth/Register';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
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
    <ToastProvider>
      {user && <Navbar />}
      <Routes>
        {!user && <Route path="/login" element={<Login />} />}
        {!user && <Route path="/register" element={<Register />} />}
        {user && <Route path="/dashboard" element={<Dashboard />} />}
        {user && <Route path="/workout-plans" element={<WorkoutPlans />} />}
        {user && <Route path="/workout-plans/new" element={<WorkoutForm />} />}
        {user && <Route path="/workout-plans/:id/edit" element={<WorkoutForm />} />}
        {user && <Route path="/workout-log" element={<WorkoutLog />} />}
        {user && <Route path="/workout-history" element={<WorkoutHistory />} />}
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

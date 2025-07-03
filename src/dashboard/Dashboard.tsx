import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Target, TrendingUp, Plus, Dumbbell, Clock, Award } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { format, startOfWeek, endOfWeek } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  exercises: any[];
  created_at: string;
}

interface WorkoutLog {
  id: string;
  workout_plan: WorkoutPlan;
  date: string;
  duration: number;
  exercises: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalPlans: 0,
    weeklyWorkouts: 0,
    averageDuration: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [plansResponse, logsResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/workout-plans/'),
        axios.get('http://localhost:8000/api/workout-logs/')
      ]);

      setWorkoutPlans(plansResponse.data);
      setWorkoutLogs(logsResponse.data);

      // Calculate stats
      const totalWorkouts = logsResponse.data.length;
      const totalPlans = plansResponse.data.length;
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      const weeklyWorkouts = logsResponse.data.filter((log: WorkoutLog) => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      }).length;

      const averageDuration = logsResponse.data.length > 0 
        ? logsResponse.data.reduce((sum: number, log: WorkoutLog) => sum + log.duration, 0) / logsResponse.data.length
        : 0;

      setStats({
        totalWorkouts,
        totalPlans,
        weeklyWorkouts,
        averageDuration
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const workoutFrequencyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Workouts',
        data: [2, 1, 3, 2, 1, 2, 1],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const workoutTypesData = {
    labels: ['Strength', 'Cardio', 'Flexibility', 'Sports'],
    datasets: [
      {
        label: 'Workouts',
        data: [12, 8, 3, 5],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-2">Welcome back, {user?.username}!</h1>
              <p className="text-muted">Here's your fitness overview</p>
            </div>
            <Link to="/workout-log" className="btn btn-gradient-primary">
              <Plus size={16} className="me-2" />
              Log Workout
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1">Total Workouts</p>
                <div className="stats-number">{stats.totalWorkouts}</div>
              </div>
              <Target className="text-primary" size={32} />
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1">Workout Plans</p>
                <div className="stats-number">{stats.totalPlans}</div>
              </div>
              <Dumbbell className="text-primary" size={32} />
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1">This Week</p>
                <div className="stats-number">{stats.weeklyWorkouts}</div>
              </div>
              <Calendar className="text-primary" size={32} />
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted mb-1">Avg Duration</p>
                <div className="stats-number">{Math.round(stats.averageDuration)}<span className="fs-6">min</span></div>
              </div>
              <Clock className="text-primary" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-4">
          <div className="chart-container">
            <h5 className="mb-3">Weekly Workout Frequency</h5>
            <Line data={workoutFrequencyData} options={chartOptions} />
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="chart-container">
            <h5 className="mb-3">Workout Types</h5>
            <Bar data={workoutTypesData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Workouts</h5>
              <Link to="/workout-history" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {workoutLogs.length === 0 ? (
                <div className="empty-state">
                  <Award />
                  <p>No workouts logged yet</p>
                  <Link to="/workout-log" className="btn btn-primary">
                    Log Your First Workout
                  </Link>
                </div>
              ) : (
                workoutLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="workout-history-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{log.workout_plan.title}</h6>
                        <p className="text-muted small mb-0">
                          {format(new Date(log.date), 'MMM dd, yyyy')} • {log.duration} min
                        </p>
                      </div>
                      <TrendingUp className="text-success" size={16} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Your Workout Plans</h5>
              <Link to="/workout-plans" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {workoutPlans.length === 0 ? (
                <div className="empty-state">
                  <Dumbbell />
                  <p>No workout plans created yet</p>
                  <Link to="/workout-plans/new" className="btn btn-primary">
                    Create Your First Plan
                  </Link>
                </div>
              ) : (
                workoutPlans.slice(0, 5).map((plan) => (
                  <div key={plan.id} className="workout-plan-card">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{plan.title}</h6>
                        <p className="text-muted small mb-0">
                          {plan.exercises.length} exercises
                        </p>
                      </div>
                      <Link to={`/workout-plans/${plan.id}/edit`} className="btn btn-sm btn-outline-primary">
                        Edit
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

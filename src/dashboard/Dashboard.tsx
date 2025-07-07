import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../auth/AuthContext";
import {
  Calendar, Target, TrendingUp, Plus, Dumbbell, Clock, Award
} from 'lucide-react';
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
      const token = user?.access;

      const [plansRes, logsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/workout-plans/', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/api/workout-logs/', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const plans = plansRes.data;
      const logs = logsRes.data;

      setWorkoutPlans(plans);
      setWorkoutLogs(logs);

      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());

      const weeklyWorkouts = logs.filter((log: WorkoutLog) => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      }).length;

      const avgDuration = logs.length > 0
        ? logs.reduce((sum: number, log: WorkoutLog) => sum + log.duration, 0) / logs.length
        : 0;

      setStats({
        totalWorkouts: logs.length,
        totalPlans: plans.length,
        weeklyWorkouts,
        averageDuration: avgDuration
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const workoutFrequencyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Workouts',
      data: [2, 1, 3, 2, 1, 2, 1],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4
    }],
  };

  const workoutTypesData = {
    labels: ['Strength', 'Cardio', 'Flexibility', 'Sports'],
    datasets: [{
      label: 'Workouts',
      data: [12, 8, 3, 5],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)',
      ],
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

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
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Welcome back, {user?.username}!</h1>
          <p className="text-muted">Here's your fitness overview</p>
        </div>
        <Link to="/workout-log" className="btn btn-gradient-primary">
          <Plus size={16} className="me-2" /> Log Workout
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="row mb-4">
        <StatsCard label="Total Workouts" value={stats.totalWorkouts} icon={<Target size={32} />} />
        <StatsCard label="Workout Plans" value={stats.totalPlans} icon={<Dumbbell size={32} />} />
        <StatsCard label="This Week" value={stats.weeklyWorkouts} icon={<Calendar size={32} />} />
        <StatsCard label="Avg Duration" value={`${Math.round(stats.averageDuration)} min`} icon={<Clock size={32} />} />
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

      {/* Recent Workouts & Plans */}
      <div className="row">
        <RecentList
          title="Recent Workouts"
          items={workoutLogs}
          emptyMessage="No workouts logged yet"
          buttonText="Log Your First Workout"
          route="/workout-log"
          icon={<Award />}
          renderItem={(log) => (
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">{log.workout_plan.title}</h6>
                <p className="text-muted small mb-0">
                  {format(new Date(log.date), 'MMM dd, yyyy')} • {log.duration} min
                </p>
              </div>
              <TrendingUp className="text-success" size={16} />
            </div>
          )}
        />
        <RecentList
          title="Your Workout Plans"
          items={workoutPlans}
          emptyMessage="No workout plans created yet"
          buttonText="Create Your First Plan"
          route="/workout-plans/new"
          icon={<Dumbbell />}
          renderItem={(plan) => (
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">{plan.title}</h6>
                <p className="text-muted small mb-0">{plan.exercises.length} exercises</p>
              </div>
              <Link to={`/workout-plans/${plan.id}/edit`} className="btn btn-sm btn-outline-primary">Edit</Link>
            </div>
          )}
        />
      </div>
    </div>
  );
};

const StatsCard = ({ label, value, icon }: { label: string; value: any; icon: React.ReactNode }) => (
  <div className="col-md-3 col-sm-6 mb-3">
    <div className="stats-card d-flex align-items-center justify-content-between">
      <div>
        <p className="text-muted mb-1">{label}</p>
        <div className="stats-number">{value}</div>
      </div>
      {icon}
    </div>
  </div>
);

const RecentList = ({ title, items, emptyMessage, buttonText, route, icon, renderItem }: any) => (
  <div className="col-lg-6 mb-4">
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        <Link to={route.replace('/new', '')} className="btn btn-sm btn-outline-primary">View All</Link>
      </div>
      <div className="card-body">
        {items.length === 0 ? (
          <div className="empty-state text-center">
            {icon}
            <p>{emptyMessage}</p>
            <Link to={route} className="btn btn-primary">{buttonText}</Link>
          </div>
        ) : (
          items.slice(0, 5).map((item: any) => (
            <div key={item.id} className="mb-3">{renderItem(item)}</div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default Dashboard;

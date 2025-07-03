import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { logService } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    weeklyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await logService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: stats.weeklyStats.map(stat => `Week ${stat.week.split('-')[1]}`),
    datasets: [
      {
        label: 'Workouts per Week',
        data: stats.weeklyStats.map(stat => stat.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Workout Progress'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
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
          <h1 className="mb-4">Dashboard</h1>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="stats-card">
            <h3>{stats.totalWorkouts}</h3>
            <p className="mb-0">Total Workouts</p>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="stats-card">
            <h3>{stats.thisWeek}</h3>
            <p className="mb-0">This Week</p>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Workout Plans</h5>
              <p className="card-text">Create and manage your workout routines</p>
              <Link to="/plans" className="btn btn-primary">
                View Plans
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Workout History</h5>
              <p className="card-text">Review your completed workouts</p>
              <Link to="/history" className="btn btn-success">
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

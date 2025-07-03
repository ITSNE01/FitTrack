import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { logService } from '../services/api';

const WorkoutHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await logService.getAll();
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching workout logs:', error);
    } finally {
      setLoading(false);
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
          <h1 className="mb-4">Workout History</h1>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          {logs.length === 0 ? (
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">No Workout History Yet</h5>
                <p className="card-text">Complete your first workout to see it here!</p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                {logs.map(log => (
                  <div key={log.id} className="workout-log-item mb-3 pb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{log.workout_title}</h5>
                        <p className="mb-1">
                          <strong>Date:</strong> {format(new Date(log.workout_date), 'PPP')}
                        </p>
                        {log.notes && (
                          <p className="mb-1">
                            <strong>Notes:</strong> {log.notes}
                          </p>
                        )}
                        <p className="mb-0">
                          <small className="text-muted">
                            Logged: {format(new Date(log.created_at), 'PPp')}
                          </small>
                        </p>
                      </div>
                      <span className="badge bg-success">Completed</span>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutHistory;

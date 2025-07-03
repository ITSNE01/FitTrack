import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get workout logs for user
router.get('/', authenticateToken, (req, res) => {
  db.all(
    `SELECT wl.*, wp.title as workout_title
     FROM workout_logs wl
     JOIN workout_plans wp ON wl.workout_plan_id = wp.id
     WHERE wl.user_id = ?
     ORDER BY wl.workout_date DESC`,
    [req.user.id],
    (err, logs) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.json(logs);
    }
  );
});

// Get dashboard stats
router.get('/stats', authenticateToken, (req, res) => {
  const queries = [
    // Total workouts
    new Promise((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as total FROM workout_logs WHERE user_id = ?',
        [req.user.id],
        (err, result) => {
          if (err) reject(err);
          else resolve({ totalWorkouts: result.total });
        }
      );
    }),
    // This week's workouts
    new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as total FROM workout_logs 
         WHERE user_id = ? AND workout_date >= date('now', '-7 days')`,
        [req.user.id],
        (err, result) => {
          if (err) reject(err);
          else resolve({ thisWeek: result.total });
        }
      );
    }),
    // Weekly stats for chart
    new Promise((resolve, reject) => {
      db.all(
        `SELECT 
           strftime('%Y-%W', workout_date) as week,
           COUNT(*) as count
         FROM workout_logs 
         WHERE user_id = ? AND workout_date >= date('now', '-8 weeks')
         GROUP BY strftime('%Y-%W', workout_date)
         ORDER BY week`,
        [req.user.id],
        (err, results) => {
          if (err) reject(err);
          else resolve({ weeklyStats: results });
        }
      );
    })
  ];

  Promise.all(queries)
    .then(results => {
      const stats = Object.assign({}, ...results);
      res.json(stats);
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' });
    });
});

// Create workout log
router.post('/', authenticateToken, (req, res) => {
  const { workout_plan_id, workout_date, notes, exercises } = req.body;

  // Verify workout belongs to user
  db.get(
    'SELECT * FROM workout_plans WHERE id = ? AND user_id = ?',
    [workout_plan_id, req.user.id],
    (err, plan) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (!plan) {
        return res.status(404).json({ message: 'Workout plan not found' });
      }

      // Create workout log
      db.run(
        'INSERT INTO workout_logs (user_id, workout_plan_id, workout_date, notes) VALUES (?, ?, ?, ?)',
        [req.user.id, workout_plan_id, workout_date, notes],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }

          const workoutLogId = this.lastID;

          // Add exercise logs
          if (exercises && exercises.length > 0) {
            const insertExerciseLog = db.prepare(
              'INSERT INTO exercise_logs (workout_log_id, exercise_id, sets_completed, reps_completed, weight_used) VALUES (?, ?, ?, ?, ?)'
            );

            exercises.forEach(exercise => {
              insertExerciseLog.run(
                workoutLogId,
                exercise.exercise_id,
                exercise.sets_completed,
                exercise.reps_completed,
                exercise.weight_used || 0
              );
            });

            insertExerciseLog.finalize();
          }

          res.status(201).json({
            id: workoutLogId,
            message: 'Workout logged successfully'
          });
        }
      );
    }
  );
});

export default router;

import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get exercises for a workout plan
router.get('/workout/:workoutId', authenticateToken, (req, res) => {
  // First verify the workout belongs to the user
  db.get(
    'SELECT * FROM workout_plans WHERE id = ? AND user_id = ?',
    [req.params.workoutId, req.user.id],
    (err, plan) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (!plan) {
        return res.status(404).json({ message: 'Workout plan not found' });
      }

      // Get exercises
      db.all(
        'SELECT * FROM exercises WHERE workout_plan_id = ? ORDER BY created_at',
        [req.params.workoutId],
        (err, exercises) => {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }
          res.json(exercises);
        }
      );
    }
  );
});

// Create exercise
router.post('/', authenticateToken, (req, res) => {
  const { workout_plan_id, name, sets, reps, weight } = req.body;

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

      db.run(
        'INSERT INTO exercises (workout_plan_id, name, sets, reps, weight) VALUES (?, ?, ?, ?, ?)',
        [workout_plan_id, name, sets, reps, weight || 0],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }
          res.status(201).json({
            id: this.lastID,
            workout_plan_id,
            name,
            sets,
            reps,
            weight: weight || 0
          });
        }
      );
    }
  );
});

// Update exercise
router.put('/:id', authenticateToken, (req, res) => {
  const { name, sets, reps, weight } = req.body;

  // Verify exercise belongs to user's workout
  db.get(
    `SELECT e.*, wp.user_id FROM exercises e
     JOIN workout_plans wp ON e.workout_plan_id = wp.id
     WHERE e.id = ? AND wp.user_id = ?`,
    [req.params.id, req.user.id],
    (err, exercise) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }

      db.run(
        'UPDATE exercises SET name = ?, sets = ?, reps = ?, weight = ? WHERE id = ?',
        [name, sets, reps, weight || 0, req.params.id],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }
          res.json({ message: 'Exercise updated successfully' });
        }
      );
    }
  );
});

// Delete exercise
router.delete('/:id', authenticateToken, (req, res) => {
  // Verify exercise belongs to user's workout
  db.get(
    `SELECT e.*, wp.user_id FROM exercises e
     JOIN workout_plans wp ON e.workout_plan_id = wp.id
     WHERE e.id = ? AND wp.user_id = ?`,
    [req.params.id, req.user.id],
    (err, exercise) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (!exercise) {
        return res.status(404).json({ message: 'Exercise not found' });
      }

      db.run(
        'DELETE FROM exercises WHERE id = ?',
        [req.params.id],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }
          res.json({ message: 'Exercise deleted successfully' });
        }
      );
    }
  );
});

export default router;

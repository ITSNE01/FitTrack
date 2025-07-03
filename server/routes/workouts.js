import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all workout plans for user
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM workout_plans WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, plans) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.json(plans);
    }
  );
});

// Get workout plan by ID
router.get('/:id', authenticateToken, (req, res) => {
  db.get(
    'SELECT * FROM workout_plans WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err, plan) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (!plan) {
        return res.status(404).json({ message: 'Workout plan not found' });
      }
      res.json(plan);
    }
  );
});

// Create workout plan
router.post('/', authenticateToken, (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  db.run(
    'INSERT INTO workout_plans (user_id, title, description) VALUES (?, ?, ?)',
    [req.user.id, title, description],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({
        id: this.lastID,
        title,
        description,
        user_id: req.user.id
      });
    }
  );
});

// Update workout plan
router.put('/:id', authenticateToken, (req, res) => {
  const { title, description } = req.body;

  db.run(
    'UPDATE workout_plans SET title = ?, description = ? WHERE id = ? AND user_id = ?',
    [title, description, req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Workout plan not found' });
      }
      res.json({ message: 'Workout plan updated successfully' });
    }
  );
});

// Delete workout plan
router.delete('/:id', authenticateToken, (req, res) => {
  db.run(
    'DELETE FROM workout_plans WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Workout plan not found' });
      }
      res.json({ message: 'Workout plan deleted successfully' });
    }
  );
});

export default router;

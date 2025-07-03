import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workouts.js';
import exerciseRoutes from './routes/exercises.js';
import logRoutes from './routes/logs.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'FitTrack API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

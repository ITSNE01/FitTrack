import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./fittrack.db');

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Workout plans table
      db.run(`
        CREATE TABLE IF NOT EXISTS workout_plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Exercises table
      db.run(`
        CREATE TABLE IF NOT EXISTS exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workout_plan_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          sets INTEGER NOT NULL,
          reps INTEGER NOT NULL,
          weight REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (workout_plan_id) REFERENCES workout_plans (id)
        )
      `);

      // Workout logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS workout_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          workout_plan_id INTEGER NOT NULL,
          workout_date DATE NOT NULL,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (workout_plan_id) REFERENCES workout_plans (id)
        )
      `);

      // Exercise logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS exercise_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workout_log_id INTEGER NOT NULL,
          exercise_id INTEGER NOT NULL,
          sets_completed INTEGER NOT NULL,
          reps_completed INTEGER NOT NULL,
          weight_used REAL DEFAULT 0,
          FOREIGN KEY (workout_log_id) REFERENCES workout_logs (id),
          FOREIGN KEY (exercise_id) REFERENCES exercises (id)
        )
      `);

      resolve();
    });
  });
};

export default db;

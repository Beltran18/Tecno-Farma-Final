import { Pool } from 'pg';

// Using Neon / PostgreSQL with a connection string from the environment.
// Pool is exported directly so callers can run `await pool.query(...)`.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;

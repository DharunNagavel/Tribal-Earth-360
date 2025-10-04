import { DATABASE_URL } from './config/env.js';
import { Pool } from "pg";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    required: true,
    rejectUnauthorized: false, 
  },
});

export default pool;

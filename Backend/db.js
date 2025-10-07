import { DATABASE_URL } from './config/env.js';
import { Pool } from "pg";

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'Tribal 360',
//     password: 'dharun@2005',
//     port: 5432,
// });

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    required: true,
    rejectUnauthorized: false, 
  },
});

export default pool;

import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Tribal 360',
    password: 'dharun@2005',
    port: 5432,
});

export default pool;
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.PGHOST || '127.0.0.1',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || undefined,
      database: process.env.PGDATABASE || 'crop_advisory_db',
    };

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[Database Pool Error]:', err.message);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      // console.log(`[SQL Query] (${duration}ms):`, text.split('\n')[0]);
    }
    return res;
  } catch (error) {
    console.error('[SQL Execution Error]:', error.message);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time, version() as pg_version');
    client.release();
    console.log('[Database Connected]:', res.rows[0].current_time);
    return true;
  } catch (err) {
    console.error('[Database Connection Failed]:', err.message);
    return false;
  }
};

export default { pool, query, testConnection };

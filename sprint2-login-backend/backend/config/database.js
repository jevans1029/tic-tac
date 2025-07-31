// backend/config/database.js
import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs    from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';
import { dirname }       from 'path';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Path to your bundled CA cert
const caPath = path.join(__dirname, 'DigiCertGlobalRootCA.crt.pem');

// Read it once at startup
const caCert = fs.readFileSync(caPath);

console.log('Loaded CA cert from:', caPath);
console.log('Connecting to', `${process.env.DB_HOST}:${process.env.DB_PORT}`);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: false // Disable SSL for local development
});

const maxRetries = 5;
const retryInterval = 5000; // 5 seconds

const connectWithRetry = async (retries = maxRetries) => {
  try {
    const conn = await pool.getConnection();
    console.log('Successfully connected to MySQL');
    conn.release();
    return true;
  } catch (err) {
    console.log(`MySQL connection attempt failed (${maxRetries - retries + 1}/${maxRetries}):`, err.message);
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, retryInterval));
      return connectWithRetry(retries - 1);
    }
    console.error('Max retries reached. Could not connect to MySQL.');
    // Don't throw error - let the application continue
    return false;
  }
};

// Initial connection attempt
connectWithRetry();

export default pool;



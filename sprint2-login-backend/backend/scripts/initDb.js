import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

async function initializeDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const sql = fs.readFileSync(path.join(process.cwd(), 'init.sql'), 'utf8');
  
  try {
    await connection.execute(sql);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await connection.end();
  }
}

initializeDb();

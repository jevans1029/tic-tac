// Jest setup file for SQL injection tests
const db = require('./db');

// Ensure database connection is ready before tests
beforeAll(async () => {
  try {
    // Test database connection
    await db.query('SELECT 1');
    console.log('✅ Test database connection established');
    
    // Ensure test tables exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL REFERENCES users(username),
        winner TEXT,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create a test table that we'll try to drop via SQL injection
    await db.query(`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        test_data TEXT
      );
    `);
    console.log('✅ Test table created for SQL injection detection');
    
  } catch (err) {
    console.error('❌ Test database setup failed:', err);
    throw err;
  }
});

// Clean up after all tests
afterAll(async () => {
  try {
    // Clean up any test data
    await db.query('DELETE FROM games WHERE username LIKE \'test%\'');
    await db.query('DELETE FROM users WHERE username LIKE \'test%\'');
    
    // Clean up test table (recreate it if it was dropped by SQL injection)
    await db.query('DROP TABLE IF EXISTS test_table');
    
    console.log('✅ Test cleanup completed');
  } catch (err) {
    console.error('❌ Test cleanup failed:', err);
  }
});

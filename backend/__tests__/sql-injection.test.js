const request = require('supertest');
const db = require('../db');
const bcrypt = require('bcrypt');

// We'll test against a running server instance
const BASE_URL = 'http://localhost:8000';

describe('SQL Injection Security Tests', () => {
  let testUser;
  let authenticatedAgent;

  beforeAll(async () => {

    // Create test user
    testUser = {
      username: 'testuser',
      password: 'testpass123'
    };

    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    
    try {
      await db.query(
        'INSERT INTO users(username, password) VALUES($1, $2) ON CONFLICT (username) DO NOTHING',
        [testUser.username, hashedPassword]
      );
    } catch (err) {
      // User might already exist, ignore error
    }

    // Create authenticated session against the running server
    authenticatedAgent = request.agent(BASE_URL);
    await authenticatedAgent
      .post('/login')
      .send(testUser)
      .expect(200);
  });

  afterAll(async () => {
    // Clean up test data - DELETE games FIRST, then users (due to foreign key constraint)
    try {
      await db.query('DELETE FROM games WHERE username = $1', [testUser.username]);
      await db.query('DELETE FROM users WHERE username = $1', [testUser.username]);
    } catch (err) {
      console.error('Cleanup error:', err);
    }
  });

  describe('POST /game - SQL Injection Security Tests', () => {
    test('should NOT be vulnerable to SQL injection via winner parameter', async () => {
      // First verify the test table exists before our attack
      const tableCheckBefore = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'test_table'
        );
      `);
      expect(tableCheckBefore.rows[0].exists).toBe(true);
      
      // This payload would drop the test_table if SQL injection is working
      const maliciousPayload = "X'); DROP TABLE IF EXISTS test_table; --";
      
      const response = await authenticatedAgent
        .post('/game')
        .send({ winner: maliciousPayload });
      
      // CRITICAL: Check if the test_table still exists after the "attack"
      const tableCheckAfter = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'test_table'
        );
      `);
      
      // If SQL injection is properly prevented, the table should still exist
      expect(tableCheckAfter.rows[0].exists).toBe(true);
    });

    test('should NOT allow malicious data injection', async () => {
      // This payload attempts to inject additional database records
      const injectionPayload = "X'); INSERT INTO games(username, winner) VALUES('testuser', 'INJECTED_DATA'); --";
      
      const response = await authenticatedAgent
        .post('/game')
        .send({ winner: injectionPayload });
      
      // Check that NO injected data exists in the database
      const result = await db.query(
        'SELECT * FROM games WHERE winner = $1',
        ['INJECTED_DATA']
      );
      
      // CRITICAL: If SQL injection is properly prevented, we should find NO injected records
      expect(result.rows.length).toBe(0);
      
      // Clean up
      await db.query('DELETE FROM games WHERE winner = $1', [injectionPayload]);
    });

    test('legitimate game data should work normally', async () => {
      // Verify that normal, non-malicious data still works
      const response = await authenticatedAgent
        .post('/game')
        .send({ winner: 'Player1' })
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(typeof response.body.id).toBe('number');
    });
  });
});

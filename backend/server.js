const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

// Create the table if it doesn't exist
async function initDb() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        winner VARCHAR(1),
        moves INT
      )
    `);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
  }
}

app.post('/log-game', async (req, res) => {
  const { winner, moves } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO games(winner, moves) VALUES ($1, $2) RETURNING id',
      [winner, moves]
    );
    res.json({ status: 'saved', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server after initializing DB
initDb().then(() => {
  app.listen(8000, () => {
    console.log('🚀 Backend running on http://localhost:8000');
  });
});

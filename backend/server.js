const express = require('express');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passport-config');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();

// ✅ CORS Setup
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

initializePassport(passport);

// ✅ Middleware
app.use(express.json());
app.use(session({
  secret: 'replace-this-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

function isSafeUsername(username) {
  return /^[a-zA-Z0-9_-]+$/.test(username);
}

// For passwords: allow special characters, but block dangerous ones
function isSafePassword(password) {
  return !/[;'"\\]/.test(password); // blocks ; ' " and backslash
}

// ✅ Centralized input validation middleware
function validateCredentials(req, res, next) {
  const { username, password } = req.body;
  if (!isSafeUsername(username) || !isSafePassword(password)) {
    return res.status(400).json({ error: 'Invalid characters in input' });
  }
  next();
}

// ✅ Initialize DB tables
async function initDb() {
  try {
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
        player_x TEXT NOT NULL,
        player_o TEXT NOT NULL,
        winner TEXT,
        moves JSONB NOT NULL,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
  }
}

// ✅ Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!isSafeUsername(username) || !isSafePassword(password)) {
    return res.status(400).json({ error: 'Invalid characters in input' });
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.query(
      'INSERT INTO users(username, password) VALUES($1, $2)',
      [username, hashed]
    );
    res.status(201).json({ status: 'registered' });
  } catch (e) {
    res.status(500).json({ error: 'User creation failed' });
  }
});

// ✅ Login (with custom passport wrapper)
app.post('/login', validateCredentials, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    req.login(user, err => {
      if (err) return next(err);
      res.json({ status: 'logged in' });
    });
  })(req, res, next);
});

// ✅ Protected test route
app.get('/protected', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'You are authenticated!' });
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
});

// ✅ Launch server after DB ready
initDb().then(() => {
  app.listen(8000, () => {
    console.log('🚀 Server running on http://localhost:8000');
  });
});

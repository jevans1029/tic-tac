const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    try {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) return done(null, false, { message: 'No user found' });

      const match = await bcrypt.compare(password, user.password);
      if (match) return done(null, user);
      else return done(null, false, { message: 'Incorrect password' });
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy(authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, res.rows[0]);
  });
}

module.exports = initialize;

/**
 * index.js
 *
 * Main entry point for the backend. Sets up the Express server,
 * establishes a connection to the database, and configures routes
 * and middleware for production deployment.
 */

import 'dotenv/config';  // loads .env
console.log('Configured FRONTEND_URL=', process.env.FRONTEND_URL);

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';                   // Import cors
import authRoutes from './routes/auth.js'; // Authentication routes

const app = express();
// Use BACKEND_PORT for local dev
const BACKEND_PORT = process.env.BACKEND_PORT;
// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies attached to client requests

app.use((req, res, next) => {
  console.log('Incoming Origin:', req.headers.origin);
  next();
});
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Route setup
app.use('/', authRoutes); // Authentication-related routes

// Start the server
app.listen(BACKEND_PORT, () => {
  console.log(`Server is running on ${BACKEND_PORT}`);
});

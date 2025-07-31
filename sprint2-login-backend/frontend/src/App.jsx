/**
 * App.js
 * 
 * Main entry point of the application with persistent authentication using local storage.
 * It sets up routing for the login, register, and map pages, and manages authentication state.
 */

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MapPage from './pages/MapPage';
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * Main application component that manages authentication and routing.
 * @returns {JSX.Element} The rendered application with routes.
 */
function App() {
  const [authenticated, setAuthenticated] = useState(false);

  // Load auth state from localStorage when app initializes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthenticated(!!token); // true if token exists
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect base route based on auth state */}
        <Route
          path="/"
          element={<Navigate to={authenticated ? "/map" : "/login"} replace />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={
            authenticated ? (
              <Navigate to="/map" replace />
            ) : (
              <Login setAuthenticated={setAuthenticated} />
            )
          }
        />

        {/* Register Route */}
        <Route
          path="/register"
          element={
            authenticated ? (
              <Navigate to="/map" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Map Page Route */}
        <Route
          path="/map"
          element={
            authenticated ? (
              <MapPage setAuthenticated={setAuthenticated} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

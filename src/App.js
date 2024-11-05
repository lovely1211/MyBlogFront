import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import PostList from './pages/PostList';
import PostForm from './pages/PostForm';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('token')) // Initial value based on token presence
  );

  const handleLogin = (token) => {
    // Set the authentication state and store the token in localStorage
    setIsAuthenticated(true);
    localStorage.setItem('token', token); // Save the token
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token'); 
  };

  useEffect(() => {
    // Optional: Keep `isAuthenticated` in sync with `localStorage` on mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <PostList /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Auth onLogin={handleLogin} />}
        />
        <Route
          path="/create-post"
          element={isAuthenticated ? <PostForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-post/:id"
          element={isAuthenticated ? <PostForm /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;

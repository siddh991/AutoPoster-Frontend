import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const PrivateRoute = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Add user state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        setIsAuthenticated(true);
        setUser(user); // Set user state
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const signOut = () => {
    Auth.signOut()
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
      })
      .catch(err => console.log('Error signing out: ', err));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Component user={user} signOut={signOut} /> : <Navigate to="/login" />; // Pass user and signOut as props
};

export default PrivateRoute;

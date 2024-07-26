import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { checkUserDetails } from '../apis/getUserInfo';

const PrivateRoute = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticatedUser = await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
      setUser(authenticatedUser);
  
      const userDetails = await checkUserDetails(authenticatedUser.username);
      setHasCompletedProfile(!!userDetails && Object.keys(userDetails).length > 0);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = () => {
    Auth.signOut()
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
      })
      .catch(err => console.error('Error signing out: ', err));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && !hasCompletedProfile) {
    return <Navigate to="/complete-profile" />;
  }

  return <Component user={user} signOut={signOut} />;
};

export default PrivateRoute;

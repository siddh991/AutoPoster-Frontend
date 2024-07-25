import React, { useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';
import { checkUserDetails } from '../apis/getUserInfo';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const checkUserDetailsStatus = async (user) => {
      try {
        console.log('Checking user details for:', user.username);
        const userDetails = await checkUserDetails(user.username);
        console.log('User details:', userDetails);
        if (!userDetails || (Array.isArray(userDetails) && userDetails.length === 0)) {
          console.log('Setting new user to true');
          setIsNewUser(true);
        } else {
          console.log('Setting new user to false');
          setIsNewUser(false);
        }
      } catch (error) {
        console.error('Error checking user details:', error);
        setIsNewUser(true);
      }
    };

    if (authUser) {
      checkUserDetailsStatus(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser !== null && isNewUser !== null) {
      console.log('Auth User:', authUser);
      console.log('Is New User:', isNewUser);
      if (isNewUser) {
        console.log('Navigating to complete profile');
        // Pass only necessary, serializable user data
        navigate('/complete-profile', { 
          state: { 
            username: authUser.username,
            email: authUser.attributes?.email
          } 
        });
      } else {
        console.log('Navigating to dashboard');
        navigate('/dashboard');
      }
    }
  }, [isNewUser, authUser, navigate]);

  return (
    <div className="auth-container">
      <Authenticator>
        {({ signOut, user }) => {
          if (user && !authUser) {
            console.log('User authenticated:', user);
            setAuthUser(user);
          }
          return (
            <main>
              <h1>Welcome, User</h1>
            </main>
          );
        }}
      </Authenticator>
    </div>
  );
};

export default AuthPage;


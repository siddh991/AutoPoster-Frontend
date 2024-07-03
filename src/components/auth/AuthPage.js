import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';



const AuthPage = () => {
  const navigate = useNavigate();
  return(
    <div className="auth-container">
      <Authenticator>
        {({ signOut, user }) => {
          if (user) {
            navigate('/dashboard');
            return null;
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

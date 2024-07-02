import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './AuthPage.css';
import Dashboard from '../dashboard/Dashboard'; 


const AuthPage = () => (
  <div className="auth-container">
    <Authenticator>
      {({ signOut, user }) => (
        user ? (
          <Dashboard user={user} signOut={signOut} />
        ) : (
          <main>
            <h1>Welcome, User</h1>
          </main>
        )
      )}
    </Authenticator>
  </div>
);

export default AuthPage;

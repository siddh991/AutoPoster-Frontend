import React, { useEffect } from 'react';
import './assets/styles/App.css';
import awsconfig from './aws-exports';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Header from './components/header/header';
import Footer from './components/Footer';
import Homepage from './components/homepage/Homepage';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import Home from "./components/tiktokOauth/Home";
import Redirect from "./components/tiktokOauth/Redirect";
import PrivateRoute from './components/auth/PrivateAuth';
import PromptGenForm from './components/forms/PromptGenForm';
import { useAuthStore } from './stores/authStore';

// Configure Amplify
Amplify.configure({...awsconfig, ssr: true});

/**
 * Main App component that sets up routing and initializes auth state
 */
const App: React.FC = () => {
  // Get checkAuthState from auth store
  const { checkAuthState } = useAuthStore();

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuthState();
      } catch (error) {
        console.error('Error initializing auth state:', error);
      }
    };

    initializeAuth();
  }, [checkAuthState]);

  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: '1', marginLeft: '1%', marginRight: '1%' }}>
          <Routes>
            <Route path="/" element={<Homepage />} />  {/* Public Home Page */}
            <Route path="/login" element={<AuthPage />} />  {/* Login/Sign Up Page */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/tiktok-setup" element={<PrivateRoute element={Home} />} />
            <Route path="/tiktok-redirect" element={<PrivateRoute element={Redirect} />} />
            <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />  {/* Protected Dashboard */}
            <Route path="/complete-profile" element={<PrivateRoute element={PromptGenForm} />} />  {/* Profile Completion Form */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
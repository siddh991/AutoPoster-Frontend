import './assets/styles/App.css';
import awsconfig from './aws-exports';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Header from './components/header/header.js';
import Homepage from './components/homepage/Homepage.js';
import AuthPage from './components/auth/AuthPage.js';
import Dashboard from './components/dashboard/Dashboard.js';
import Home from "./components/tiktokOauth/Home";
import Redirect from "./components/tiktokOauth/Redirect";
import PrivateRoute from './components/auth/PrivateAuth.js';

Amplify.configure(awsconfig);

export default function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main style={{ marginLeft: '1%', marginRight: '1%' }}>
          <Routes>
            <Route path="/" element={<Homepage />} />  {/* Public Home Page */}
            <Route path="/login" element={<AuthPage />} />  {/* Login/Sign Up Page */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/tiktok-setup" element={<PrivateRoute element={Home} />} />
            <Route path="/tiktok-redirect" element={<PrivateRoute element={Redirect} />} />
            <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />  {/* Protected Dashboard */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

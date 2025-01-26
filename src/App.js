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
import TiktokHome from "./components/tiktokOauth/Home";
import TiktokRedirect from "./components/tiktokOauth/Redirect";
import InstagramHome from "./components/instaOauth/Home";
import InstagramRedirect from "./components/instaOauth/Redirect";
import PrivateRoute from './components/auth/PrivateAuth.js';
import PromptGenForm from './components/forms/PromptGenForm';
import InstagramDeauthorize from './components/instaOauth/Deauthorize';
import InstagramDelete from './components/instaOauth/Delete';

Amplify.configure({...awsconfig, ssr: true});

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
            <Route path="/tiktok-setup" element={<PrivateRoute element={TiktokHome} />} />
            <Route path="/tiktok-redirect" element={<PrivateRoute element={TiktokRedirect} />} />
            <Route path="/instagram-setup" element={<PrivateRoute element={InstagramHome} />} />
            <Route path="/instagram-redirect" element={<PrivateRoute element={InstagramRedirect} />} />
            <Route path="/instagram-deauthorize" element={<InstagramDeauthorize />} />
            <Route path="/instagram-delete" element={<InstagramDelete />} />
            <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />  {/* Protected Dashboard */}
            <Route path="/complete-profile" element={<PromptGenForm />} />  {/* Profile Completion Form */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

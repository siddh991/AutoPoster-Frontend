import React, { useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserDetailsStore } from '../../stores/userDetailsStore';
import { Box, Typography, CircularProgress, Paper, Container } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

/**
 * AuthPage component handles user authentication and routing
 * Integrates AWS Amplify Authenticator with our Zustand auth store
 */
const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [amplifyUser, setAmplifyUser] = useState<any>(null);
  
  // Use our stores
  const { user, setUserFromAmplify } = useAuthStore();
  const { userDetails, fetchUserDetails } = useUserDetailsStore();
  
  console.log('AuthPage render - User:', user?.username);
  console.log('AuthPage render - UserDetails:', userDetails ? 'exists' : 'null');
  
  // Handle Amplify user authentication when it changes
  useEffect(() => {
    const processAmplifyAuth = async () => {
      if (amplifyUser && !user && !isProcessing) {
        setIsProcessing(true);
        console.log('Processing Amplify authentication for:', amplifyUser.username);
        
        try {
          // Update our auth store with the Amplify user
          setUserFromAmplify(amplifyUser);
        } catch (error) {
          console.error('Error processing Amplify auth:', error);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    processAmplifyAuth();
  }, [amplifyUser, user, setUserFromAmplify, isProcessing]);

  // Check user details and navigate once we have a user
  useEffect(() => {
    const checkUserDetailsAndNavigate = async () => {
      if (!user || isProcessing) return;
      
      console.log('Checking user details for navigation...');
      
      try {
        // Fetch user details
        const fetchedDetails = await fetchUserDetails(user.username);
        
        if (fetchedDetails) {
          console.log('User has details, navigating to dashboard');
          navigate('/dashboard');
        } else {
          console.log('User has no details, navigating to complete profile');
          navigate('/complete-profile', { 
            state: { 
              username: user.username,
              email: user.attributes?.email
            } 
          });
        }
      } catch (error) {
        console.error('Error checking user details:', error);
        // On error, assume new user
        navigate('/complete-profile', { 
          state: { 
            username: user.username,
            email: user.attributes?.email
          } 
        });
      }
    };

    checkUserDetailsAndNavigate();
  }, [user, navigate, fetchUserDetails, isProcessing]);

  return (
    <div className="auth-container">
      <Authenticator>
        {({ signOut: amplifySignOut, user: currentAmplifyUser }) => {
          // Only update amplifyUser state if it's different from current
          if (currentAmplifyUser && currentAmplifyUser !== amplifyUser) {
            console.log('Amplify authenticated user:', currentAmplifyUser.username);
            setAmplifyUser(currentAmplifyUser);
          }
          
          // Return nothing - the effects will handle navigation
          return (
            <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fafbfc 0%, #f3f4f6 100%)', py: 8 }}>
              <Container maxWidth="md">
                {/* Loading Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', mb: 3 }}>
                    <AccountCircleIcon sx={{ fontSize: 48, color: '#667eea' }} />
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
                    Loading Your Workspace
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', mb: 4 }}>
                    Verifying your access and preparing your content...
                  </Typography>
                </Box>

                {/* Loading Content */}
                <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid rgba(102, 126, 234, 0.08)' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                    <CircularProgress 
                      size={48} 
                      sx={{ 
                        color: '#667eea',
                        mb: 3
                      }} 
                    />
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: '#1e293b', 
                      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                      mb: 2
                    }}>
                      Authenticating access...
                    </Typography>
                  </Box>
                </Paper>
              </Container>
            </Box>
          );
        }}
      </Authenticator>
    </div>
  );
};

export default AuthPage;

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuthStore } from '../../stores/authStore';
import { useUserDetailsStore } from '../../stores/userDetailsStore';
import { PrivateRouteProps } from '../../types/props';

/**
 * PrivateRoute component for protecting routes that require authentication
 * Uses Zustand stores for auth and user details management
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component }) => {
  // Use our stores for authentication and user details
  const { user, checkAuthState, signOut } = useAuthStore();
  const { userDetails, fetchUserDetails } = useUserDetailsStore();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [detailsChecked, setDetailsChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First, check if user is authenticated
        await checkAuthState();
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [checkAuthState]);

  // Separate effect for user details to prevent race conditions
  useEffect(() => {
    const checkUserDetails = async () => {
      if (user && !loading && !detailsChecked) {
        console.log('PrivateRoute: Checking user details for', user.username);
        
        try {
          await fetchUserDetails(user.username);
        } catch (error) {
          console.error('PrivateRoute: Error fetching user details:', error);
        } finally {
          setDetailsChecked(true);
        }
      }
    };

    checkUserDetails();
  }, [user, loading, detailsChecked, fetchUserDetails]);

  if (loading || (user && !detailsChecked)) {
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
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Only redirect to complete-profile if we've checked for details and they don't exist
  if (user && detailsChecked && !userDetails) {
    console.log('PrivateRoute: No user details found after loading, redirecting to profile completion');
    return <Navigate to="/complete-profile" state={{ username: user.username, email: user.attributes?.email }} />;
  }

  return <Component user={user} signOut={signOut} />;
};

export default PrivateRoute;

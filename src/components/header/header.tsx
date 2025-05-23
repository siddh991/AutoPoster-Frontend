import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, IconButton, Modal, Fade, Backdrop, Link } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthStore } from '../../stores/authStore';
import { usePostsStore } from '../../stores/postStore';
import UploadSection from '../uploadFile/uploadFile';
import { User } from '../../types/user';

/**
 * Header component for displaying the application header with navigation links
 * Adapts based on authentication state
 */
const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { posts, fetchPosts } = usePostsStore();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isDashboard = location.pathname === '/dashboard';
  const isAuthenticated = !!user;

  // Process a file upload for the user
  const processFile = async ({ file, user }: { file: any; user: User }) => {
    file = file.file;
    const username = user.username;
    const uniqueFileName = `${username}/${file.name}`;
    return { file, key: uniqueFileName };
  };

  // Handle modal close with refresh
  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    if (isDashboard && user) {
      setIsRefreshing(true);
      setTimeout(async () => {
        try {
          await fetchPosts(user.username);
        } catch (error) {
          console.error('Error refreshing posts:', error);
        } finally {
          setIsRefreshing(false);
        }
      }, 500);
    }
  };

  return (
    <>
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2.5,
          }}>
            {/* Left side - Navigation links */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Link 
                component={RouterLink}
                to='/' 
                sx={{
                  textDecoration: 'none',
                  color: location.pathname === '/' ? '#ffffff' : 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': {
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link 
                  component={RouterLink}
                  to='/dashboard'
                  sx={{
                    textDecoration: 'none',
                    color: location.pathname === '/dashboard' ? '#ffffff' : 'rgba(255,255,255,0.8)',
                    fontWeight: 600,
                    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': {
                      color: '#ffffff',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Dashboard
                </Link>
              )}
            </Box>

            {/* Right side - User actions */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  {/* Show welcome text on larger screens */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                      display: { xs: 'none', md: 'block' }
                    }}
                  >
                    Welcome, {user.attributes?.name || user.username}
                  </Typography>
                  
                  {/* Profile button */}
                  <Button 
                    onClick={() => navigate('/complete-profile')}
                    variant="text"
                    startIcon={<PersonIcon />}
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      textTransform: 'none',
                      fontWeight: 500,
                      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                      px: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Profile
                  </Button>
                  
                  {/* Upload button only on dashboard */}
                  {isDashboard && (
                    <Button 
                      onClick={() => setUploadModalOpen(true)}
                      variant="contained"
                      startIcon={<AddPhotoAlternateIcon />}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        color: '#ffffff',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                        px: 3,
                        py: 1,
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Upload
                    </Button>
                  )}
                  
                  <IconButton 
                    onClick={signOut}
                    size="small"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      }
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                    px: 3,
                    py: 1,
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Upload Modal */}
      <Modal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)'
          }
        }}
      >
        <Fade in={uploadModalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '600px' },
            maxHeight: '90vh',
            overflow: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            p: 4,
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1e293b',
                    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  Upload Photos
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b',
                    mt: 0.5
                  }}
                >
                  Add new images to create posts
                </Typography>
              </Box>
              <IconButton 
                onClick={handleCloseUploadModal}
                sx={{
                  color: '#64748b',
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <UploadSection user={user!} processFile={processFile} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Header;

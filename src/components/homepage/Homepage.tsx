import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import ScheduleIcon from '@mui/icons-material/Schedule';
import './Homepage.css';

/**
 * Homepage component for the landing page
 * Displays welcome message and login/sign up buttons
 */
const Homepage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fafbfc 0%, #f3f4f6 100%)',
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          pt: 15,
          pb: 20,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                letterSpacing: '-0.03em',
                mb: 3,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Welcome to Influent
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 6,
                fontWeight: 400,
                opacity: 0.95,
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              Automate your social media updates with AI-powered intelligence
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                onClick={() => navigate('/login')}
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#667eea',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started
              </Button>
              <Button
                href="https://docs.google.com/forms/d/e/1FAIpQLSc-MlF75GFGY1xBY4aq8OxFrxxoS66ZcQaDqhnJp1RAe-qKWg/viewform?usp=sharing"
                target="_blank"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: '#ffffff',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                  borderRadius: '12px',
                  textTransform: 'none',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Join Waitlist
              </Button>
            </Box>
          </Box>
        </Container>
        
        {/* Background decoration */}
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '150px',
            background: 'linear-gradient(to top, rgba(250,251,252,1), transparent)',
            pointerEvents: 'none'
          }} 
        />
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10, mt: -10, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {[
            {
              icon: <AutoAwesomeIcon sx={{ fontSize: 48 }} />,
              title: 'AI-Powered Captions',
              description: 'Generate engaging captions with our advanced AI that understands your brand voice'
            },
            {
              icon: <SpeedIcon sx={{ fontSize: 48 }} />,
              title: 'Streamlined Workflow',
              description: 'Upload once, publish everywhere. Manage all your social media from one place'
            },
            {
              icon: <ScheduleIcon sx={{ fontSize: 48 }} />,
              title: 'Smart Scheduling',
              description: 'Optimize posting times for maximum engagement across all platforms'
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 5,
                  height: '100%',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid rgba(102, 126, 234, 0.08)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.15)',
                    borderColor: 'rgba(102, 126, 234, 0.2)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    color: '#667eea',
                    mb: 3,
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 700,
                    color: '#1e293b',
                    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#64748b',
                    lineHeight: 1.7,
                    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 10,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                mb: 3,
                fontWeight: 700,
                color: '#1e293b',
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
              }}
            >
              Ready to transform your social media?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 5,
                color: '#64748b',
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
              }}
            >
              Join thousands of creators and businesses using Influent
            </Typography>
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Free Trial
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Homepage;

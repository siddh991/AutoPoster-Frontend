import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#1e293b', 
      color: '#ffffff', 
      py: 6,
      mt: 'auto'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Influent
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Your automated social media posting solution. Schedule, generate captions, and manage your content across Instagram and TikTok.
            </Typography>
          </Grid>

          {/* Links Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, justifyContent: { md: 'flex-end' } }}>
              {/* Product Links */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
                  Product
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <MuiLink component={RouterLink} to="/" sx={{ color: '#94a3b8', textDecoration: 'none', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', '&:hover': { color: '#667eea' } }}>
                    Home
                  </MuiLink>
                  <MuiLink component={RouterLink} to="/dashboard" sx={{ color: '#94a3b8', textDecoration: 'none', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', '&:hover': { color: '#667eea' } }}>
                    Dashboard
                  </MuiLink>
                </Box>
              </Box>

              {/* Legal Links */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
                  Legal
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <MuiLink component={RouterLink} to="/privacy" sx={{ color: '#94a3b8', textDecoration: 'none', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', '&:hover': { color: '#667eea' } }}>
                    Privacy Policy
                  </MuiLink>
                  <MuiLink component={RouterLink} to="/terms" sx={{ color: '#94a3b8', textDecoration: 'none', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', '&:hover': { color: '#667eea' } }}>
                    Terms of Service
                  </MuiLink>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #334155' }}>
          <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
            © 2024 Influent. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 
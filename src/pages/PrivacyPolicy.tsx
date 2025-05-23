import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SecurityIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fafbfc 0%, #f3f4f6 100%)', py: 8 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', mb: 3 }}>
            <SecurityIcon sx={{ fontSize: 48, color: '#667eea' }} />
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#1e293b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 2 }}>
            Privacy Policy
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
            Last Updated: January 2, 2024
          </Typography>
        </Box>

        {/* Content */}
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid rgba(102, 126, 234, 0.08)' }}>
          <Typography variant="body1" sx={{ mb: 4, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
            Welcome to Influent. This Privacy Policy explains how we collect, use, protect, and handle your personal information as you use our app and services. Our privacy policy is subject to change at our discretion at any time without any notice to customers.
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
            By using the app and this website, you agree to the privacy policy stipulated below.
          </Typography>

          {/* Section 1 */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#475569', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              We collect the following information:
            </Typography>
            <List dense>
              {[
                'Personal Information: Your name and email address, phone numbers.',
                'Social Media Profiles: Information from your connected social media accounts.',
                'Content: Videos, photos, and other media that you provide for posting.',
                'Usage Data: Statistics and performance metrics about your posted content.'
              ].map((item, index) => (
                <ListItem key={index} sx={{ pl: 0, py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#667eea', fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={item} sx={{ '& .MuiListItemText-primary': { color: '#475569', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: '0.95rem' } }} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Section 2 */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              2. Purpose of Information Collection
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#475569', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Your information is used to:
            </Typography>
            <List dense>
              {[
                'Facilitate the posting of your content on various social media channels.',
                'Generate AI-driven captions for Instagram and synthesize TikTok videos.',
                'Create dashboards for monitoring your content\'s performance and impressions.'
              ].map((item, index) => (
                <ListItem key={index} sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#667eea', fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={item} sx={{ '& .MuiListItemText-primary': { color: '#475569', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: '0.95rem' } }} />
                </ListItem>
              ))}
            </List>
            <Typography variant="body1" sx={{ mt: 2, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Furthermore, by submitting your email address, we reserve the right to send you emails regarding account information. We will not send unsolicited commercial emails.
            </Typography>
          </Box>

          {/* Section 3-4 */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              3. Data Sharing
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              The only data shared is the content you submit for us to post on your behalf on your social media accounts. We do not share your personal information with third parties, except as required for providing our services.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              4. Third Party Liability
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              We are not liable or in any way responsible for the actions of any third parties who we are integrated with (i.e. TikTok, Instagram, etc.). We do our level best to handle your individual data the best we can, but don't have any control over internal policies of those third party companies.
            </Typography>
          </Box>

          {/* Section 5 */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              5. Third Party Service Integration
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Influent integrates with social media platforms like TikTok and Instagram to provide our services. However, we will not individually store any passwords or login credentials for those platforms. Instead, we will use each social media's login API kit to gain permissions to post into your account and post on your behalf.
            </Typography>
          </Box>

          {/* Section 6 */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              6. Data Security
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#475569', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              We prioritize your privacy:
            </Typography>
            <List dense>
              {[
                'We do not store passwords; we use login kits from social media platforms.',
                'While posted content is public, we protect your personal information against unauthorized access.'
              ].map((item, index) => (
                <ListItem key={index} sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#667eea', fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={item} sx={{ '& .MuiListItemText-primary': { color: '#475569', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: '0.95rem' } }} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Section 7 */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              7. User Rights
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#475569', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              These terms will remain in full force so long as you choose to continue to use our service. You have the control to:
            </Typography>
            <List dense>
              {[
                'Delete your Influent account at any time, which will cease all posting activities.',
                'Manually delete or modify posts and captions directly on social media accounts.'
              ].map((item, index) => (
                <ListItem key={index} sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#667eea', fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={item} sx={{ '& .MuiListItemText-primary': { color: '#475569', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: '0.95rem' } }} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Section 8-9 */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              8. Children's Privacy
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Our services are intended for users who are 18 years of age or older.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              9. Cookies and Tracking
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              We do not use cookies or similar tracking technologies.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;

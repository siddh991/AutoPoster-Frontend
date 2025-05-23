import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GavelIcon from '@mui/icons-material/Gavel';

const TermsOfService = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fafbfc 0%, #f3f4f6 100%)', py: 8 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', mb: 3 }}>
            <GavelIcon sx={{ fontSize: 48, color: '#667eea' }} />
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#1e293b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 2 }}>
            Terms of Service
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
            Last Updated: November 30, 2023
          </Typography>
        </Box>

        {/* Content */}
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid rgba(102, 126, 234, 0.08)' }}>
          {/* Section 1 */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              1. Introduction
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Usage of this service implies agreement to this given Terms of Service. The following terminology is used in these terms and conditions, privacy statement, and any other agreement:
            </Typography>
            <List dense>
              {[
                '\'Client\' or \'you\' refers to the person using the website, accepting our terms of service',
                '\'Us\', \'We\' and \'The Entity\' refers to Influent',
                '\'Parties\' refers to both the client and the company, or either the client or the company.'
              ].map((item, index) => (
                <ListItem key={index} sx={{ pl: 0, py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#667eea', fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText primary={item} sx={{ '& .MuiListItemText-primary': { color: '#475569', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: '0.95rem' } }} />
                </ListItem>
              ))}
            </List>
            <Typography variant="body1" sx={{ mt: 2, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Our agreement covers how we'll help you, the client. Everything that we do together will be done in the framework of U.S. Law. Any use of the terminology specified above or other words that are singular or plural, or refer to different genders, we use them interchangeably and refer to the same thing.
            </Typography>
          </Box>

          {/* Privacy Statement */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Privacy Statement
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              We are committed to safeguarding your data and maintaining your privacy. Information collected from clients will only be accessed by members of our entity on a need to know basis. Given that this isn't a company, however, we provide no guarantees of all data being secure. In the case of a change in status in the privacy of that data, we will not be held responsible for loss of such data, and hence cannot be pursued in legal proceedings of any sort.
            </Typography>
          </Box>

          {/* Confidentiality */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Confidentiality
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Any information uploaded by clients may be passed to third parties. However, client records themselves are confidential information and will not be given to any third party intentionally save if legally required to do so to the appropriate authorities.
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              We will not sell, share, or rent your personal information to any third party or use your contact details for unsolicited contacts. Any information sent by us will only be related to the agreed upon services and products.
            </Typography>
          </Box>

          {/* User Responsibilities */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              User Responsibilities
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Your responsibilities include posting content that follows the terms of service of the respective social media platforms you wish to post to.
            </Typography>
          </Box>

          {/* Description of Service */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Description of Service
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              This software allows users to post their content to two platforms: Instagram and TikTok. Our software will schedule the posts, generate, add captions, include music/transitions in the case of videos and post on a regular basis to both platforms.
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              We do not guarantee that the tool will always work as described above.
            </Typography>
          </Box>

          {/* Cancellation */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Cancellation
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              We respect the need for you to have ease of ending service with us. You can cancel your account at any time you choose, with service stopping within reasonable notice of when you inform us.
            </Typography>
          </Box>

          {/* Limit of Liability */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Limit of Liability
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
              Due to us not being a company, and not selling our service, we cannot be pursued for liability related to this product. This product is merely a project being used by some third party entities.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService;

import React, { useState, useEffect } from 'react';
import { 
  Box, Container, TextField, Button, Typography, Paper, IconButton, 
  FormControl, InputLabel, Select, MenuItem, Slider, Card, CardContent,
  LinearProgress, Chip, Stack, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserDetailsStore } from '../../stores/userDetailsStore';
import { UserDetails, UniqueSellingPoint } from '../../types/userDetails';

/**
 * PromptGenForm component for creating or updating user profile details
 * Uses Zustand stores for auth and user details management
 */
const PromptGenForm: React.FC = () => {
  // Get auth state from store
  const { user } = useAuthStore();
  
  // Get user details state and actions from store
  const { 
    userDetails, 
    fetchUserDetails, 
    createUserDetails: createDetails, 
    updateUserDetails: updateDetails 
  } = useUserDetailsStore();

  // Form state
  const [companyName, setCompanyName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [niche, setNiche] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState<UniqueSellingPoint[]>([]);
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [captionTone, setCaptionTone] = useState<string>('');
  const [captionFormatting, setCaptionFormatting] = useState<string>('');
  const [otherIndustry, setOtherIndustry] = useState<string>('');
  const [brandAssociation, setBrandAssociation] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const routerLocation = useLocation();
  const locationState = routerLocation.state as { username?: string; email?: string } | null;

  // Initialize the component with user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user && locationState?.username) {
        // If we don't have a user in the auth store but have one in location state,
        // we can use that for the form
        setIsLoading(false);
      } else if (!user) {
        // No user in either place, redirect to login
        navigate('/login');
      } else {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user, locationState, navigate]);

  // Load existing user details if available
  useEffect(() => {
    const loadUserDetails = async () => {
      if (user?.username || locationState?.username) {
        try {
          const username = user?.username || locationState?.username;
          if (username) {
            await fetchUserDetails(username);
          }
        } catch (error) {
          console.error('Error loading user details:', error);
          setError('Failed to load existing user details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserDetails();
  }, [user, locationState, fetchUserDetails]);

  // Populate form with existing user details when available
  useEffect(() => {
    if (userDetails) {
      setCompanyName(userDetails.companyName || '');
      setIndustry(userDetails.industry || '');
      setNiche(userDetails.niche || '');
      setLocation(userDetails.location || '');
      setUniqueSellingPoints(userDetails.uniqueSellingPoints?.filter(usp => 
        usp.feature && usp.importance) || []);
      setTargetAudience(userDetails.targetAudience || '');
      setCaptionTone(userDetails.captionTone || '');
      setCaptionFormatting(userDetails.captionFormatting || '');
      setBrandAssociation(userDetails.brandAssociation || '');
    }
  }, [userDetails]);

  // Handlers for unique selling points
  const handleUSPChange = (index: number, field: keyof UniqueSellingPoint, value: string | number) => {
    const updatedUSPs = uniqueSellingPoints.map((usp, i) =>
      i === index ? { ...usp, [field]: value } : usp
    );
    setUniqueSellingPoints(updatedUSPs);
  };

  const addUSP = () => {
    setUniqueSellingPoints([...uniqueSellingPoints, { feature: '', importance: 3 }]);
  };

  const removeUSP = (index: number) => {
    setUniqueSellingPoints(uniqueSellingPoints.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const username = user?.username || locationState?.username;
      if (!username) {
        setError('User information is missing. Please try logging in again.');
        return;
      }

      const updatedDetails: UserDetails = {
        companyId: username,
        companyName,
        industry: industry === 'Other' ? otherIndustry : industry,
        niche,
        location,
        targetAudience,
        uniqueSellingPoints: uniqueSellingPoints
          .filter(usp => usp.feature.trim() !== '')
          .map(usp => ({
            feature: usp.feature,
            importance: usp.importance,
            weight: usp.importance / 5
          })),
        captionTone,
        captionFormatting,
        brandAssociation,
      };

      console.log('Submitting user details:', JSON.stringify(updatedDetails, null, 2));

      let savedDetails;
      if (userDetails) {
        // Update existing details
        savedDetails = await updateDetails(updatedDetails);
      } else {
        // Create new details
        savedDetails = await createDetails(updatedDetails);
      }

      console.log('Successfully saved user details:', savedDetails);
      
      // Give the store a moment to update before navigating
      setTimeout(() => {
        navigate('/dashboard');
        // Scroll to top after navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to save user details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fafbfc 0%, #f3f4f6 100%)', py: 8 }}>
        <Container maxWidth="md">
          {/* Loading Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', mb: 3 }}>
              <AccountCircleIcon sx={{ fontSize: 48, color: '#667eea' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              Loading Profile
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', mb: 4 }}>
              Setting up your experience...
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
                Preparing your profile form...
              </Typography>
              <Box sx={{ width: '100%', maxWidth: 300 }}>
                <LinearProgress 
                  sx={{ 
                    backgroundColor: 'rgba(102, 126, 234, 0.1)', 
                    '& .MuiLinearProgress-bar': { 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    },
                    borderRadius: '4px',
                    height: '6px'
                  }} 
                />
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fafbfc 0%, #f3f4f6 100%)', py: 8 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', mb: 3 }}>
            <AccountCircleIcon sx={{ fontSize: 48, color: '#667eea' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
            {userDetails ? 'Update Your Profile' : 'Complete Your Profile'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
            Help us customize your experience
          </Typography>
        </Box>

        {/* Form */}
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid rgba(102, 126, 234, 0.08)' }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Company Name */}
              <TextField
                fullWidth
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />

              {/* Industry */}
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  label="Industry"
                  required
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="Barbershop">Barbershop</MenuItem>
                  <MenuItem value="Café">Café</MenuItem>
                  <MenuItem value="Tech Startup">Tech Startup</MenuItem>
                  <MenuItem value="Gift Shop">Gift Shop</MenuItem>
                  <MenuItem value="Restaurant">Restaurant</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              {industry === 'Other' && (
                <TextField
                  fullWidth
                  label="Specify Your Industry"
                  value={otherIndustry}
                  onChange={(e) => setOtherIndustry(e.target.value)}
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: '12px',
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' }
                    }
                  }}
                />
              )}

              {/* Niche */}
              <TextField
                fullWidth
                label="Niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., young men's haircuts"
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />

              {/* Location */}
              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, California"
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />

              {/* Target Audience */}
              <TextField
                fullWidth
                label="Target Audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="women in their 20s"
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />

              {/* Unique Selling Points */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
                  Points of Emphasis for Caption
                </Typography>
                {uniqueSellingPoints.map((usp, index) => (
                  <Card key={index} sx={{ mb: 2, borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <CardContent>
                      <TextField
                        fullWidth
                        label="Point of Emphasis"
                        value={usp.feature}
                        onChange={(e) => handleUSPChange(index, 'feature', e.target.value)}
                        required
                        sx={{ 
                          mb: 2,
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: '12px',
                            '&:hover fieldset': { borderColor: '#667eea' },
                            '&.Mui-focused fieldset': { borderColor: '#667eea' }
                          }
                        }}
                      />
                      <Box sx={{ px: 2 }}>
                        <Typography gutterBottom sx={{ fontWeight: 500 }}>
                          Importance: <Chip label={usp.importance} size="small" sx={{ ml: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }} />
                        </Typography>
                        <Slider
                          value={usp.importance}
                          onChange={(e, value) => handleUSPChange(index, 'importance', value as number)}
                          min={1}
                          max={5}
                          marks
                          sx={{ 
                            color: '#667eea',
                            '& .MuiSlider-thumb': {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }
                          }}
                        />
                      </Box>
                      <IconButton onClick={() => removeUSP(index)} sx={{ mt: 1, color: '#ef4444' }}>
                        <DeleteIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))}
                <Button 
                  onClick={addUSP} 
                  startIcon={<AddIcon />}
                  sx={{ 
                    color: '#667eea',
                    borderColor: '#667eea',
                    '&:hover': {
                      borderColor: '#764ba2',
                      backgroundColor: 'rgba(102, 126, 234, 0.04)'
                    }
                  }}
                  variant="outlined"
                >
                  Add Another Point
                </Button>
              </Box>

              {/* Caption Tone */}
              <TextField
                fullWidth
                label="Caption Tone"
                value={captionTone}
                onChange={(e) => setCaptionTone(e.target.value)}
                placeholder="e.g., Exciting, Friendly, Professional"
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />

              {/* Brand Association */}
              <TextField
                fullWidth
                label="Brand Association"
                value={brandAssociation}
                onChange={(e) => setBrandAssociation(e.target.value)}
                placeholder="Enter the feeling(s) or association(s) you want for your brand"
                helperText="When customers think of your brand, you would want them to think..."
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />

              {/* Caption Formatting */}
              <TextField
                fullWidth
                label="Caption Formatting"
                value={captionFormatting}
                onChange={(e) => setCaptionFormatting(e.target.value)}
                placeholder={`Caption #companyName\n.\n.\n.\nhashtags`}
                multiline
                rows={5}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: '#667eea' },
                    '&.Mui-focused fieldset': { borderColor: '#667eea' }
                  }
                }}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
                sx={{ 
                  background: isSubmitting 
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: isSubmitting 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)'
                      : 'linear-gradient(135deg, #5a72d8 0%, #6a4290 100%)',
                    transform: isSubmitting ? 'none' : 'translateY(-1px)',
                    boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.25)',
                  },
                  '&:disabled': {
                    cursor: 'not-allowed',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {isSubmitting ? 'Saving Profile...' : (userDetails ? 'Update Profile' : 'Save Profile')}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default PromptGenForm;
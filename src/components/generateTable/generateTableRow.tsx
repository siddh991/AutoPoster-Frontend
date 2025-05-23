import React, { useState, useEffect } from 'react';
import { TableRow, TableCell, IconButton, Collapse, Box, Typography, TextField, Button, ButtonGroup, Divider, Alert, Chip, Fade, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CreateIcon from '@mui/icons-material/Create';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Storage } from 'aws-amplify';
import { TableRowProps } from '../../types/props';

/**
 * Interface for AI generated caption with approval status
 */
interface AICaption {
  caption: string;
  approved: boolean;
}

/**
 * GenerateTableRow displays a single post row with edit/delete capabilities
 */
const GenerateTableRow: React.FC<TableRowProps> = ({ 
  post, 
  open, 
  handleExpandClick, 
  handleDeleteClick, 
  handleUpdateClick, 
  handleRegenerateClick, 
  isAIGenerating 
}) => {
  const [aiGenerateCount, setAiGenerateCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [editMode, setEditMode] = useState<'manual' | 'ai' | null>('manual');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [newCaption, setNewCaption] = useState<string>(post.caption || '');
  const [currentAICaption, setCurrentAICaption] = useState<string>('');
  const [aiError, setAiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const maxAiGenerations = 3; // Set the maximum number of AI regenerations

  useEffect(() => {
    if (open === post.id) {
      setNewCaption(post.caption || '');
      setCurrentAICaption('');
      setSuccessMessage('');
    } else {
      setEditMode(null);
      setCurrentAICaption('');
      setSuccessMessage('');
    }
  }, [open, post.id]);

  // Add another effect to update newCaption when post.caption changes
  useEffect(() => {
    setNewCaption(post.caption || '');
  }, [post.caption]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const keyWithoutPrefix = post.key.startsWith('public/') ? post.key.slice(7) : post.key;
        const url = await Storage.get(keyWithoutPrefix, {level: 'public' });
        setImageUrl(url);
      } catch (error) {
        console.log("error loading image");
        console.error('Error fetching image from S3:', error);
      }
    };

    fetchImage();
  }, [post.key]);

  const handleAiGenerate = async () => {
    if (aiGenerateCount < maxAiGenerations) {
      try {
        setAiError('');
        setCurrentAICaption('Generating caption...');
        
        // Ensure edit mode is set to AI
        setEditMode('ai');
        
        // Extract the image key without the 'public/' prefix if it exists
        // We'll log this for debugging but won't pass it directly
        const keyWithoutPrefix = post.key.startsWith('public/') ? post.key.slice(7) : post.key;
        console.log('Using image key:', keyWithoutPrefix);
        
        // Include post details in the feedback for the AI
        const enhancedFeedback = feedback 
          ? `${feedback} (Image key: ${keyWithoutPrefix})` 
          : `Generate caption for image: ${keyWithoutPrefix}`;
        
        // Call the regenerate function with only the expected parameters
        const aiCaption = await handleRegenerateClick(
          post.id, 
          post.caption || '',
          enhancedFeedback
        );
        
        if (aiCaption && typeof aiCaption === 'string' && aiCaption.trim() !== '') {
          setCurrentAICaption(aiCaption);
          setAiGenerateCount(aiGenerateCount + 1);
        } else {
          throw new Error('Failed to generate caption. Please try again.');
        }
      } catch (error) {
        console.error('Error in AI caption generation:', error);
        setAiError(error instanceof Error ? error.message : 'Failed to generate caption');
        setCurrentAICaption('');
      }
    }
  };

  const handleApprove = () => {
    if (currentAICaption && currentAICaption !== 'Generating caption...') {
      handleUpdateClick(post.id, currentAICaption, true);
      // Show success message
      setSuccessMessage('Caption updated successfully!');
      // Clear the current AI caption after approval
      setCurrentAICaption('');
      // Clear feedback after successful approval
      setFeedback('');
      
      // Close the edit panel immediately after approval
      setTimeout(() => {
        setSuccessMessage('');
        setEditMode(null);
        // Also close the collapsed panel
        handleExpandClick(post.id, post.caption);
      }, 1500);
    }
  };

  const handleReject = () => {
    // Just clear the current AI caption
    setCurrentAICaption('');
  };

  const handleEditModeSelect = (mode: 'manual' | 'ai') => {
    setEditMode(mode);
    setAiError(''); // Clear any AI errors when switching modes
    
    // Only expand if not already open
    if (open !== post.id) {
      handleExpandClick(post.id, post.caption);
    }
  };

  const getButtonStyle = (mode: 'manual' | 'ai', isActive: boolean) => ({
    flex: 1,
    backgroundColor: isActive ? (mode === 'ai' ? '#667eea' : '#764ba2') : '#ffffff',
    color: isActive ? '#ffffff' : '#64748b',
    border: isActive ? 'none' : '1px solid #e2e8f0',
    boxShadow: isActive ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none',
    textTransform: 'none' as const,
    fontWeight: 600,
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: isActive ? (mode === 'ai' ? '#5a67d8' : '#6b46c1') : '#f8fafc',
      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)',
      transform: 'translateY(-2px)',
    },
  });

  return (
    <React.Fragment key={post.id}>
      <TableRow 
        sx={{ 
          '&:hover': { 
            backgroundColor: 'rgba(102, 126, 234, 0.02)',
            boxShadow: '0 0 0 1px rgba(102, 126, 234, 0.1) inset'
          },
          transition: 'all 0.2s ease',
          borderBottom: '1px solid rgba(102, 126, 234, 0.05)'
        }}
      >
        <TableCell sx={{ py: 2.5 }}>
          <Box
            sx={{
              width: '100px',
              height: '100px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <img 
              src={imageUrl} 
              alt="Post" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          </Box>
        </TableCell>
        <TableCell sx={{ fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {new Date(post.postAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              {new Date(post.postAt).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', maxWidth: '400px' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#475569',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.6
            }}
          >
            {post.caption}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <IconButton 
              onClick={() => {
                // If edit panel is open for this post, close it
                if (open === post.id) {
                  setEditMode(null);
                  handleExpandClick(post.id, post.caption); // This will close it
                } else {
                  // Otherwise open in manual mode
                  setEditMode('manual');
                  handleExpandClick(post.id, post.caption);
                }
              }}
              sx={{
                color: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.2)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={() => handleDeleteClick(post.id)}
              sx={{
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open === post.id && editMode !== null} timeout="auto" unmountOnExit>
            <Box 
              sx={{ 
                m: 2, 
                p: 4, 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(102, 126, 234, 0.1)'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '1.125rem',
                  mb: 3,
                  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                }}
              >
                Edit Post Caption
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Button
                  onClick={() => handleEditModeSelect('ai')}
                  disabled={isAIGenerating}
                  startIcon={<AutoAwesomeIcon />}
                  variant={editMode === 'ai' ? 'contained' : 'outlined'}
                  sx={getButtonStyle('ai', editMode === 'ai')}
                >
                  AI Generated
                </Button>
                <Button
                  onClick={() => handleEditModeSelect('manual')}
                  startIcon={<CreateIcon />}
                  variant={editMode === 'manual' ? 'contained' : 'outlined'}
                  sx={getButtonStyle('manual', editMode === 'manual')}
                >
                  Manual Edit
                </Button>
              </Box>

              {editMode === 'manual' && (
                <Fade in={true}>
                  <Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={newCaption || ''}
                      onChange={(e) => setNewCaption(e.target.value || '')}
                      variant="outlined"
                      sx={{
                        backgroundColor: '#ffffff',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#cbd5e1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                          },
                        },
                      }}
                    />
                    <Button
                      onClick={() => handleUpdateClick(post.id, newCaption)}
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                        py: 1.5,
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.35)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Update Caption
                    </Button>
                  </Box>
                </Fade>
              )}

              {editMode === 'ai' && (
                <Fade in={true}>
                  <Box>
                    {/* Success message */}
                    {successMessage && (
                      <Alert 
                        severity="success" 
                        sx={{ 
                          mb: 2,
                          backgroundColor: '#f0fdf4',
                          color: '#166534',
                          '& .MuiAlert-icon': {
                            color: '#22c55e'
                          }
                        }}
                      >
                        {successMessage}
                      </Alert>
                    )}
                    
                    {currentAICaption && currentAICaption !== 'Generating caption...' ? (
                      <Box 
                        sx={{ 
                          mb: 3, 
                          p: 3, 
                          background: 'linear-gradient(135deg, #ffffff 0%, rgba(102, 126, 234, 0.02) 100%)',
                          borderRadius: '12px',
                          border: '1px solid rgba(102, 126, 234, 0.15)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                          }} 
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AutoAwesomeIcon sx={{ color: '#667eea', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="subtitle1" fontWeight={700} color="#1e293b" fontFamily='"Inter", "Helvetica", "Arial", sans-serif'>
                            AI Generated Caption
                          </Typography>
                        </Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={currentAICaption}
                          disabled
                          variant="outlined"
                          sx={{
                            backgroundColor: '#f8fafc',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#e2e8f0',
                              },
                            },
                          }}
                        />
                        <Box display="flex" gap={2} mt={3}>
                          <Button
                            onClick={handleApprove}
                            variant="contained"
                            startIcon={<CheckCircleOutlineIcon />}
                            sx={{
                              flex: 1,
                              backgroundColor: '#10b981',
                              textTransform: 'none',
                              fontWeight: 500,
                              py: 1.25,
                              '&:hover': {
                                backgroundColor: '#059669',
                              }
                            }}
                          >
                            Use This Caption
                          </Button>
                          <Button
                            onClick={() => setCurrentAICaption('')}
                            variant="outlined"
                            startIcon={<CancelOutlinedIcon />}
                            sx={{
                              flex: 1,
                              borderColor: '#e2e8f0',
                              color: '#64748b',
                              textTransform: 'none',
                              fontWeight: 500,
                              py: 1.25,
                              '&:hover': {
                                borderColor: '#cbd5e1',
                                backgroundColor: '#f8fafc',
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    ) : currentAICaption === 'Generating caption...' ? (
                      <Box 
                        sx={{ 
                          mb: 3, 
                          p: 4, 
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #e0e7ff',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <CircularProgress size={40} sx={{ color: '#6366f1' }} />
                        <Typography color="#64748b" fontStyle="italic">
                          Generating AI caption...
                        </Typography>
                      </Box>
                    ) : null}
                    
                    <Divider sx={{ my: 3, borderColor: '#e2e8f0' }} />
                    
                    {/* Generate New Caption Section */}
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1e293b',
                          mb: 2
                        }}
                      >
                        Generate New Caption
                      </Typography>
                      
                      <TextField
                        fullWidth
                        label="Feedback for AI (optional)"
                        placeholder="E.g., Include hashtags, mention specific features, focus on a theme..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        variant="outlined"
                        sx={{
                          backgroundColor: '#ffffff',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#e2e8f0',
                            },
                            '&:hover fieldset': {
                              borderColor: '#cbd5e1',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#6366f1',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#64748b',
                            '&.Mui-focused': {
                              color: '#6366f1',
                            },
                          },
                        }}
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                          onClick={handleAiGenerate}
                          disabled={isAIGenerating || aiGenerateCount >= maxAiGenerations}
                          variant="contained"
                          startIcon={<AutoAwesomeIcon />}
                          sx={{
                            flex: 1,
                            mr: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                            py: 1.5,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                              transform: 'translateY(-2px)',
                            },
                            '&:disabled': {
                              background: '#e2e8f0',
                              color: '#94a3b8',
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isAIGenerating ? 'Generating...' : 'Generate AI Caption'}
                        </Button>
                        {aiGenerateCount > 0 && (
                          <Chip
                            label={`${aiGenerateCount}/${maxAiGenerations} used`}
                            size="small"
                            sx={{
                              backgroundColor: aiGenerateCount >= maxAiGenerations ? '#fee2e2' : '#f0f9ff',
                              color: aiGenerateCount >= maxAiGenerations ? '#991b1b' : '#1e40af',
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Box>
                      
                      {aiGenerateCount >= maxAiGenerations && (
                        <Alert 
                          severity="warning" 
                          sx={{ 
                            mt: 2,
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            '& .MuiAlert-icon': {
                              color: '#f59e0b'
                            }
                          }}
                        >
                          Maximum of {maxAiGenerations} AI generations reached.
                        </Alert>
                      )}
                      
                      {aiError && (
                        <Alert 
                          severity="error" 
                          sx={{ 
                            mt: 2,
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            '& .MuiAlert-icon': {
                              color: '#ef4444'
                            }
                          }}
                        >
                          {aiError}
                        </Alert>
                      )}
                    </Box>
                  </Box>
                </Fade>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default GenerateTableRow;
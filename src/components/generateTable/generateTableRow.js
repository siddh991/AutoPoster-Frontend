import React, { useState, useEffect } from 'react';
import { TableRow, TableCell, IconButton, Collapse, Box, Typography, TextField, Button, ButtonGroup } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Storage } from 'aws-amplify';

const GenerateTableRow = ({ post, open, handleExpandClick, handleDeleteClick, handleUpdateClick, handleRegenerateClick, newCaption, setNewCaption, isAIGenerating }) => {
  const [aiGenerateCount, setAiGenerateCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [editMode, setEditMode] = useState('manual');
  const [imageUrl, setImageUrl] = useState('');
  const maxAiGenerations = 3; // Set the maximum number of AI regenerations

  useEffect(() => {
    if (open === post.id) {
      setEditMode('manual'); 
    } else {
      setEditMode('manual'); 
    }
  }, [open, post.id]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const keyWithoutPrefix = post.key.startsWith('public/') ? post.key.slice(7) : post.key;
        const url = await Storage.get(keyWithoutPrefix, {level: 'public' });
        setImageUrl(url);
      } catch (error) {
        console.log("error loading image")
        console.error('Error fetching image from S3:', error);
      }
    };

    fetchImage();
  }, [post.key]);


  const handleAiGenerate = () => {
    if (aiGenerateCount < maxAiGenerations) {
      handleRegenerateClick(post.id, feedback);
      setAiGenerateCount(aiGenerateCount + 1);
      setFeedback('');
    }
  };

  
  const handleEditModeSelect = (mode) => {
    if (editMode === mode) {
      setEditMode(null); // Collapse the section if the same button is clicked again
    } else {
      setEditMode(mode);
      if (open !== post.id) {
        handleExpandClick(post.id, post.caption);
      }
    }

  };

  const getButtonStyle = (mode) => ({
    width: '50%',
    backgroundColor: editMode === mode ? '#1976d2' : '#2196f3',
    color: 'white',
    '&:hover': {
      backgroundColor: editMode === mode ? '#1565c0' : '#1e88e5',
    },
  });



  return (
    <React.Fragment key={post.id}>
      <TableRow>
        <TableCell>
          <img src={imageUrl} alt="Post" style={{ width: '150px', height: '150px' }} />
        </TableCell>
        <TableCell>{new Date(post.postAt).toLocaleString()}</TableCell>
        <TableCell>{post.caption}</TableCell>
        <TableCell>
          <IconButton onClick={() => handleEditModeSelect('manual')}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(post.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open === post.id && editMode !== null} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Edit Post
              </Typography>
              <ButtonGroup variant="contained" aria-label="outlined primary button group" fullWidth>
                <Button
                  onClick={() => handleEditModeSelect('ai')}
                  disabled={isAIGenerating}
                  style={getButtonStyle('ai')}
                >
                  AI Generated
                </Button>
                <Button
                  onClick={() => handleEditModeSelect('manual')}
                  style={getButtonStyle('manual')}
                >
                  Manual Update
                </Button>
              </ButtonGroup>
              {editMode === 'manual' && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    margin="normal"
                  />
                  <Button
                    onClick={() => handleUpdateClick(post.id, newCaption)}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    style={{ marginTop: '10px' }}
                  >
                    Update Caption
                  </Button>
                </Box>
              )}
              {editMode === 'ai' && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    label="Feedback for AI (optional)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    margin="normal"
                  />
                  <Button
                    onClick={handleAiGenerate}
                    disabled={isAIGenerating || aiGenerateCount >= maxAiGenerations}
                    variant="contained"
                    color="secondary"
                    fullWidth
                  >
                    {isAIGenerating ? 'Generating...' : 'AI Regenerate'}
                  </Button>
                  {aiGenerateCount >= maxAiGenerations && (
                    <Typography color="error" style={{ marginTop: '10px' }}>
                      Maximum AI regenerations reached.
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default GenerateTableRow;

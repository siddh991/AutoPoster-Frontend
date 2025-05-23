import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, Alert } from '@mui/material';
import GenerateTableRow from './generateTableRow';
import { usePostsStore } from '../../stores/postStore';
import { AIGenerationParams } from '../../types/post';
/**
 * PostsTable component displays a table of posts with actions
 * This component uses the postStore for state management
 */
const PostsTable: React.FC = () => {
  // Use our posts store instead of passing posts and setPosts as props
  const { posts, updatePost, deletePost } = usePostsStore();
  
  const [open, setOpen] = useState<string | null>(null);
  const [isAIGenerating, setIsAIGenerating] = useState<boolean>(false);

  const handleExpandClick = (postId: string, currentCaption: string | null) => {
    if (open === postId) {
      setOpen(null);
    } else {
      setOpen(postId);
    }
  };

  const handleDeleteClick = async (postId: string) => {
    try {
      // Use the deletePost method from our store
      await deletePost(postId);
      // The store handles updating the posts array internally
      console.log('Deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdateClick = async (postId: string, newCaption: string, isAIUpdate: boolean = false) => {
    try {
      console.log('Starting update process', { isAIUpdate });
      // Use the updatePost method from our store
      await updatePost({ postId, caption: newCaption });
      
      // Update the local state immediately
      const { posts } = usePostsStore.getState();
      const updatedPosts = posts.map(p => 
        p.id === postId 
          ? { ...p, caption: newCaption } 
          : p
      );
      usePostsStore.setState({ posts: updatedPosts });
      
      // For AI updates, don't refresh posts or close the edit mode
      if (!isAIUpdate) {
        // Also refresh the posts list to get any other changes
        const companyId = usePostsStore.getState().getCurrentCompanyId();
        if (companyId) {
          setTimeout(() => {
            usePostsStore.getState().fetchPosts(companyId);
          }, 1000); // Wait a second to ensure backend has completed processing
        }
        
        // Close the edit mode only for manual updates
        setOpen(null);
      }
      
      console.log('Updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleRegenerateClick = async (
    postId: string, 
    previousCaption: string, 
    feedback: string = ''
  ): Promise<string | null> => {
    setIsAIGenerating(true);
    try {
      // Find the post to get bucket and key information
      const post = posts.find(p => p.id === postId);
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Extract information from the feedback if it contains image key
      const imageKeyMatch = feedback.match(/Image key: ([^\)]+)/);
      const extractedKey = imageKeyMatch ? imageKeyMatch[1] : null;
      
      // Use extracted key or fall back to post key
      const keyToUse = extractedKey || post.key;
      const bucketToUse = post.bucket || 'post-images'; // Default bucket name
      
      if (!bucketToUse || !keyToUse) {
        throw new Error('Missing required S3 bucket or key information');
      }
      
      console.log('Generating AI caption with params:', {
        postId,
        previousCaption,
        feedback,
        bucket: bucketToUse,
        key: keyToUse
      });
      
      // Create params for AI generation
      const params: AIGenerationParams = {
        postId,
        previousCaption,
        feedback,
        bucket: bucketToUse,
        key: keyToUse
      };
      
      // Use our store method for AI caption generation
      const aiCaption = await usePostsStore.getState().generateAICaption(params);
      
      if (!aiCaption) {
        throw new Error('No caption was generated');
      }
      
      return aiCaption;
    } catch (error) {
      console.error('Error in handleRegenerateClick:', error);
      // Return null as specified in the interface
      return null;
    } finally {
      setIsAIGenerating(false);
    }
  };

  // Show loading state from the store
  if (usePostsStore.getState().isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          py: 8,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(102, 126, 234, 0.08)'
        }}
      >
        <CircularProgress size={48} sx={{ color: '#667eea', mb: 2 }} />
        <Typography 
          sx={{ 
            color: '#64748b',
            fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
          }}
        >
          Loading posts...
        </Typography>
      </Box>
    );
  }

  // Show error state from the store
  if (usePostsStore.getState().error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          color: '#991b1b',
          border: '1px solid rgba(239, 68, 68, 0.1)',
          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
          '& .MuiAlert-icon': {
            color: '#ef4444'
          }
        }}
      >
        {usePostsStore.getState().error}
      </Alert>
    );
  }

  // Show empty state when no posts
  if (posts.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(102, 126, 234, 0.08)'
        }}
      >
        <Box 
          sx={{ 
            fontSize: '48px',
            mb: 2,
            opacity: 0.3
          }}
        >
          📷
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#334155',
            mb: 1,
            fontWeight: 600,
            fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
          }}
        >
          No posts yet
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#64748b',
            fontFamily: '"Inter", "Helvetica", "Arial", sans-serif'
          }}
        >
          Upload some photos to get started with AI-powered captions!
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(102, 126, 234, 0.08)'
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell 
              sx={{ 
                fontWeight: 600, 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                color: '#334155',
                fontSize: '0.875rem',
                letterSpacing: '0.025em',
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
              }}
            >
              Image
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600, 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                color: '#334155',
                fontSize: '0.875rem',
                letterSpacing: '0.025em',
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
              }}
            >
              Post Date
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600, 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                color: '#334155',
                fontSize: '0.875rem',
                letterSpacing: '0.025em',
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                borderBottom: '2px solid rgba(102, 126, 234, 0.1)'
              }}
            >
              Caption
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600, 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                color: '#334155',
                fontSize: '0.875rem',
                letterSpacing: '0.025em',
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
                textAlign: 'right'
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {posts.map((post) => (
          <GenerateTableRow
            key={post.id}
            post={post}
            open={open}
            handleExpandClick={handleExpandClick}
            handleDeleteClick={handleDeleteClick}
            handleUpdateClick={handleUpdateClick}
            handleRegenerateClick={handleRegenerateClick}
            isAIGenerating={isAIGenerating}
          />
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostsTable;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import PostsTable from '../generateTable/generateTable';
import './Dashboard.css';
import { useAuthStore } from '../../stores/authStore';
import { useUserDetailsStore } from '../../stores/userDetailsStore';
import { usePostsStore } from '../../stores/postStore';

/**
 * Dashboard component serving as the main interface after login
 * Integrates user authentication, posts management, and user details
 */
const Dashboard: React.FC = () => {
  console.log('Rendered Dashboard component');
  
  // Use our stores instead of props and local state
  const { user } = useAuthStore();
  const { userDetails, fetchUserDetails } = useUserDetailsStore();
  const { posts, fetchPosts } = usePostsStore();
  
  const [postsQueried, setPostsQueried] = useState<boolean>(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserDetailsAndLoadPosts = async () => {
      if (!user) {
        console.log('No user, navigating to login');
        navigate('/login');
        return;
      }

      setIsLoadingDashboard(true);

      // Only fetch user details if we haven't already loaded them
      if (!userDetails && !postsQueried) {
        try {
          console.log('Dashboard: Loading user details for', user.username);
          const fetchedDetails = await fetchUserDetails(user.username);
          
          // If after fetching, we still don't have details, redirect to profile
          if (fetchedDetails === null) {
            console.log('Dashboard: No user details found after fetch, redirecting to profile');
            navigate('/complete-profile', { 
              state: { 
                username: user.username, 
                email: user.attributes?.email 
              } 
            });
            return;
          }
          
          console.log('Dashboard: Successfully loaded user details');
        } catch (error) {
          console.error('Dashboard: Error loading user details:', error);
          navigate('/complete-profile', { 
            state: { 
              username: user.username, 
              email: user.attributes?.email 
            } 
          });
          return;
        }
      }

      // Only fetch posts if user details exist and we haven't already queried
      if ((userDetails || (!userDetails && !postsQueried)) && !postsQueried) {
        // If we have userDetails, or if we just tried to fetch them above
        if (userDetails) {
          try {
            console.log('Dashboard: Loading posts for', user.username);
            await fetchPosts(user.username);
            setPostsQueried(true);
            console.log('Dashboard: Posts loaded successfully');
          } catch (error) {
            console.error('Dashboard: Error loading posts:', error);
          }
        }
      }

      setIsLoadingDashboard(false);
    };

    checkUserDetailsAndLoadPosts();
  }, [user, userDetails, postsQueried, navigate, fetchUserDetails, fetchPosts]);

  // Check authentication state
  if (!user) {
    console.log('No user, returning null');
    return null;
  }

  console.log('Rendering Dashboard');
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #fafbfc 0%, #f3f4f6 100%)',
      pt: 4
    }}>
      <Container maxWidth="xl">
        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 5 }}>
          {/* Total Posts Card */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
                {posts.length}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
                Total Posts
              </Typography>
            </Box>
          </Paper>

          {/* Next Scheduled Post Card */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              borderRadius: '16px',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
                {posts.length > 0 
                  ? (() => {
                      const futurePosts = posts.filter(post => new Date(post.postAt) > new Date());
                      if (futurePosts.length > 0) {
                        return new Date(Math.min(...futurePosts.map(post => new Date(post.postAt).getTime()))).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        });
                      }
                      return '--';
                    })()
                  : '--'
                }
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
                {posts.length > 0 && posts.filter(post => new Date(post.postAt) > new Date()).length > 0 
                  ? 'Next Scheduled Post' 
                  : 'No Upcoming Posts'
                }
              </Typography>
            </Box>
          </Paper>

          {/* Coverage End Date Card */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #667eea 30%, #764ba2 70%)',
              borderRadius: '16px',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
                {posts.length > 0 
                  ? (() => {
                      const futurePosts = posts.filter(post => new Date(post.postAt) > new Date());
                      if (futurePosts.length > 0) {
                        return new Date(Math.max(...futurePosts.map(post => new Date(post.postAt).getTime()))).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        });
                      }
                      return '--';
                    })()
                  : '--'
                }
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontFamily: '"Inter", "Helvetica", "Arial", sans-serif' }}>
                {posts.length > 0 && posts.filter(post => new Date(post.postAt) > new Date()).length > 0
                  ? 'Coverage Ends' 
                  : 'No Future Coverage'
                }
              </Typography>
            </Box>
          </Paper>
        </Box>
        
        {/* Posts Table */}
        <Box>
          <PostsTable />
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
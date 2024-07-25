import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadSection from '../uploadFile/uploadFile.js';
import PostsTable from '../generateTable/generateTable.js';
import './Dashboard.css';
import { fetchPosts } from '../apis/api.js';
import { checkUserDetails } from '../apis/getUserInfo';

const Dashboard = ({ user, signOut }) => {
  console.log('Rendered Dashboard component');
  const [upcomingPosts, setPosts] = useState([]);
  const [postsQueried, setPostsQueried] = useState(false);
  const navigate = useNavigate();

  const loadPosts = async (username) => {
    console.log('Loading posts for username:', username);
    try {
      const postList = await fetchPosts(username);
      console.log('Fetched post list:', postList);
      setPosts(postList);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const checkUserDetailsAndLoadPosts = async () => {
      if (!user) {
        console.log('No user, navigating to login');
        navigate('/login');
        return;
      }

      try {
        const userDetails = await checkUserDetails(user.username);
        console.log('User details in Dashboard:', userDetails);
        if (!userDetails || (Array.isArray(userDetails) && userDetails.length === 0)) {
          console.log('No user details, navigating to complete profile');
          navigate('/complete-profile');
          return;
        }

        if (!postsQueried) {
          console.log('Loading posts');
          loadPosts(user.username);
          setPostsQueried(true);
        }
      } catch (error) {
        console.error('Error checking user details:', error);
      }
    };

    checkUserDetailsAndLoadPosts();
  }, [user, postsQueried, navigate]);

  if (!user) {
    console.log('No user, returning null');
    return null;
  }

  console.log('Rendering Dashboard');
  return (
    <div className="dashboard-container">
      <h3>Welcome {user.attributes.name}</h3>
      <button onClick={signOut}>Sign Out</button>
      <UploadSection user={user} />
      <PostsTable posts={upcomingPosts} setPosts={setPosts} />
    </div>
  );
};

export default Dashboard;

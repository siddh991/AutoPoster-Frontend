import React, { useState, useEffect } from 'react';
import UploadSection from '../uploadFile/uploadFile.js';
import PostsTable from '../generateTable/generateTable.js';
import { API, graphqlOperation } from 'aws-amplify';
import { posts } from '../../graphql/queries';
import './Dashboard.css';

const Dashboard = ({ user, signOut }) => {
  const [upcomingPosts, setPosts] = useState([]);
  const [postsQueried, setPostsQueried] = useState(false);

  const fetchPosts = async (username) => {
    try {
      const postData = await API.graphql(graphqlOperation(posts, { company_id: username }));
      const postList = postData.data.posts;
      setPosts(postList);
    } catch (error) {
      console.log('Error on fetching posts', error);
    }
  };

  const processFile = async ({ file, user }) => {
    file = file.file;
    console.log(file);
    console.log(user);
    const username = user.username;

    const uniqueFileName = `${username}/${file.name}`;

    return { file, key: uniqueFileName };
  };

  useEffect(() => {
    if (!postsQueried) {
      fetchPosts(user.username);
      setPostsQueried(true);
    }
  }, [postsQueried, user.username]);

  return (
    <div className="dashboard-container">
      <h3>Welcome {user.attributes.name}</h3>
      <button onClick={signOut}>Sign Out</button>
      <UploadSection user={user} processFile={processFile} />
      <PostsTable posts={upcomingPosts} setPosts={setPosts} />
    </div>
  );
};

export default Dashboard;

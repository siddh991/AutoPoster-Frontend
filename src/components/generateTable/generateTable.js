import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { API, graphqlOperation } from 'aws-amplify';
import GenerateTableRow from './generateTableRow'; 
import { deletePost as deletePostMutation, updatePost as updatePostMutation, generateAICaption as generateAICaptionMutation } from '../../graphql/mutations';
import { deletePost, updatePost } from '../apis/api.js'; 

const PostsTable = ({ posts, setPosts }) => {
  const [open, setOpen] = useState(null);
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const handleExpandClick = (postId, currentCaption) => {
    if (open === postId) {
      setOpen(null);
    } else {
      setOpen(postId);
    }
  };

  const handleDeleteClick = async (postId) => {
    try {
      console.log('starting delete process');
      // const response = await API.graphql(graphqlOperation(deletePostMutation, {id: postID}));
      // if (response.data.deletePost) {
      //   const updatedPosts = posts.filter(post => post.id !== postID);
      //   setPosts(updatedPosts);
      //   console.log('Deleted successfully:', response.data.deletePost);
      // }
      await deletePost(postId);
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      console.log('Deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdateClick = async (postId, newCaption) => {
    try {
      // const response = await API.graphql(graphqlOperation(updatePostMutation, { id: postId, caption: newCaption }));
      // console.log(response);
      // if (response.data.updatePost) {
      //   const updatedPosts = posts.map(post =>
      //     post.id === postId ? { ...post, caption: newCaption } : post
      //   );
      //   setPosts(updatedPosts);
      //   setOpen(null); // Close the edit mode
      console.log('Starting update process');
      await updatePost(postId, newCaption);
      const updatedPosts = posts.map(post =>
        post.id === postId ? { ...post, caption: newCaption } : post
      );
      setPosts(updatedPosts);
      setOpen(null); // Close the edit mode
      console.log('Updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleRegenerateClick = async (postId, previousCaption, feedback = '') => {
    setIsAIGenerating(true);
    try {
      const post = posts.find(p => p.id === postId);
      console.log('previous caption is %s, previous bucket is %s', previousCaption, post.bucket)
      const response = await API.graphql(graphqlOperation(generateAICaptionMutation, { id: postId, previous_caption: previousCaption, bucket: post.bucket, key: post.key, prompt: feedback}));
      console.log(response.data)
      const aiCaption = response.data.generateAICaption.caption;
      console.log(aiCaption)
      return aiCaption;
    } catch (error) {
      console.error('Error generating AI caption:', error);
      return null;
    } finally {
      setIsAIGenerating(false);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Image</TableCell>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Post At</TableCell>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Caption</TableCell>
            <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Actions</TableCell>
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

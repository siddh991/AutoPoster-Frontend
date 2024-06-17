import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { API, graphqlOperation } from 'aws-amplify';
import generateTableRow from './generateTableRow'; 
import { deletePost as deletePostMutation } from '../graphql/mutations';


const PostsTable = ({ posts, setPosts}) => {
  const [open, setOpen] = useState(null);

  const handleExpandClick = (postId) => {
    setOpen(open === postId ? null : postId);
  };

  const handleDeleteClick = async (postID) => {
    try{
      console.log('starting delete process');
      console.log(posts);
      const response = await API.graphql(graphqlOperation(deletePostMutation, {id: postID}));
      console.log('done deleting');
      if (response.data.deletePost){
        const updatedPosts = posts.filter(post => post.id !== postID);
        setPosts(updatedPosts);
        console.log('Deleted successfully:', response.data.deletePost);
      }
    } catch (error){
      console.error('Error deleting post:', error);
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
          {posts.map((post) => generateTableRow(post, open, handleExpandClick, handleDeleteClick))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostsTable;
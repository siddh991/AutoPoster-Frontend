// src/components/PostsTable.js
// import React, { useState } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
//   Collapse, Box, Typography
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { styled } from '@mui/system';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import generateTableRow from './generateTableRow'; // Importing the function


// const generateTableRow = (post) => (
//   <tr key={post.storageUrl}>
//     <td>{new Date(post.postAt).toLocaleString()}</td>
//     <td>
//       <img src={post.storageUrl} 
//       style={{
//         maxWidth: '50%',   // Set a maximum width
//         maxHeight: '50%',  // Set a maximum height
//         width: 'auto',       // Allow width to adjust based on aspect ratio
//         height: 'auto'      // Allow height to adjust based on aspect ratio
//       }}/>
//     </td>
//     <td>{post.caption}</td>
//   </tr>
// );

// const generateTableRow = (post) => (
//   <TableRow key={post.storageUrl}>
//     <TableCell>{new Date(post.postAt).toLocaleString()}</TableCell>
//     <TableCell>{post.caption}</TableCell>
//     <TableCell>
//       <img src={post.storageUrl} alt="Post" style={{ maxWidth: '100px', maxHeight: '100px' }} />
//     </TableCell>
//     <TableCell>
//       <IconButton aria-label="edit">
//         <EditIcon />
//       </IconButton>
//       <IconButton aria-label="delete">
//         <DeleteIcon />
//       </IconButton>
//     </TableCell>
//   </TableRow>
// );

// const PostsTable = ({ posts }) => (
//   <TableContainer component={Paper}>
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>Post At</TableCell>
//           <TableCell>Caption</TableCell>
//           <TableCell>Image</TableCell>
//           <TableCell>Actions</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {posts.map(post => generateTableRow(post))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// );

const PostsTable = ({ posts }) => {
  const [open, setOpen] = useState(null);

  const handleExpandClick = (postId) => {
    setOpen(open === postId ? null : postId);
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
          {posts.map((post) => generateTableRow(post, open, handleExpandClick))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostsTable;




// const PostsTable = ({ posts }) => (
//   <div>
//     <h3 align="left">Upcoming Posts:</h3>
//     <table>
//       <thead>
//         <tr>
//           <th>Post At</th>
//           <th>Image</th>
//           <th>Caption</th>
//         </tr>
//       </thead>
//       <tbody>
//         {posts.map(post => generateTableRow(post))}
//       </tbody>
//     </table>
//   </div>
// );

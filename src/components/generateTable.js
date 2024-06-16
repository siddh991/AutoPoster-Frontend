// src/components/PostsTable.js
import React from 'react';

const generateTableRow = (post) => (
  <tr key={post.storageUrl}>
    <td>{new Date(post.postAt).toLocaleString()}</td>
    <td>
      <img src={post.storageUrl} 
      style={{
        maxWidth: '50%',   // Set a maximum width
        maxHeight: '50%',  // Set a maximum height
        width: 'auto',       // Allow width to adjust based on aspect ratio
        height: 'auto'      // Allow height to adjust based on aspect ratio
      }}/>
    </td>
    <td>{post.caption}</td>
  </tr>
);

const PostsTable = ({ posts }) => (
  <div>
    <h3 align="left">Upcoming Posts:</h3>
    <table>
      <thead>
        <tr>
          <th>Post At</th>
          <th>Image</th>
          <th>Caption</th>
        </tr>
      </thead>
      <tbody>
        {posts.map(post => generateTableRow(post))}
      </tbody>
    </table>
  </div>
);

export default PostsTable;

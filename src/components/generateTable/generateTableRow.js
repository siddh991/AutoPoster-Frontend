import React from 'react';
import { TableRow, TableCell, IconButton, Collapse, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const generateTableRow = (post, open, handleExpandClick, handleDeleteClick) => (
  <React.Fragment key={post.id}>
    <TableRow>
      <TableCell>
        <img src={post.storageUrl} alt="Post" style={{ width: '150px', height: '150px' }} />
      </TableCell>
      <TableCell>{new Date(post.postAt).toLocaleString()}</TableCell>
      <TableCell>{post.caption}</TableCell>
      <TableCell>
        <IconButton onClick={() => handleExpandClick(post.id)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteClick(post.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
        <Collapse in={open === post.id} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Typography variant="h6" gutterBottom component="div">
              Edit Post
            </Typography>
            {/* Add form or additional content here */}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </React.Fragment>
);

export default generateTableRow;


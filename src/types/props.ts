import { Post } from './post';
import { User } from './user';
import React from 'react';

/**
 * Props for the Dashboard component
 * @see /src/components/dashboard/Dashboard.js
 */
export interface DashboardProps {
  user: User;                       // Current authenticated user
  signOut: () => void;              // Function to sign out user
}

/**
 * Props for the PostsTable component
 * @see /src/components/generateTable/generateTable.js
 */
export interface PostsTableProps {
  posts: Post[];                    // Array of posts to display
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;  // Function to update posts
}

/**
 * Props for the GenerateTableRow component
 * @see /src/components/generateTable/generateTableRow.js
 */
export interface TableRowProps {
  post: Post;                       // Post data to display in the row
  open: string | null;              // ID of currently open row for editing
  handleExpandClick: (postId: string, currentCaption: string | null) => void;  // Toggle row expansion
  handleDeleteClick: (postId: string) => void;                          // Delete post
  handleUpdateClick: (postId: string, newCaption: string, isAIUpdate?: boolean) => void;      // Update post
  handleRegenerateClick: (postId: string, previousCaption: string, feedback?: string) => Promise<string | null>;  // Generate AI caption
  isAIGenerating: boolean;          // Whether AI generation is in progress
}

/**
 * Props for the UploadSection component
 * @see /src/components/uploadFile/uploadFile.js
 */
export interface UploadSectionProps {
  user: User;                       // Current user for file naming
  processFile: (params: { file: any; user: User }) => Promise<{ file: any; key: string }>;  // Process uploaded file
}

/**
 * Props for the PrivateRoute component
 * @see /src/components/auth/PrivateAuth.tsx
 */
export interface PrivateRouteProps {
  element: React.ComponentType<any>;  // Component to render if authenticated
}

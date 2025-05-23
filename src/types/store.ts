import { Post, PostUpdateParams, AIGenerationParams } from './post';
import { User } from './user';
import { UserDetails } from './userDetails';

// Authentication state store
// Manages user authentication state and operations
export interface AuthState {
  // State
  user: User | null;         // Current authenticated user, null if not logged in
  isLoading: boolean;        // Whether authentication operations are in progress
  error: string | null;      // Error message from the last operation, if any
  
  // Actions
  signIn: (username: string, password: string) => Promise<void>;  // Sign in with username/password
  setUserFromAmplify: (amplifyUser: any) => void;                 // Set user from already authenticated Amplify user
  signOut: () => Promise<void>;                                   // Sign out the current user
  checkAuthState: () => Promise<void>;                            // Check if user is already authenticated
}

// Posts state store
// Manages posts and related operations
export interface PostsState {
  // State
  posts: Post[];             // Array of posts
  isLoading: boolean;        // Whether post operations are in progress
  error: string | null;      // Error message from the last operation, if any
  companyId: string;         // Current company ID
  
  // Actions
  fetchPosts: (companyId: string) => Promise<void>;                      // Get posts for a company
  updatePost: (params: PostUpdateParams) => Promise<void>;               // Update a post's caption
  deletePost: (postId: string) => Promise<void>;                         // Delete a post
  generateAICaption: (params: AIGenerationParams) => Promise<string | null>;  // Generate AI caption
  getCurrentCompanyId: () => string;                                     // Get current company ID
}

// User details state store
// Manages company profile information
export interface UserDetailsState {
  // State
  userDetails: UserDetails | null;  // Current user's company details
  isLoading: boolean;               // Whether user details operations are in progress
  error: string | null;             // Error message from the last operation, if any
  
  // Actions
  fetchUserDetails: (companyId: string) => Promise<UserDetails | null>;  // Get user details
  createUserDetails: (details: UserDetails) => Promise<UserDetails>;     // Create new user details
  updateUserDetails: (details: UserDetails) => Promise<UserDetails>;     // Update existing details
  clearUserDetails: () => void;                                          // Clear user details (useful for logout)
}
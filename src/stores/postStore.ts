import { create } from 'zustand';
import { PostsState } from '../types/store';
import { Post, PostUpdateParams, AIGenerationParams } from '../types/post';
import { fetchPosts, updatePost, deletePost, generateAICaption } from '../services/posts';

/**
 * Post store for managing post state and operations
 * 
 * This store centralizes all post-related data and operations,
 * keeping components clean and focused on presentation.
 */
export const usePostsStore = create<PostsState>((set, get) => ({
  // State
  posts: [],
  isLoading: false,
  error: null,
  companyId: localStorage.getItem('companyId') || '',
  
  // Actions
  fetchPosts: async (companyId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Save company ID to localStorage for future reference
      localStorage.setItem('companyId', companyId);
      set({ companyId });
      
      const posts = await fetchPosts(companyId);
      set({ posts, isLoading: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch posts', 
        isLoading: false 
      });
    }
  },
  
  updatePost: async (params: PostUpdateParams) => {
    set({ isLoading: true, error: null });
    
    try {
      await updatePost(params);
      
      // Update local state to reflect the change
      const { posts } = get();
      const updatedPosts = posts.map(post => 
        post.id === params.postId 
          ? { ...post, caption: params.caption } 
          : post
      );
      
      set({ posts: updatedPosts, isLoading: false });
    } catch (error) {
      console.error('Error updating post:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update post', 
        isLoading: false 
      });
    }
  },
  
  deletePost: async (postId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await deletePost(postId);
      
      // Update local state to remove the deleted post
      const { posts } = get();
      const updatedPosts = posts.filter(post => post.id !== postId);
      
      set({ posts: updatedPosts, isLoading: false });
    } catch (error) {
      console.error('Error deleting post:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete post', 
        isLoading: false 
      });
    }
  },
  
  generateAICaption: async (params: AIGenerationParams) => {
    // Don't set global loading state for AI generation
    // set({ isLoading: true, error: null });
    set({ error: null });
    
    try {
      const caption = await generateAICaption(params);
      // set({ isLoading: false });
      return caption;
    } catch (error) {
      console.error('Error generating AI caption:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate AI caption'
        // isLoading: false 
      });
      return null;
    }
  },
  
  getCurrentCompanyId: () => {
    return get().companyId || localStorage.getItem('companyId') || '';
  }
}));
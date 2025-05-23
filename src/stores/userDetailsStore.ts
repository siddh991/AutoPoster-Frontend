import { create } from 'zustand';
import { UserDetailsState } from '../types/store';
import { UserDetails } from '../types/userDetails';
import { checkUserDetails, createUserDetails, updateUserDetails } from '../services/user';

/**
 * User details store for managing company profile information
 * 
 * This store centralizes all operations related to user/company details
 * and provides a clean API for components to interact with this data.
 */
export const useUserDetailsStore = create<UserDetailsState>((set, get) => ({
  // State
  userDetails: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchUserDetails: async (companyId: string) => {
    // Get current state to check if we already have details for this company
    const currentState = get();
    
    // Skip fetching if already loaded for this company and data exists
    if (currentState.userDetails?.companyId === companyId && !currentState.isLoading) {
      console.log('UserDetailsStore: Already have details for', companyId);
      return currentState.userDetails;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      console.log('UserDetailsStore: Fetching details for companyId:', companyId);
      const details = await checkUserDetails(companyId);
      console.log('UserDetailsStore: Received details from service:', details ? 'exists' : 'null');
      
      // Important - directly set the state with the transformed data
      set(state => ({ 
        ...state,
        userDetails: details, 
        isLoading: false 
      }));
      
      return details; // Return the details for caller convenience
    } catch (error) {
      console.error('Error fetching user details:', error);
      set(state => ({ 
        ...state,
        error: error instanceof Error ? error.message : 'Failed to fetch user details', 
        isLoading: false,
        userDetails: null // Important - explicitly set to null on error
      }));
      return null;
    }
  },
  
  createUserDetails: async (details: UserDetails) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('UserDetailsStore: Creating new user details');
      await createUserDetails(details);
      
      // Important - directly update the store with the provided details
      set({ userDetails: details, isLoading: false });
      console.log('UserDetailsStore: Details saved to store');
      
      return details;
    } catch (error) {
      console.error('Error creating user details:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create user details', 
        isLoading: false 
      });
      throw error; // Re-throw to allow component error handling
    }
  },
  
  updateUserDetails: async (details: UserDetails) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('UserDetailsStore: Updating user details');
      await updateUserDetails(details);
      
      // Important - directly update the store with the provided details
      set({ userDetails: details, isLoading: false });
      console.log('UserDetailsStore: Updated details saved to store');
      
      return details;
    } catch (error) {
      console.error('Error updating user details:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update user details', 
        isLoading: false 
      });
      throw error; // Re-throw to allow component error handling
    }
  },
  
  // Helper to clear user details (useful for logout)
  clearUserDetails: () => {
    set({ userDetails: null });
  }
}));
import { create } from 'zustand';
import { Auth } from 'aws-amplify';
import { AuthState } from '../types/store';
import { User, mapCognitoUserToUser } from '../types/user';

/**
 * Authentication store for managing user authentication state
 * 
 * This store handles all authentication-related operations and state,
 * leveraging AWS Amplify Auth for the actual authentication operations.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // State
  user: null,
  isLoading: false,
  error: null,
  
  // Actions
  signIn: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const cognitoUser = await Auth.signIn(username, password);
      const user = mapCognitoUserToUser(cognitoUser);
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Error signing in:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in', 
        isLoading: false 
      });
    }
  },
  
  // Set user from already authenticated Amplify user
  setUserFromAmplify: (amplifyUser: any) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = mapCognitoUserToUser(amplifyUser);
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Error setting user from Amplify:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to set user', 
        isLoading: false 
      });
    }
  },
  
  signOut: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await Auth.signOut();
      set({ user: null, isLoading: false });
      
      // Clear user details from the user details store
      // We need to access the userDetailsStore here
      const { useUserDetailsStore } = await import('./userDetailsStore');
      useUserDetailsStore.getState().clearUserDetails();
    } catch (error) {
      console.error('Error signing out:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out', 
        isLoading: false 
      });
    }
  },
  
  checkAuthState: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const user = mapCognitoUserToUser(cognitoUser);
      set({ user, isLoading: false });
    } catch (error) {
      // Not signed in - this is not an error
      set({ user: null, isLoading: false });
    }
  }
}));
// an AWS Cognito user returned by Auth.currentAuthenticatedUser()
export interface CognitoUser {
    username: string;
    attributes: {
      email?: string;
      email_verified?: boolean;
      name?: string;
      sub?: string;
      [key: string]: any;
    };
    signInUserSession?: {
      accessToken: {
        jwtToken: string;
      };
      idToken: {
        jwtToken: string;
      };
    };
  }
  
// a simplified user model taking from the CognitoUser simply what our app needs
  export interface User {
    username: string;       // Used as companyId in API calls (from Dashboard.js line 55)
    attributes: {
      name: string;         // User's display name (from Dashboard.js line 74)
      email?: string;       // Optional email
      [key: string]: any;   // Other attributes we might need
    };
    isAuthenticated: boolean; // Whether user is logged in
  }
  
// Convert CognitoUser to User
export function mapCognitoUserToUser(cognitoUser: CognitoUser): User {
    return {
      username: cognitoUser.username,
      attributes: {
        // Use name if available, otherwise fall back to username
        name: cognitoUser.attributes?.name || cognitoUser.username,
        email: cognitoUser.attributes?.email,
        ...cognitoUser.attributes  // Include any other attributes
      },
      isAuthenticated: true
    };
  }
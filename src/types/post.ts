// Represents a social media post in the application
export interface Post {
    // Core identifiers
    id: string;                // Unique identifier for the post
    companyId: string;        // Associated company ID
    
    // Content
    caption: string;           // Post caption text
    
    // Storage information
    bucket: string;           // S3 bucket containing the image
    key: string;               // S3 key for the image
    
    // Scheduling
    postAt: string;           // When the post is scheduled to be published
    
    // Status information
    status?: 'pending' | 'published' | 'failed';  // Current status of the post
  }

  export interface PostUpdateParams {
    postId: string;            // ID of the post to update
    caption: string;           // New caption text
  }

  export interface PostDeleteParams {
    postId: string;            // ID of the post to delete
  }

  export interface AIGenerationParams {
    postId: string;            // ID of the post to generate caption for
    previousCaption: string;   // Previous caption to improve upon
    feedback?: string;         // Optional user feedback for generation
    bucket: string;           // S3 bucket containing the image
    key: string;              // S3 key for the image
  }

  export interface AIGenerationResponse {
    caption: string;           // Generated caption text
  }
import { Post, PostUpdateParams, AIGenerationParams, AIGenerationResponse } from '../types/post';
import { usePostsStore } from '../stores/postStore';

const functionUrl = 'https://n7ovlq2nrf7vntjuggtjyiatx40monlu.lambda-url.us-east-2.on.aws/';
const generateCaptionUrl = 'https://r44htyo3nx6sntygh3shzlbym40vjoul.lambda-url.us-east-2.on.aws/';

/**
 * Fetch all posts for a company
 * @param companyId - The company ID to fetch posts for
 * @returns Array of posts
 */
export const fetchPosts = async (companyId: string): Promise<Post[]> => {
  const url = new URL(functionUrl);
  url.searchParams.append('company_id', companyId);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  if (response.status !== 200) {
    throw new Error(data.error);
  }
  
  return data as Post[];
};

/**
 * Update a post's caption
 * @param params - Update parameters containing postId and caption
 * @returns Response data
 */
export const updatePost = async (params: PostUpdateParams): Promise<any> => {
  const { postId, caption } = params;
  
  const requestBody = {
    action: 'update_caption', // Add action field to specify the operation
    post_id: postId,
    caption
  };
  
  console.log('Update Caption Request Body:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch(functionUrl, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  const data = await response.json();
  console.log('Update Caption Response:', data);
  
  if (response.status !== 200) {
    throw new Error(data.error || 'Failed to update caption');
  }
  
  return data;
};

/**
 * Delete a post
 * @param postId - ID of the post to delete
 * @returns Response data
 */
export const deletePost = async (postId: string): Promise<any> => {
  const response = await fetch(functionUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ post_id: postId })
  });
  
  const data = await response.json();
  if (response.status !== 200) {
    throw new Error(data.error);
  }
  
  return data;
};

/**
 * Generate an AI caption for a post
 * @param params - Generation parameters
 * @returns Generated caption or null if failed
 */
export const generateAICaption = async (params: AIGenerationParams): Promise<string | null> => {
  try {
    const { postId, previousCaption, feedback, bucket, key } = params;
    
    const requestBody = {
      post_id: postId,
      previous_caption: previousCaption,
      feedback: feedback || '',
      bucket,
      key
    };
    
    console.log('AI Generation Request:', requestBody);
    
    const response = await fetch(generateCaptionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate caption');
    }
    
    const data = await response.json();
    console.log('AI Generation Response:', data);
    
    // Ensure we return a string caption
    if (data.caption && typeof data.caption === 'string') {
      return data.caption;
    }
    
    throw new Error('Invalid response format from AI service');
  } catch (error) {
    console.error('Error in generateAICaption:', error);
    throw error; // Re-throw to be handled by the component
  }
};

/**
 * Generate a fallback caption from the user's feedback
 * @param feedback - User feedback for generating caption
 * @returns Fallback caption based on feedback
 */
const generateFallbackCaption = (feedback: string): string => {
  // Extract explicit caption instructions
  if (feedback.includes('caption that says')) {
    const match = feedback.match(/caption that says\s+([^#]+)/i);
    if (match && match[1]) {
      let caption = match[1].trim();
      
      // Add hashtags if mentioned
      const hashtagMatch = feedback.match(/#(\w+)/g);
      if (hashtagMatch && hashtagMatch.length > 0) {
        caption += ' ' + hashtagMatch.join(' ');
      }
      
      return caption;
    }
  }
  
  // Simple fallback if no clear instructions
  return feedback.trim();
};

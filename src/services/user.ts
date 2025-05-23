import { UserDetails, UniqueSellingPoint } from '../types/userDetails';

const functionUrl = 'https://wkb2dlkqxcitvyzs62rzaetpv40lopij.lambda-url.us-east-2.on.aws/';

/**
 * Fetch user details for a company
 * @param companyId - Company ID to fetch details for
 * @returns User details or null if not found
 */
export const checkUserDetails = async (companyId: string): Promise<UserDetails | null> => {
  const url = new URL(functionUrl);
  url.searchParams.append('company_id', companyId);
  
  try {
    console.log('UserService: Fetching details for:', companyId);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      console.log('UserService: User details not found');
      return null; // User details not found
    } else if (response.status !== 200) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching user details');
    }

    const data = await response.json();
    console.log('UserService: Received user details:', JSON.stringify(data, null, 2));

    // Check if data is an array and has content
    if (Array.isArray(data) && data.length > 0) {
      // Transform the array into an object
      const [
        companyName,
        industry,
        niche,
        location,
        targetAudience,
        uniqueSellingPoints,
        captionTone,
        captionFormatting,
        brandAssociation,
        promptTemplate
      ] = data;
      
      // Create the properly structured user details object
      const userDetails: UserDetails = {
        companyId,
        companyName,
        industry,
        niche,
        location,
        targetAudience,
        uniqueSellingPoints: Array.isArray(uniqueSellingPoints) 
          ? uniqueSellingPoints.map((usp: any): UniqueSellingPoint => ({
              feature: usp.feature,
              importance: usp.importance,
              weight: usp.weight || usp.importance / 5
            }))
          : [],
        captionTone,
        captionFormatting,
        brandAssociation,
        promptTemplate
      };
      
      console.log('UserService: Transformed user details:', JSON.stringify(userDetails, null, 2));
      return userDetails;
    } else if (typeof data === 'object' && data !== null) {
      // If API returns an object directly
      console.log('UserService: Received object format directly');
      return {
        companyId,
        ...data
      } as UserDetails;
    } else {
      console.log('UserService: No valid user details found');
      return null; // No valid user details found
    }
  } catch (error) {
    console.error('UserService: Error in checkUserDetails:', error);
    throw error;
  }
};

/**
 * Create new user details
 * @param userDetails - User details to create
 * @returns API response data
 */
export const createUserDetails = async (userDetails: UserDetails): Promise<any> => {
  console.log('UserService: Creating user details:', JSON.stringify(userDetails, null, 2));
  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        company_id: userDetails.companyId,
        ...userDetails
      })
    });
    
    const data = await response.json();
    if (response.status !== 200) {
      console.error('UserService: Error creating user details:', data.error);
      throw new Error(data.error || 'Failed to create user details');
    }
    console.log('UserService: User details created successfully:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('UserService: Error in createUserDetails:', error);
    throw error;
  }
};

/**
 * Update existing user details
 * @param userDetails - Updated user details
 * @returns API response data
 */
export const updateUserDetails = async (userDetails: UserDetails): Promise<any> => {
  console.log('UserService: Updating user details:', JSON.stringify(userDetails, null, 2));
  try {
    const updatedDetails = {
      company_id: userDetails.companyId,
      ...userDetails,
      unique_selling_points: userDetails.uniqueSellingPoints.map(usp => ({
        feature: usp.feature,
        importance: usp.importance,
        weight: usp.weight || usp.importance / 5
      }))
    };

    const response = await fetch(functionUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedDetails)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('UserService: Error updating user details:', errorData.error);
      throw new Error(errorData.error || 'Failed to update user details');
    }
    
    const data = await response.json();
    console.log('UserService: User details updated successfully:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('UserService: Error in updateUserDetails:', error);
    throw error;
  }
};
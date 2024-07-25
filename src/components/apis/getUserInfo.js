const functionUrl = 'https://dmncwwkkohwcc3lx6n3ge47dxq0nzfrw.lambda-url.us-east-2.on.aws/';

export const checkUserDetails = async (companyId) => {
  const url = new URL(functionUrl);
  url.searchParams.append('company_id', companyId);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 404) {
    console.log('User details not found');
    return null; // User details not found
  } else if (response.status !== 200) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  const data = await response.json();
  console.log('Received user details:', JSON.stringify(data, null, 2));

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
    
    return {
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
    };
  } else {
    console.log('No valid user details found');
    return null; // No valid user details found
  }
};

export const createUserDetails = async (userDetails) => {
  console.log('Creating user details:', JSON.stringify(userDetails, null, 2));
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userDetails)
  });
  
  const data = await response.json();
  if (response.status !== 200) {
    console.error('Error creating user details:', data.error);
    throw new Error(data.error);
  }
  console.log('User details created successfully:', JSON.stringify(data, null, 2));
  return data;
};

export const updateUserDetails = async (userDetails) => {
  console.log('Updating user details:', JSON.stringify(userDetails, null, 2));
  const updatedDetails = {
    ...userDetails,
    unique_selling_points: userDetails.uniqueSellingPoints.map(usp => ({
      feature: usp.feature,
      importance: usp.importance,
      weight: usp.weight || usp.importance / 5 // Calculate weight if not provided
    }))
  };
  console.log('Sending updated details:', JSON.stringify(updatedDetails, null, 2));
  
  const response = await fetch(functionUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedDetails)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error updating user details:', errorData.error);
    throw new Error(errorData.error || 'Failed to update user details');
  }
  
  const data = await response.json();
  console.log('User details updated successfully:', JSON.stringify(data, null, 2));
  return data;
};
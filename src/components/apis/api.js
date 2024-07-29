const functionUrl = 'https://n7ovlq2nrf7vntjuggtjyiatx40monlu.lambda-url.us-east-2.on.aws/';
const generateCaptionUrl = 'https://r44htyo3nx6sntygh3shzlbym40vjoul.lambda-url.us-east-2.on.aws/';

export const fetchPosts = async (companyId) => {
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
  return data;
};


export const updatePost = async (postId, caption) => {
    const response = await fetch(functionUrl, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ post_id: postId, caption })
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error);
    }
    return data;
  };

  export const deletePost = async (postId) => {
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

  export const regenerateAICaption = async (postId, previousCaption, feedback = '', bucket, key) => {
    const response = await fetch(generateCaptionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        post_id: postId, 
        previous_caption: previousCaption,
        feedback: feedback,
        bucket: bucket,
        key: key
      })
    });
    
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error || 'Failed to regenerate caption');
    }
    return data.caption;
  };
  
  
  

  
  

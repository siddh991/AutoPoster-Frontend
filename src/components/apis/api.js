const functionUrl = 'https://n7ovlq2nrf7vntjuggtjyiatx40monlu.lambda-url.us-east-2.on.aws/';

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
  

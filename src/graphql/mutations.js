/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const deletePost = /* GraphQL */ `
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
      postAt
      caption
      bucket
      key
      __typename
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost($id: ID!, $caption: String!) {
    updatePost(id: $id, caption: $caption) {
      id
      postAt
      caption
      bucket
      key
      __typename
    }
  }
`;
export const generateAICaption = /* GraphQL */ `
  mutation GenerateAICaption(
    $id: ID!
    $previous_caption: String!
    $bucket: String!
    $key: String!
    $prompt: String!
  ) {
    generateAICaption(
      id: $id
      previous_caption: $previous_caption
      bucket: $bucket
      key: $key
      prompt: $prompt
    ) {
      statusCode
      caption
      __typename
    }
  }
`;

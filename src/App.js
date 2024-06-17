import './App.css';
import awsconfig from './aws-exports';
import { Amplify, API, graphqlOperation, Storage } from 'aws-amplify';
import {Authenticator, FileUploader } from '@aws-amplify/ui-react'
import { StorageManager } from '@aws-amplify/ui-react-storage';
import { posts } from './graphql/queries'

import '@aws-amplify/ui-react/styles.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import signUpFormFields from './config/signUpForm'; 
// import OAuthCallback from './OAuthCallback';
import Header from './components/header';
import UploadSection from './components/uploadFile';
import PostsTable from './components/generateTable';


Amplify.configure(awsconfig)

export default function App() {
  const [upcomingPosts, setPosts] = useState([])
  const [postsQueried, setPostsQueried] = useState(false)

  const fetchPosts = async (username) => {
    console.log("fetchPosts")
    console.log(username)
    try {
      console.log('starting postsData')
      const postData = await API.graphql(graphqlOperation(posts, {company_id: username }));
      const postList = postData.data.posts;
      setPosts(postList);

      upcomingPosts.forEach(post => (
        console.log(post)
       ))
    } catch (error) {
      console.log('Error on fetching posts', error);
    }
  };

  const processFile = async ({ file, user }) => {
    file = file.file
    console.log(file)
    console.log(user);
    const username = user.username;
  
    const uniqueFileName = `${username}/${file.name}`;
  
    return { file, key: uniqueFileName };
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main style={{ marginLeft: '1%', marginRight: '1%' }}>
          <Routes>
            <Route path="/" element={
              <Authenticator formFields={signUpFormFields}>
                {({ signOut, user }) => {
                  if (postsQueried == false) {
                    fetchPosts(user.username);
                    setPostsQueried(true);
                  }
                  return (
                    <>
                      <h3>Welcome {user.attributes.name}</h3>
                      <button onClick={signOut}>SIGN OUT</button>
                      <UploadSection user={user} processFile={processFile} />
                      <PostsTable posts={upcomingPosts} setPosts={setPosts}/>
                    </>
                  );
                }}
              </Authenticator>
            } />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </main>        
      </div>
    </Router>
  );
}

// export default withAuthenticator(App);
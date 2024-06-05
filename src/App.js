import logo from './logo.svg';
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


Amplify.configure(awsconfig)

const formFields = {
  signUp: {
    email: {
      order:1
    },
    password: {
      order: 2
    },
    confirm_password: {
      order: 3
    },
    name: {
      label: "First Name",
      order: 4
    },
    family_name: {
      label: "Last Name",
      order: 5
    },
    'custom:Company': {
      label: "Company",
      placeholder: "Enter your Company",
      order: 6
    },
    phone_number: {
      order: 7
    },
  },
}

function generateTableRow(post) {
  return (
    <tr key={post.storageUrl}>
      <td>{new Date(post.postAt).toLocaleString()}</td>
      <td>
        <img src={post.storageUrl} 
        style={{
          maxWidth: '50%',   // Set a maximum width
          maxHeight: '50%',  // Set a maximum height
          width: 'auto',       // Allow width to adjust based on aspect ratio
          height: 'auto'      // Allow height to adjust based on aspect ratio
        }}/>
      </td>
      <td>{post.caption}</td>
    </tr>
  );
}

export default function App() {
  const [upcomingPosts, setPosts] = useState([])
  const [postsQueried, setPostsQueried] = useState(false)

  const fetchPosts = async (username) => {
    console.log("fetchPosts")
    console.log(username)
    try {
      const postData = await API.graphql(graphqlOperation(posts, { id: username }));
      // console.log(postData.data.posts)
      const postList = postData.data.posts;
      // console.log('posts:', postList);
      setPosts(postList);

      // console.log(upcomingPosts)

      upcomingPosts.forEach(post => (
        console.log(post)
       ))
    } catch (error) {
      console.log('Error on fetching upcoming posts', error);
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
    <Authenticator formFields={formFields}>
      {({ signOut, user }) => {
        // Set the user name here within the Authenticator context
        console.log(user.username)

        // Now fetchPosts after setting userName
        if(postsQueried == false) {
          fetchPosts(user.username);
          setPostsQueried(true);
        }
        
        return (
          <Router>
            <div className="App">
              <header className="App-header">
                <div align="left">
                  <h1>AutoPoster For Instagram</h1>
                  <h3>Welcome {user.attributes.name}</h3>
                </div>
                <button onClick={signOut}>SIGN OUT</button>
                <nav>
                  <Link to='/'>Home</Link> | <Link to='/privacy-policy'>Privacy Policy</Link> | <Link to="/terms-of-service">Terms of Service</Link>
                </nav>
              </header>
              <main style={{ marginLeft: '1%', marginRight: '1%' }}>
                <Routes>
                <Route path="/" element={
                  <>
                    <h3 align="left">Upload Photos:</h3>
                    <StorageManager
                      acceptedFileTypes={['.jpeg', '.jpg']}
                      accessLevel="public"
                      autoUpload={false}
                      maxFileCount={30}
                      processFile={(file) => processFile({ file, user })}
                    />
                    <h3 align="left">Upcoming Posts:</h3>
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>Post At</th>
                            <th>Image</th>
                            <th>Caption</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingPosts.map(post => generateTableRow(post))}
                        </tbody>
                      </table>
                    </div>
                  </>
                } />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
              </Routes>
              </main>        
            </div>
          </Router>
        );
      }}
    </Authenticator>
  );
}

// export default withAuthenticator(App);

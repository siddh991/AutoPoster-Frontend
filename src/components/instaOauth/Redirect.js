import React from "react";
import { useEffect } from "react";
import axios from "axios";

const InstagramRedirect = () => {
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get('code');
    axios.post("https://xfup33jui6bgog3r5w5jkydbte0vggjr.lambda-url.us-east-2.on.aws/instagramaccesstoken", {
      code: code,
    })
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, []);
  
  return (
    <div>
      <h1>Instagram Authorization</h1>
      <p>Status: 200 OK</p>
      <p>Authorization successful. You can close this window.</p>
    </div>
  );
};

export default InstagramRedirect;
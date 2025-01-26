import React from "react";
import { useEffect } from "react";
import axios from "axios";

const InstagramRedirect = () => {
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get('code');
    axios.post("https://c4gtukrl53e6zmzyoen4i7pprm0hlsel.lambda-url.us-east-2.on.aws/tiktokaccesstoken", {
      code: code,
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
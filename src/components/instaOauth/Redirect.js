import React from "react";
import { useEffect } from "react";
import axios from "axios";
const Redirect= () => {
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get('code');
    axios.post("https://c4gtukrl53e6zmzyoen4i7pprm0hlsel.lambda-url.us-east-2.on.aws/tiktokaccesstoken", {
    code: code,
    });
  }, []);
  
  return <div>Redirect page</div>;
};
export default Redirect;
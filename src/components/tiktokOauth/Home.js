import React from "react";
// import axios from "axios";
const Home = () => {
  // const request_token = async () => {
  //   const response = await axios.get("https://c4gtukrl53e6zmzyoen4i7pprm0hlsel.lambda-url.us-east-2.on.aws/oauth");
  //   window.location.href = `${response.data.url}`;
  // };
  // const request_token = 'https://www.google.com'
  const doNothing = () => {
    // This function does nothing
  };
return (
    <div>
      <div>
        <button onClick={doNothing}>Tik tok</button>
      </div>
    </div>
  );
};
export default Home;

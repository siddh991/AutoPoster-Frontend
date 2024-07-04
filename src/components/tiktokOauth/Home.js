import React from "react";
import axios from "axios";
const Home = () => {
  const request_token = async () => {
    const response = await axios.get("https://c4gtukrl53e6zmzyoen4i7pprm0hlsel.lambda-url.us-east-2.on.aws/oauth");
    window.location.href = `${response.data.url}`;
  };
return (
    <div>
      <div>
        <button onClick={request_token}>Tik tok</button>
      </div>
    </div>
  );
};
export default Home;

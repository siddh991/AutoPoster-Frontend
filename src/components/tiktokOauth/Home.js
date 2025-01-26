import React from "react";
import axios from "axios";

const TiktokHome = ({ user }) => {
  const request_token = async () => {
    try {
      const response = await axios.get("https://c4gtukrl53e6zmzyoen4i7pprm0hlsel.lambda-url.us-east-2.on.aws/oauth");
      window.location.href = `${response.data.url}`;
    } catch (error) {
      console.error("Error requesting TikTok token:", error);
    }
  };

  return (
    <div>
      <h2>TikTok Setup</h2>
      {user ? (
        <div>
          <p>Welcome, {user.attributes.name}!</p>
          <p>Click the button below to connect your TikTok account:</p>
          <button onClick={request_token}>Connect TikTok</button>
        </div>
      ) : (
        <p>Please log in to access TikTok setup.</p>
      )}
    </div>
  );
};

export default TiktokHome;

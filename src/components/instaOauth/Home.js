import React from "react";

const InstagramHome = ({ user }) => {
  const connectInstagramBusiness = () => {
    window.location.href = "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=785546827123900&redirect_uri=https://www.influent.studio/instagram-redirect&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";
  };

  return (
    <div>
      <h2>Instagram Setup</h2>
      {user ? (
        <div>
          <p>Welcome, {user.attributes.name}!</p>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <button onClick={connectInstagramBusiness}>Connect Instagram Business</button>
          </div>
        </div>
      ) : (
        <p>Please log in to access social media setup.</p>
      )}
    </div>
  );
};

export default InstagramHome;

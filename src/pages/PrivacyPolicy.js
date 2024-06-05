import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ margin: '1em' }}>
      <h1 style={{ textAlign: 'center' }}>Privacy Policy for MediaPoster</h1>
      <p style={{ textAlign: 'center' }}><em>Last Updated: January 2, 2024</em></p>
      <div style={{ textAlign: 'left'}}>
        <p>Welcome to MediaPoster. This Privacy Policy explains how we collect, use, protect, and handle your personal information as you use our app and services. Our privacy policy is subject to change at our discretion at any time without any notice to customers.</p>

        <p>By using the app and this website, you agree to the privacy policy stipulated below.</p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following information:</p>
        <ul>
          <li>Personal Information: Your name and email address, phone numbers.</li>
          <li>Social Media Profiles: Information from your connected social media accounts.</li>
          <li>Content: Videos, photos, and other media that you provide for posting.</li>
          <li>Usage Data: Statistics and performance metrics about your posted content.</li>
        </ul>

        <h2>2. Purpose of Information Collection</h2>
        <p>Your information is used to:</p>
        <ul>
          <li>Facilitate the posting of your content on various social media channels.</li>
          <li>Generate AI-driven captions for Instagram and synthesize TikTok videos.</li>
          <li>Create dashboards for monitoring your content's performance and impressions.</li>
        </ul>
        <p>Furthermore, by submitting your email address, we reserve the right to send you emails regarding account information. We will not send unsolicited commercial emails.</p>

        <h2>3. Data Sharing</h2>
        <p>The only data shared is the content you submit for us to post on your behalf on your social media accounts. We do not share your personal information with third parties, except as required for providing our services.</p>

        <h2>4. Third Party Liability</h2>
        <p>We are not liable or in any way responsible for the actions of any third parties who we are integrated with (i.e. TikTok, Instagram, etc.). We do our level best to handle your individual data the best we can, but don’t have any control over internal policies of those third party companies.</p>

        <h2>5. Third Party Service Integration</h2>
        <p>MediaPoster integrates with social media platforms like TikTok and Instagram to provide our services. However, we will not individually store any passwords or login credentials for those platforms. Instead, we will use each social media’s login API kit to gain permissions to post into your account and post on your behalf.</p>

        <h2>6. Data Security</h2>
        <p>We prioritize your privacy:</p>
        <ul>
          <li>We do not store passwords; we use login kits from social media platforms.</li>
          <li>While posted content is public, we protect your personal information against unauthorized access.</li>
        </ul>

        <h2>7. User Rights</h2>
        <p>These terms will remain in full force so long as you choose to continue to use our service. You have the control to:</p>
        <ul>
          <li>Delete your MediaPoster account at any time, which will cease all posting activities.</li>
          <li>Manually delete or modify posts and captions directly on social media accounts.</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <p>Our services are intended for users who are 18 years of age or older.</p>

        <h2>9. Cookies and Tracking</h2>
        <p>We do not use cookies or similar tracking technologies.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

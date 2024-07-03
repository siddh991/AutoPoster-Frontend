import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => (
  <div className="home-container">
    <div className="hero-section">
      <h1>Welcome to Influent</h1>
      <p>Automate your social media updates with ease</p>
      <Link to="/login">
        <button className="login-button">Login / Sign Up</button>
      </Link>
    </div>
  </div>
);

export default Homepage;

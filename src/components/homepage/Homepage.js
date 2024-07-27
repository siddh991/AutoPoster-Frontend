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
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSc-MlF75GFGY1xBY4aq8OxFrxxoS66ZcQaDqhnJp1RAe-qKWg/viewform?usp=sharing" target="_blank" rel="noopener noreferrer">
        <button className="waitlist-button">Sign up for Waitlist</button>
      </a>
    </div>
  </div>
);

export default Homepage;

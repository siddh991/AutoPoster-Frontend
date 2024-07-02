import React from 'react';
import { Link } from 'react-router-dom';
import logo from './Influent.png'; 
import './header.css'; 

const Header = () => (
  <header className="App-header">
    <div className="logo-container">
      <img src={logo} alt="Influent AI Logo" className="logo" />
    </div>
    <nav className="nav-links">
      <Link to='/'>Home</Link>
      <Link to='/privacy-policy'>Privacy Policy</Link>
      <Link to='/terms-of-service'>Terms of Service</Link>
      <Link to='/dashboard'>Dashboard</Link> {/* Added Dashboard link */}
      <Link to='/login'>Login</Link> {/* Added Login link */}
    </nav>
  </header>
);


export default Header;

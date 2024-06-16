import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="App-header">
    <div align="left">
      <h1>MediaSync</h1>
    </div>
    <nav>
      <Link to='/'>Home</Link> | <Link to='/privacy-policy'>Privacy Policy</Link> | <Link to="/terms-of-service">Terms of Service</Link>
    </nav>
  </header>
);

export default Header;

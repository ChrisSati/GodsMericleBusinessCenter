import React from "react";
import "./Header.css";
import ships from "./ships.jpg"; 

const Header = () => {
  return (
    <header
      className="header"
      style={{ backgroundImage: `url(${ships})` }}
    >
      <div className="overlay">
        <div className="header-content">
          <h1>God's Mericle Business Center</h1>
          <p>Your professional solution starts here</p>
          <button>Get Started</button>
        </div>
      </div>
    </header>
  );
};

export default Header;

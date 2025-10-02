import React, { useState } from "react";
import { Link } from "react-router-dom";  // ✅ import Link
import "./Navbar.css";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <nav className="navbar">
      <h2 className="logo">GOD's-MBS</h2>

      {/* Mobile menu */}
      <ul className={`nav-links-mobile ${isMobile ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/loginform" className="cart-btn">Login</Link></li>
      </ul>

      {/* Desktop menu */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/loginform" className="cart-btn">Login</Link></li>
      </ul>

      <button
        className="mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}
      >
        {isMobile ? <>&#10005;</> : <>&#9776;</>}
      </button>
    </nav>
  );
};

export default Navbar;






// import React, { useState } from "react";
// import "./Navbar.css";

// const Navbar = () => {
//   const [isMobile, setIsMobile] = useState(false);

//   return (
//     <nav className="navbar">
//       <h2 className="logo">PO-LU</h2>

//       {/* Mobile menu always uses nav-links-mobile, toggle 'open' class */}
//       <ul className={`nav-links-mobile ${isMobile ? "open" : ""}`}>
//         <li><a href="/">Home</a></li>
//         <li><a href="/shop">Shop</a></li>
//         <li><a href="/about">About</a></li>
//         <li><a href="/contact">Contact</a></li>
//         <li><a path="/loginform" className="cart-btn">Login</a></li>
        
//       </ul>

//       {/* Desktop menu stays as nav-links */}
//       <ul className="nav-links">
//         <li><a href="/">Home</a></li>
//         <li><a href="/shop">Shop</a></li>
//         <li><a href="/about">About</a></li>
//         <li><a href="/contact">Contact</a></li>
//         <li><a path="/loginform" className="cart-btn">Login</a></li>
//       </ul>

//       <button
//         className="mobile-menu-icon"
//         onClick={() => setIsMobile(!isMobile)}
//       >
//         {isMobile ? <>&#10005;</> : <>&#9776;</>}
//       </button>
//     </nav>
//   );
// };

// export default Navbar;

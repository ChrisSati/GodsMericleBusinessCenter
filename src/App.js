import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import LoginForm from "./forms/LoginForm";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import UserDashboard from "./Dashboard/UserDashboard";
import SellersDashboard from "./AdminDashboard/Sellers/SellersDashboard";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";

function App() {
  const location = useLocation();

  // Pages that should NOT have the Navbar
  const noNavbarRoutes = ["/adminDashboard", "/userDashboard", "/sellersDashboard"];

  const hideNavbar = noNavbarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {/* Only show Navbar if route is not in noNavbarRoutes */}
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Dashboard routes (no Navbar, full page) */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/sellersDashboard" element={<SellersDashboard />} />

        {/* Login */}
        <Route path="/loginform" element={<LoginForm />} />

        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;





// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import './App.css';
// import LoginForm from './forms/LoginForm';
// import AdminDashboard from './AdminDashboard/AdminDashboard';
// import UserDashboard from './Dashboard/UserDashboard';
// import SellersDashboard from "./AdminDashboard/Sellers/SellersDashboard";
// import Navbar from "./components/Navbar/Navbar";
// import HomePage from "./components/HomePage/HomePage";

// function App() {
//   return (
//     <div className="App">
//       {/* Navbar always visible */}
//       <Navbar />

//       <Routes>
//         {/* Home page */}
//         <Route path="/" element={<HomePage />} />

//         {/* Dashboard routes */}
//         <Route path="/adminDashboard" element={<AdminDashboard />} />
//         <Route path="/loginform" element={<LoginForm />} />
//         <Route path="/userDashboard" element={<UserDashboard />} />
//         <Route path="/sellersDashboard" element={<SellersDashboard />} />

//         {/* Redirect any unknown route to home */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;





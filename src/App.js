import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import LoginForm from './forms/LoginForm';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import UserDashboard from './Dashboard/UserDashboard';
import SellersDashboard from "./AdminDashboard/Sellers/SellersDashboard";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";

function App() {
  return (
    <div className="App">
      {/* Navbar always visible */}
      <Navbar />

      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Dashboard routes */}
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/loginform" element={<LoginForm />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/sellersDashboard" element={<SellersDashboard />} />

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

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         {/* Login page */}
//         <Route path="/" element={<Navbar />} />

//         {/* Dashboard routes */}
//         <Route path="/adminDashboard" element={<AdminDashboard />} />
//         <Route path="/loginform" element={<LoginForm />} />
//         <Route path="/userDashboard" element={<UserDashboard />} />
//         <Route path="/sellersDashboard" element={<SellersDashboard />} />

//         {/* Redirect any unknown route to login */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;



// import logo from './logo.svg';
// import './App.css';
// import LoginForm from './forms/LoginForm';
// import AdminDashboard from './AdminDashboard/AdminDashboard';
// import UserDashboard from './Dashboard/UserDashboard';


// function App() {
//   return (
//     <div className="App">
//      <LoginForm/>
//      {/* <AdminDashboard /> */}
//      {/* <UserDashboard /> */}
//     </div>
//   );
// }

// export default App;



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

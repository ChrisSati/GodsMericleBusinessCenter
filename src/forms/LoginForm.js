import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";
import loginImage from "./shophands.jpg";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true); // Show loader

  try {
    // Simulate loader for 3 seconds before making login request
    setTimeout(async () => {
      const loginResponse = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: username,
        password: password,
      });

      const { access, refresh } = loginResponse.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      const meResponse = await axios.get("http://127.0.0.1:8000/api/me/");
      const userRole = meResponse.data.role;

      const profileImageUrl = meResponse.data.profile_image
        ? `http://127.0.0.1:8000${meResponse.data.profile_image}`
        : null;

      localStorage.setItem("username", meResponse.data.username);
      localStorage.setItem("profileImage", profileImageUrl);
      localStorage.setItem("role", userRole); // Store role if needed elsewhere

      // Redirect based on role
      switch (userRole) {
        case "ADMIN":
          navigate("/adminDashboard");
          break;
        case "OWNER":
          navigate("/owner-dashboard");
          break;
        case "SELLERS":
          navigate("/sellersDashboard");
          break;
        case "ADVICER":
          navigate("/advicer-dashboard");
          break;
        default:
          navigate("/"); // fallback
          break;
      }

      toast.success("Login successful!", { autoClose: 2000 });
      setLoading(false);
    }, 3000);
  } catch (err) {
    setLoading(false);
    const message =
      err.response?.data?.detail || "Login failed. Check your credentials.";
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      theme: "colored",
      style: { backgroundColor: "#f8d7da", color: "#721c24" },
    });
  }
};

// Loader Screen
  if (loading) {
    return (
      <div className="loader-container">
        {/* <h1 className="loader-title">
          <span className="yellow-text">God's Mericle</span>
          <br />
          <span className="white-text">Business Center</span>
        </h1> */}
        <div className="bounce-loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-image">
        <img src={loginImage} alt="Login" />
      </div>
      <div className="login-form">
        <div className="form-box">
          <div className="form-icon">
            <FaUserTie size={32} />
          </div>
          <div className="form-header">
            <h2>Welcome back</h2>
            <p>Please Login</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={togglePassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUserTie, FaEye, FaEyeSlash } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./LoginForm.css";
// import loginImage from "./shophands.jpg";
// import axios from "axios";

// const LoginForm = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const togglePassword = () => setShowPassword(!showPassword);


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     // 1️⃣ Login to get token
//     const loginResponse = await axios.post("http://127.0.0.1:8000/api/token/", {
//       username: username,
//       password: password,
//     });

//     const { access, refresh } = loginResponse.data;

//     // 2️⃣ Save tokens to localStorage
//     localStorage.setItem("access", access);
//     localStorage.setItem("refresh", refresh);

//     // 3️⃣ Set default Authorization header
//     axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

//     // 4️⃣ Fetch current user info from backend
//     const meResponse = await axios.get("http://127.0.0.1:8000/api/me/");
//     const userRole = meResponse.data.role;

//     // ✅ Fix: build full image URL
//     const profileImageUrl = meResponse.data.profile_image
//       ? `http://127.0.0.1:8000${meResponse.data.profile_image}`
//       : null;

//     // ✅ Store username and profile image in localStorage
//     localStorage.setItem("username", meResponse.data.username);
//     localStorage.setItem("profileImage", profileImageUrl);

//     // 5️⃣ Navigate based on backend role
//     if (userRole === "ADMIN") navigate("/adminDashboard");
//     else if (userRole === "OWNER") navigate("/owner-dashboard");
//     else navigate("/userDashboard");

//     toast.success("Login successful!", { autoClose: 2000 });
//   } catch (err) {
//     const message =
//       err.response?.data?.detail || "Login failed. Check your credentials.";
//     toast.error(message, {
//       position: "top-center",
//       autoClose: 3000,
//       theme: "colored",
//       style: { backgroundColor: "#f8d7da", color: "#721c24" },
//     });
//   }
// };




//   return (
//     <div className="login-container">
//       <div className="login-image">
//         <img src={loginImage} alt="Login" />
//       </div>
//       <div className="login-form">
//         <div className="form-box">
//           <div className="form-icon">
//             <FaUserTie size={32} />
//           </div>
//           <div className="form-header">
//             <h2>Welcome back</h2>
//             <p>Please Login</p>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="form-group password-group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <span className="password-toggle" onClick={togglePassword}>
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//             <div className="forgot-password">
//               <a href="#">Forgot password?</a>
//             </div>
//             <button type="submit" className="login-btn">
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default LoginForm;





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUserTie, FaEye, FaEyeSlash } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./LoginForm.css";
// import loginImage from "./shophands.jpg"; // Replace with your local image
// import { loginUser, setAuthToken} from "../components/Api/Api";

// const LoginForm = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const togglePassword = () => setShowPassword(!showPassword);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = await loginUser(username, password);
//       const token = data.access;
//       const userRole = data.role;

//       localStorage.setItem("access", token);
//       setAuthToken(token);

//       // Navigate based on role
//       if (userRole === "ADMIN") navigate("/admin-dashboard");
//       else if (userRole === "OWNER") navigate("/owner-dashboard");
//       else navigate("/client-dashboard");

//       toast.success("Login successful!", { autoClose: 2000 });
//     } catch (err) {
//       const message = err.detail || "Login failed. Check your credentials.";
//       toast.error(message, {
//         position: "top-center",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "colored", // allows color customization
//         style: { backgroundColor: "#f8d7da", color: "#721c24" }, // light red bg, dark red text
//       });
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-image">
//         <img src={loginImage} alt="Login" />
//       </div>
//       <div className="login-form">
//         <div className="form-box">
//           <div className="form-icon">
//             <FaUserTie size={32} />
//           </div>
//           <div className="form-header">
//             <h2>Welcome back</h2>
//             <p>Login</p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="form-group password-group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <span className="password-toggle" onClick={togglePassword}>
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//             <div className="forgot-password">
//               <a href="#">Forgot password?</a>
//             </div>
//             <button type="submit" className="login-btn">
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default LoginForm;




// import React, { useState } from "react";
// import { FaUserTie, FaEye, FaEyeSlash } from "react-icons/fa";
// import "./LoginForm.css";
// import loginImage from "./shophands.jpg"; // Replace with your local image

// const LoginForm = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePassword = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-image">
//         <img src={loginImage} alt="Login" />
//       </div>
//       <div className="login-form">
//         <div className="form-box">
//           <div className="form-icon">
//             <FaUserTie size={32} />
//           </div>
//           <div className="form-header">
//             <h2>Welcome back</h2>
//             <p>Login</p>
//           </div>
//           <form>
//             <div className="form-group">
//               <input type="text" placeholder="Username" />
//             </div>
//             <div className="form-group password-group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//               />
//               <span className="password-toggle" onClick={togglePassword}>
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//             <div className="forgot-password">
//               <a href="#">Forgot password?</a>
//             </div>
//             <button type="submit" className="login-btn">
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

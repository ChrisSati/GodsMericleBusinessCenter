import { useNavigate } from "react-router-dom";
import axios from "axios";
import {MenuItem} from "@mui/material";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
  const refresh = localStorage.getItem("refresh");

  // Clear tokens immediately
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  try {
    if (refresh) {
      await axios.post(
        "http://127.0.0.1:8000/api/logout/",
        { refresh }, // must match request.data.get("refresh")
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.log("Logout request failed, but user is logged out locally.");
  }

  // Redirect to login
  window.location.href = "/login";
};

  return (
    <div>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </div>
    // <button onClick={handleLogout}>
    //   Logout
    // </button>
  );
};

export default LogoutButton;

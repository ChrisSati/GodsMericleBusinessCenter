import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Avatar, Grid } from "@mui/material";
import backgroundImage from "./dashboard.jpg";
import defaultAvatar from "./avarta.jpg"; 
import Shop from "./ShopsDetails/Shop";



const UserDashboard = () => {
  const [user, setUser] = useState(null);


  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get("http://127.0.0.1:8000/api/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      const fixedUser = {
        ...res.data,
        profile_image: res.data.profile_image
          ? `http://127.0.0.1:8000${res.data.profile_image}`
          : null,
      };

      setUser(fixedUser);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  fetchUser();
}, []);




  return (
    <Box sx={{ width: "100%", fontFamily: "Arial, sans-serif" }}>
      {/* Background Section */}
      <Box
        sx={{
          width: "100%",
          height: { xs: 200, sm: 250, md: 300 },
          position: "relative",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 1,
          },
        }}
      >
        {/* Welcome Text */}
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            color: "#fff",
            zIndex: 2,
            px: 2,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
            }}
          >
            {user ? `Welcome, ${user.username}` : "Loading..."}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
              textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
              mt: 1,
            }}
          >
            {user ? user.role : ""}
          </Typography>
        </Box>

        {/* Profile Image */}
        <Avatar
          src={user?.profile_image || defaultAvatar} // ✅ fallback to local image
          alt={user?.username || "User"}
          sx={{
            width: { xs: 90, sm: 110, md: 120 },
            height: { xs: 90, sm: 110, md: 120 },
            border: "4px solid #2196f3",
            position: "absolute",
            bottom: { xs: -45, sm: -55, md: -60 },
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        />
      </Box>

      {/* Main Content ... (your shop cards remain unchanged) */}
       <Box>
        <Shop/>
       </Box>
    </Box>
  );
};

export default UserDashboard;



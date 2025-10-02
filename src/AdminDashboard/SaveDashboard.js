import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { MdDashboard } from "react-icons/md";
import {
  Dashboard as DashboardIcon,
  DirectionsCar as TransportIcon,
  AttachMoney as LoanIcon,
  Church as ChurchIcon,
  ExpandLess,
  ExpandMore,
  Favorite as OfferingIcon,
  VolunteerActivism as DonationIcon,
  AccountBalance as BudgetIcon,
  Payments as TithesIcon,
  Groups as DuesIcon,
  EventNote as ActivityIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

import UserDashboard from "../Dashboard/UserDashboard";
import DailySalesRecord from "../Dashboard/ShopsDetails/DailySalesRecord";
import Shop from "../Dashboard/Shop";

// Dummy Components
const DailyActivity = () => <Typography p={2}>Daily Activity Page</Typography>;
const Transportation = () => <Typography p={2}>Transportation Page</Typography>;
const Loan = () => <Typography p={2}>Loan Page</Typography>;
const Offering = () => <Typography p={2}>Offering Page</Typography>;
const Tithes = () => <Typography p={2}>Tithes Page</Typography>;
const Dues = () => <Typography p={2}>Dues Page</Typography>;
const Donation = () => <Typography p={2}>Donation Page</Typography>;
const Budget = () => <Typography p={2}>Budget Page</Typography>;

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("admindashboard");
  const [churchOpen, setChurchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const isMobile = useMediaQuery("(max-width:900px)");

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

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

  const sidebarItems = [
    { label: "Dashboard", icon: <MdDashboard />, key: "userdashboard" },
    { label: "Daily Sales", icon: <ActivityIcon />, key: "dailysales" },
    { label: "Transportation", icon: <TransportIcon />, key: "transportation" },
    { label: "Loan", icon: <LoanIcon />, key: "loan" },
  ];

  const churchItems = [
    { label: "Financial Records", icon: <OfferingIcon />, key: "offering" },
    // { label: "Tithes", icon: <TithesIcon />, key: "tithes" },
    { label: "Dues", icon: <DuesIcon />, key: "dues" },
    { label: "Donation", icon: <DonationIcon />, key: "donation" },
    { label: "Budget", icon: <BudgetIcon />, key: "budget" },
  ];

  const drawerContent = (
    <Box>
      <Toolbar />
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              onClick={() => {
                setActiveComponent(item.key);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{ "&:hover": { backgroundColor: "#9AAEDB" } }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItemButton
          onClick={() => setChurchOpen(!churchOpen)}
          sx={{ "&:hover": { backgroundColor: "#9AAEDB" } }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <ChurchIcon />
          </ListItemIcon>
          <ListItemText primary="Church Record" />
          {churchOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={churchOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* RIBA static item at the top */}
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  backgroundColor: "black",
                  "&:hover": { backgroundColor: "#222222" },
                }}
              >
                <ListItemIcon sx={{ color: "yellow" }}>
                  <ChurchIcon />
                </ListItemIcon>
                <ListItemText primary="RIBA" sx={{ color: "yellow" }} />
              </ListItemButton>
            </ListItem>

            {/* Original church items before Budget */}
            {churchItems
              .filter(item => item.key !== "budget")
              .map((item) => (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveComponent(item.key);
                      if (isMobile) setMobileOpen(false);
                    }}
                    sx={{
                      pl: 4,
                      backgroundColor: "#003559",
                      "&:hover": { backgroundColor: "#335F85" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}

            {/* Budget item */}
            {churchItems
              .filter(item => item.key === "budget")
              .map((item) => (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setActiveComponent(item.key);
                      if (isMobile) setMobileOpen(false);
                    }}
                    sx={{
                      pl: 4,
                      backgroundColor: "#003559",
                      "&:hover": { backgroundColor: "#335F85" },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}

            {/* CFA static item below Budget */}
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  backgroundColor: "black",
                  "&:hover": { backgroundColor: "#222222" },
                }}
              >
                <ListItemIcon sx={{ color: "yellow" }}>
                  <ChurchIcon />
                </ListItemIcon>
                <ListItemText primary="CFA" sx={{ color: "yellow" }} />
              </ListItemButton>
            </ListItem>

            {/* Additional items below CFA */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveComponent("churchpt");
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  pl: 4,
                  backgroundColor: "#003559",
                  "&:hover": { backgroundColor: "#335F85" },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>
                  <ChurchIcon />
                </ListItemIcon>
                <ListItemText primary="Church PT" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveComponent("childrenministry");
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  pl: 4,
                  backgroundColor: "#003559",
                  "&:hover": { backgroundColor: "#335F85" },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>
                  <ChurchIcon />
                </ListItemIcon>
                <ListItemText primary="Children Ministry" />
              </ListItemButton>
            </ListItem>

          </List>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, background: "#3a3d3dff" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Pacifico", Arial, sans-serif',
              fontSize: "12px",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>God's </span>
            <span style={{ color: "#ADD8E6" }}>Mericle </span>
            <span style={{ color: "#FFFF00" }}>Business </span>
            <span style={{ color: "#FFFFFF" }}>Center</span>
          </Typography>

          <Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar src={user?.profile_image} alt="Profile" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: 250 }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: 250,
              boxSizing: "border-box",
              backgroundColor: "#809BCE",
              color: "white",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 250px)` },
          mt: 8,
        }}
      >
        {activeComponent === "userdashboard" && <UserDashboard />}
        {activeComponent === "shops" && <DailySalesRecord />}
        {activeComponent === "dailysales" && <DailySalesRecord />}
        {activeComponent === "transportation" && <Transportation />}
        {activeComponent === "loan" && <Loan />}
        {activeComponent === "offering" && <Offering />}
        {activeComponent === "tithes" && <Tithes />}
        {activeComponent === "dues" && <Dues />}
        {activeComponent === "donation" && <Donation />}
        {activeComponent === "budget" && <Budget />}
        {activeComponent === "admindashboard" && (
          <Typography variant="h5">
            <UserDashboard />
          </Typography>
        )}
        {activeComponent === "churchpt" && (
          <Typography p={2}>Church PT Page</Typography>
        )}
        {activeComponent === "childrenministry" && (
          <Typography p={2}>Children Ministry Page</Typography>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;




// import React, { useState } from "react";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   AppBar,
//   Toolbar,
//   Avatar,
//   Menu,
//   MenuItem,
//   Typography,
//   Box,
//   IconButton,
//   useMediaQuery,
// } from "@mui/material";
// import {
//   Dashboard as DashboardIcon,
//   DirectionsCar as TransportIcon,
//   AttachMoney as LoanIcon,
//   Church as ChurchIcon,
//   ExpandLess,
//   ExpandMore,
//   Favorite as OfferingIcon,
//   VolunteerActivism as DonationIcon,
//   AccountBalance as BudgetIcon,
//   Payments as TithesIcon,
//   Groups as DuesIcon,
//   EventNote as ActivityIcon,
//   Menu as MenuIcon,
// } from "@mui/icons-material";

// // Dummy Components
// const DailyActivity = () => <Typography p={2}>Daily Activity Page</Typography>;
// const Transportation = () => <Typography p={2}>Transportation Page</Typography>;
// const Loan = () => <Typography p={2}>Loan Page</Typography>;
// const Offering = () => <Typography p={2}>Offering Page</Typography>;
// const Tithes = () => <Typography p={2}>Tithes Page</Typography>;
// const Dues = () => <Typography p={2}>Dues Page</Typography>;
// const Donation = () => <Typography p={2}>Donation Page</Typography>;
// const Budget = () => <Typography p={2}>Budget Page</Typography>;

// const AdminDashboard = () => {
//   const [activeComponent, setActiveComponent] = useState("admindashboard");
//   const [churchOpen, setChurchOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const isMobile = useMediaQuery("(max-width:900px)");

//   const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);
//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

//   const sidebarItems = [
//     { label: "Daily Activity", icon: <ActivityIcon />, key: "dailyactivity" },
//     { label: "Transportation", icon: <TransportIcon />, key: "transportation" },
//     { label: "Loan", icon: <LoanIcon />, key: "loan" },
//   ];

//   const churchItems = [
//     { label: "Offering", icon: <OfferingIcon />, key: "offering" },
//     { label: "Tithes", icon: <TithesIcon />, key: "tithes" },
//     { label: "Dues", icon: <DuesIcon />, key: "dues" },
//     { label: "Donation", icon: <DonationIcon />, key: "donation" },
//     { label: "Budget", icon: <BudgetIcon />, key: "budget" },
//   ];

//   const drawerContent = (
//     <Box>
//       <Toolbar />
//       <List>
//         {sidebarItems.map((item) => (
//           <ListItem key={item.key} disablePadding>
//             <ListItemButton
//               onClick={() => {
//                 setActiveComponent(item.key);
//                 if (isMobile) setMobileOpen(false);
//               }}
//               sx={{ "&:hover": { backgroundColor: "#9AAEDB" } }}
//             >
//               <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.label} />
//             </ListItemButton>
//           </ListItem>
//         ))}

//         <ListItemButton
//           onClick={() => setChurchOpen(!churchOpen)}
//           sx={{ "&:hover": { backgroundColor: "#9AAEDB" } }}
//         >
//           <ListItemIcon sx={{ color: "white" }}>
//             <ChurchIcon />
//           </ListItemIcon>
//           <ListItemText primary="Church Record" />
//           {churchOpen ? <ExpandLess /> : <ExpandMore />}
//         </ListItemButton>

//         <Collapse in={churchOpen} timeout="auto" unmountOnExit>
//           <List component="div" disablePadding>
//             {churchItems.map((item) => (
//               <ListItem key={item.key} disablePadding>
//                 <ListItemButton
//                   onClick={() => {
//                     setActiveComponent(item.key);
//                     if (isMobile) setMobileOpen(false);
//                   }}
//                   sx={{
//                     pl: 4,
//                     backgroundColor: "#003559",
//                     "&:hover": { backgroundColor: "#335F85" },
//                   }}
//                 >
//                   <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
//                   <ListItemText primary={item.label} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </Collapse>
//       </List>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* AppBar */}
//       <AppBar position="fixed" sx={{ zIndex: 1201, background: "#3a3d3dff" }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           {isMobile && (
//             <IconButton
//               color="inherit"
//               edge="start"
//               onClick={handleDrawerToggle}
//               sx={{ mr: 2 }}
//             >
//               <MenuIcon />
//             </IconButton>
//           )}
//           <Typography variant="h6">Admin Dashboard</Typography>
//           <Box>
//             <IconButton onClick={handleMenuOpen}>
//               <Avatar src="/profile.jpg" alt="Profile" />
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//             >
//               <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
//             </Menu>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Drawer */}
//       <Box
//         component="nav"
//         sx={{ width: { sm: 250 }, flexShrink: { sm: 0 } }}
//         aria-label="sidebar"
//       >
//         <Drawer
//           variant={isMobile ? "temporary" : "permanent"}
//           open={isMobile ? mobileOpen : true}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             [`& .MuiDrawer-paper`]: {
//               width: 250,
//               boxSizing: "border-box",
//               backgroundColor: "#809BCE",
//               color: "white",
//             },
//           }}
//         >
//           {drawerContent}
//         </Drawer>
//       </Box>

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - 250px)` },
//           mt: 8,
//         }}
//       >
//         {activeComponent === "dailyactivity" && <DailyActivity />}
//         {activeComponent === "transportation" && <Transportation />}
//         {activeComponent === "loan" && <Loan />}
//         {activeComponent === "offering" && <Offering />}
//         {activeComponent === "tithes" && <Tithes />}
//         {activeComponent === "dues" && <Dues />}
//         {activeComponent === "donation" && <Donation />}
//         {activeComponent === "budget" && <Budget />}
//         {activeComponent === "admindashboard" && (
//           <Typography variant="h5">Welcome to Admin Dashboard</Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default AdminDashboard;





// import React, { useState } from "react";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   AppBar,
//   Toolbar,
//   Avatar,
//   Menu,
//   MenuItem,
//   Typography,
//   Box,
//   IconButton,
// } from "@mui/material";
// import {
//   Dashboard as DashboardIcon,
//   DirectionsCar as TransportIcon,
//   AttachMoney as LoanIcon,
//   Church as ChurchIcon,
//   ExpandLess,
//   ExpandMore,
//   Favorite as OfferingIcon,
//   VolunteerActivism as DonationIcon,
//   AccountBalance as BudgetIcon,
//   Payments as TithesIcon,
//   Groups as DuesIcon,
//   EventNote as ActivityIcon,
// } from "@mui/icons-material";

// // Dummy Components (replace with real ones)
// const DailyActivity = () => <Typography p={2}>Daily Activity Page</Typography>;
// const Transportation = () => <Typography p={2}>Transportation Page</Typography>;
// const Loan = () => <Typography p={2}>Loan Page</Typography>;
// const Offering = () => <Typography p={2}>Offering Page</Typography>;
// const Tithes = () => <Typography p={2}>Tithes Page</Typography>;
// const Dues = () => <Typography p={2}>Dues Page</Typography>;
// const Donation = () => <Typography p={2}>Donation Page</Typography>;
// const Budget = () => <Typography p={2}>Budget Page</Typography>;

// const AdminDashboard = () => {
//   const [activeComponent, setActiveComponent] = useState("admindashboard");
//   const [churchOpen, setChurchOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const sidebarItems = [
//     {
//       label: "Daily Activity",
//       icon: <ActivityIcon />,
//       key: "dailyactivity",
//     },
//     {
//       label: "Transportation",
//       icon: <TransportIcon />,
//       key: "transportation",
//     },
//     {
//       label: "Loan",
//       icon: <LoanIcon />,
//       key: "loan",
//     },
//   ];

//   const churchItems = [
//     { label: "Offering", icon: <OfferingIcon />, key: "offering" },
//     { label: "Tithes", icon: <TithesIcon />, key: "tithes" },
//     { label: "Dues", icon: <DuesIcon />, key: "dues" },
//     { label: "Donation", icon: <DonationIcon />, key: "donation" },
//     { label: "Budget", icon: <BudgetIcon />, key: "budget" },
//   ];

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Topbar */}
//       <AppBar position="fixed" sx={{ zIndex: 1201, background: "#3a3d3dff" }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography variant="h6">Admin Dashboard</Typography>
//           <Box>
//             <IconButton onClick={handleMenuOpen}>
//               <Avatar src="/profile.jpg" alt="Profile" />
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//             >
//               <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
//             </Menu>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: 250,
//           flexShrink: 0,
//           [`& .MuiDrawer-paper`]: {
//             width: 250,
//             boxSizing: "border-box",
//             backgroundColor: "#809BCE",
//             color: "white",
//           },
//         }}
//       >
//         <Toolbar />
//         <List>
//           {sidebarItems.map((item) => (
//             <ListItem key={item.key} disablePadding>
//               <ListItemButton
//                 onClick={() => setActiveComponent(item.key)}
//                 sx={{
//                   "&:hover": { backgroundColor: "#9AAEDB" },
//                 }}
//               >
//                 <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.label} />
//               </ListItemButton>
//             </ListItem>
//           ))}

//           {/* Church Record Dropdown */}
//           <ListItemButton
//             onClick={() => setChurchOpen(!churchOpen)}
//             sx={{ "&:hover": { backgroundColor: "#9AAEDB" } }}
//           >
//             <ListItemIcon sx={{ color: "white" }}>
//               <ChurchIcon />
//             </ListItemIcon>
//             <ListItemText primary="Church Record" />
//             {churchOpen ? <ExpandLess /> : <ExpandMore />}
//           </ListItemButton>

//           <Collapse in={churchOpen} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {churchItems.map((item) => (
//                 <ListItem key={item.key} disablePadding>
//                   <ListItemButton
//                     onClick={() => setActiveComponent(item.key)}
//                     sx={{
//                       pl: 4,
//                       backgroundColor: "#003559",
//                       "&:hover": { backgroundColor: "#335F85" },
//                     }}
//                   >
//                     <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
//                     <ListItemText primary={item.label} />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//             </List>
//           </Collapse>
//         </List>
//       </Drawer>

//       {/* Main Content */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <Toolbar />
//         {activeComponent === "dailyactivity" && <DailyActivity />}
//         {activeComponent === "transportation" && <Transportation />}
//         {activeComponent === "loan" && <Loan />}
//         {activeComponent === "offering" && <Offering />}
//         {activeComponent === "tithes" && <Tithes />}
//         {activeComponent === "dues" && <Dues />}
//         {activeComponent === "donation" && <Donation />}
//         {activeComponent === "budget" && <Budget />}

//         {activeComponent === "admindashboard" && (
//           <Typography variant="h5">Welcome to Admin Dashboard</Typography>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default AdminDashboard;

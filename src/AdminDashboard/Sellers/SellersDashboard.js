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


import UserDashboard from "../../Dashboard/UserDashboard";
import LogoutButton from "../LogoutButton";
import Items from "./Items";

const SellersDashboard = () => {
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
    { label: "Sales Items", icon: <MdDashboard />, key: "items" },
    { label: "Expenditure", icon: <LoanIcon />, key: "expenditure" },
  ];

  const myItems = [
    { label: "Financial Records", icon: <OfferingIcon />, key: "financialrecord" },
    { label: "Budget", icon: <BudgetIcon />, key: "budget" },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { background: "#333333" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#555555", borderRadius: "10px" },
        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "yellow" },
        scrollbarWidth: "thin",
        scrollbarColor: "yellow #333333",
      }}
    >
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
          <ListItemText primary="My Sales" />
          {churchOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={churchOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* RIBA static item */}
            <ListItem disablePadding>
              <ListItemButton sx={{ pl: 4, backgroundColor: "black", "&:hover": { backgroundColor: "#222222" } }}>
                <ListItemIcon sx={{ color: "yellow" }}>
                  <ChurchIcon />
                </ListItemIcon>
                <ListItemText primary="Income" sx={{ color: "yellow" }} />
              </ListItemButton>
            </ListItem>

            {myItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setActiveComponent(item.key);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{ pl: 4, backgroundColor: "#003559", "&:hover": { backgroundColor: "#335F85" } }}
                >
                  <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}

            {/* CFA static item */}
            <ListItem disablePadding>
              <ListItemButton sx={{ pl: 4, backgroundColor: "black", "&:hover": { backgroundColor: "#222222" } }}>
                <ListItemIcon sx={{ color: "yellow" }}>
                  <ChurchIcon />
                </ListItemIcon>
                <ListItemText primary="Expenditure" sx={{ color: "yellow" }} />
              </ListItemButton>
            </ListItem>

            {/* Additional church items */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setActiveComponent("churchpt");
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{ pl: 4, backgroundColor: "#003559", "&:hover": { backgroundColor: "#335F85" } }}
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
                sx={{ pl: 4, backgroundColor: "#003559", "&:hover": { backgroundColor: "#335F85" } }}
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
      <AppBar position="fixed" sx={{ zIndex: 1201, background: "#2d5f5fff" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="caption" sx={{ fontFamily: '"Pacifico", Arial, sans-serif', fontSize: "12px" }}>
            <span style={{ color: "#FFFFFF" }}>Seller Dashboard</span>
            {/* <span style={{ color: "#ADD8E6" }}>Mericle </span> */}
            <span style={{ color: "#FFFF00" }}>Business </span>
            {/* <span style={{ color: "#FFFFFF" }}>Center</span> */}
          </Typography>

          <Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar src={user?.profile_image} alt="Profile" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}><LogoutButton/></MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box component="nav" sx={{ width: { sm: 250 }, flexShrink: { sm: 0 } }} aria-label="sidebar">
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 250px)` }, mt: 8 }}>
        {activeComponent === "userdashboard" && <UserDashboard />}
        {activeComponent === "items" && <Items />}
        {activeComponent === "admindashboard" && <UserDashboard />}
        {activeComponent === "churchpt" && <Typography p={2}>Church PT Page</Typography>}
        {activeComponent === "childrenministry" && <Typography p={2}>Children Ministry Page</Typography>}
      </Box>
    </Box>
  );
};

export default SellersDashboard;

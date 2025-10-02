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
// import DailySalesRecord from "../Dashboard/ShopsDetails/DailySalesRecord";
import Shop from "../Dashboard/ShopsDetails/Shop";
import ShopInfo from "../Dashboard/ShopsDetails/ShopInfo";
import Transportation from "../Transportation/Transportation";
import Expenditure from "../Expenditure/Expenditure";
import LeasePaymentPage from "../Lease/LeasePaymentPage";
import LeasePage from "../Lease/LeasePage";
import ShopDataAnalysic from "../ShopDataAnalysic/ShopDataAnalysic";
import FinancialRecord from "../Transportation/FinancialRecord/FinancialRecord";
import Budget from "../Budget/Budget";
import UserForm from "./UserForm/UserForm";
import LogoutButton from "./LogoutButton";
import Items from "./Sellers/Items";

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
    { label: "Roles", icon: <MdDashboard />, key: "userform" },
    { label: "Shop Analysics", icon: <MdDashboard />, key: "shopdataanalysic" }, 
    { label: "Sellers Sales", icon: <MdDashboard />, key: "items" }, 
    // { label: "Daily Sales", icon: <ActivityIcon />, key: "dailysales" },
    { label: "Shop", icon: <ActivityIcon />, key: "shopinfo" },
    { label: "Transportation", icon: <TransportIcon />, key: "transportation" },
    { label: "Lease", icon: <LoanIcon />, key: "leasepage" },
    { label: "LAP", icon: <LoanIcon />, key: "leasepaymentpage" },
    { label: "Expenditure", icon: <LoanIcon />, key: "expenditure" },
  ];

  const churchItems = [
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
          <ListItemText primary="Church Record" />
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
                <ListItemText primary="Church Record" sx={{ color: "yellow" }} />
              </ListItemButton>
            </ListItem>

            {churchItems.map((item) => (
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
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="caption" sx={{ fontFamily: '"Pacifico", Arial, sans-serif', fontSize: "12px" }}>
            <span style={{ color: "#FFFFFF" }}>Admin </span>
            {/* <span style={{ color: "#ADD8E6" }}>Mericle </span> */}
            <span style={{ color: "#FFFF00" }}>Dashboard</span>
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
        {activeComponent === "userform" && <UserForm />}
        {activeComponent === "shops" && <Shop />}
        {/* {activeComponent === "dailysales" && <DailySalesRecord />} */}
        {activeComponent === "shopinfo" && <ShopInfo />}
        {activeComponent === "items" && <Items />}
        {activeComponent === "transportation" && <Transportation />}
        {activeComponent === "expenditure" && <Expenditure />}
        {activeComponent === "leasepage" && <LeasePage />}
        {activeComponent === "leasepaymentpage" && <LeasePaymentPage />}
        {activeComponent === "financialrecord" && <FinancialRecord />}
        {activeComponent === "budget" && <Budget />}
        {activeComponent === "shopdataanalysic" && <ShopDataAnalysic />}
        {activeComponent === "admindashboard" && <UserDashboard />}
    </Box>
    </Box>
  );
};

export default AdminDashboard;


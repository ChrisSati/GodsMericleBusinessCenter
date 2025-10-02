


import React, { useState } from "react";
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
} from "@mui/material";
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
} from "@mui/icons-material";

// Dummy Components (replace with real ones)
const DailyActivity = () => <Typography p={2}>Daily Activity Page</Typography>;
const Transportation = () => <Typography p={2}>Transportation Page</Typography>;
const Loan = () => <Typography p={2}>Loan Page</Typography>;
const Offering = () => <Typography p={2}>Offering Page</Typography>;
const Tithes = () => <Typography p={2}>Tithes Page</Typography>;
const Dues = () => <Typography p={2}>Dues Page</Typography>;
const Donation = () => <Typography p={2}>Donation Page</Typography>;
const Budget = () => <Typography p={2}>Budget Page</Typography>;

const ClientDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("admindashboard");
  const [churchOpen, setChurchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const sidebarItems = [
    {
      label: "Daily Activity",
      icon: <ActivityIcon />,
      key: "dailyactivity",
    },
    {
      label: "Transportation",
      icon: <TransportIcon />,
      key: "transportation",
    },
    {
      label: "Loan",
      icon: <LoanIcon />,
      key: "loan",
    },
  ];

  const churchItems = [
    { label: "Offering", icon: <OfferingIcon />, key: "offering" },
    { label: "Tithes", icon: <TithesIcon />, key: "tithes" },
    { label: "Dues", icon: <DuesIcon />, key: "dues" },
    { label: "Donation", icon: <DonationIcon />, key: "donation" },
    { label: "Budget", icon: <BudgetIcon />, key: "budget" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Topbar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, background: "#3a3d3dff" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Admin Dashboard</Typography>
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar src="/profile.jpg" alt="Profile" />
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

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 250,
            boxSizing: "border-box",
            backgroundColor: "#809BCE",
            color: "white",
          },
        }}
      >
        <Toolbar />
        <List>
          {sidebarItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                onClick={() => setActiveComponent(item.key)}
                sx={{
                  "&:hover": { backgroundColor: "#9AAEDB" },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Church Record Dropdown */}
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
              {churchItems.map((item) => (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    onClick={() => setActiveComponent(item.key)}
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
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {activeComponent === "dailyactivity" && <DailyActivity />}
        {activeComponent === "transportation" && <Transportation />}
        {activeComponent === "loan" && <Loan />}
        {activeComponent === "offering" && <Offering />}
        {activeComponent === "tithes" && <Tithes />}
        {activeComponent === "dues" && <Dues />}
        {activeComponent === "donation" && <Donation />}
        {activeComponent === "budget" && <Budget />}

        {activeComponent === "admindashboard" && (
          <Typography variant="h5">Welcome to Admin Dashboard</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ClientDashboard;

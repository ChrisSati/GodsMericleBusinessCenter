// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const API_BASE = "http://127.0.0.1:8000/api"; // replace with your backend base

const endpoints = [
  { key: "dailyActivities", label: "Daily Activities", url: "/daily-activities/" },
  { key: "transportations", label: "Transportations", url: "/transportations/" },
  { key: "leasePayments", label: "Lease Payments", url: "/lease-payments/" },
  { key: "churchRecords", label: "Church Records", url: "/church-records/" },
  { key: "dailySales", label: "Daily Sales", url: "/daily-sales-records/" },
  { key: "churchBranches", label: "Church Branches", url: "/church-branches/" },
];

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});

  const fetchData = async (endpoint) => {
    setLoading((prev) => ({ ...prev, [endpoint.key]: true }));
    try {
      const token = localStorage.getItem("access"); // JWT access token
      const res = await axios.get(`${API_BASE}${endpoint.url}?year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prev) => ({ ...prev, [endpoint.key]: res.data }));
    } catch (err) {
      console.error(`Error fetching ${endpoint.label}:`, err);
    } finally {
      setLoading((prev) => ({ ...prev, [endpoint.key]: false }));
    }
  };

  useEffect(() => {
    endpoints.forEach((endpoint) => fetchData(endpoint));
  }, [year]);

  const renderTable = (endpoint) => {
    if (loading[endpoint.key]) return <CircularProgress />;

    const records = data[endpoint.key] || [];
    if (!records.length) return <Typography>No records found.</Typography>;

    const headers = Object.keys(records[0]).filter((key) => key !== "id");

    return (
      <TableContainer component={Paper} sx={{ mt: 1, mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>
                  {header.replace(/_/g, " ").toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row) => (
              <TableRow key={row.id}>
                {headers.map((header) => (
                  <TableCell key={header}>
                    {row[header] !== null ? row[header].toString() : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Year Selector */}
      <FormControl sx={{ mb: 4, minWidth: 120 }}>
        <InputLabel>Year</InputLabel>
        <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
          {Array.from({ length: 5 }, (_, i) => currentYear - i).map((yr) => (
            <MenuItem key={yr} value={yr}>
              {yr}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {endpoints.map((endpoint) => (
          <Grid item xs={12} md={6} key={endpoint.key}>
            <Typography variant="h6">{endpoint.label}</Typography>
            {renderTable(endpoint)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;

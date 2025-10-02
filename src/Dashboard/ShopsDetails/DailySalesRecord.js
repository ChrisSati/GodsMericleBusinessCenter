import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  IconButton,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import ShopInput from "./ShopInput";

export default function DailySalesRecord() {
  const [records, setRecords] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("access");

  // Fetch shops
  const fetchShops = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/shops/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShops(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch daily sales records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/daily-sales/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchRecords();
  }, []);

  // Add or Edit record
  const handleAddOrEdit = async (data, recordId = null) => {
    try {
      if (recordId) {
        await axios.put(
          `http://127.0.0.1:8000/api/daily-sales/${recordId}/`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Success", "Record updated successfully!", "success");
      } else {
        await axios.post("http://127.0.0.1:8000/api/daily-sales/", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Success", "Record added successfully!", "success");
      }
      fetchRecords();
      setOpenPopup(false);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error.response?.data?.detail || "Something went wrong!",
        "error"
      );
    }
  };

  // Delete record
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/daily-sales/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchRecords();
        Swal.fire("Deleted!", "Record has been deleted.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to delete record.", "error");
      }
    }
  };

  const filteredRecords = records.filter((r) =>
    r.shop_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Box sx={{ mt: 5, px: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          placeholder="Search by shop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton
          color="primary"
          onClick={() => {
            setEditingRecord(null);
            setOpenPopup(true);
          }}
        >
          <Add />
        </IconButton>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
            <TableRow>
              {["Shop", "Date", "Total Sales", "Items Sold", "Notes", "Actions"].map(
                (h) => (
                  <TableCell key={h} sx={{ color: "#fff", fontWeight: "bold" }}>
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((r) => (
              <TableRow key={r.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell>{r.shop_name}</TableCell>
                <TableCell>{r.sales_date}</TableCell>
                <TableCell>${parseFloat(r.total_sales).toLocaleString()}</TableCell>
                <TableCell>{r.total_items_sold}</TableCell>
                <TableCell>{r.notes}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => { setEditingRecord(r); setOpenPopup(true); }}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(r.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ShopInput
        open={openPopup}
        handleClose={() => setOpenPopup(false)}
        shops={shops}
        onSubmit={handleAddOrEdit}
        editingRecord={editingRecord}
      />
    </Box>
  );
}




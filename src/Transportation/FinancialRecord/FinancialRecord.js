import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function FinancialRecord() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    record_type: "",
    category: "",
    amount: "",
    description: "",
  });
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const RECORD_TYPES = [
    { value: "INCOME", label: "Income" },
    { value: "EXPENSE", label: "Expense" },
  ];

  const CATEGORY_CHOICES = [
    { value: "OFFERING", label: "Offering" },
    { value: "TITHE", label: "Tithe" },
    { value: "DONATION", label: "Donation" },
    { value: "DUE", label: "Due" },
    { value: "PROJECT", label: "Project" },
    { value: "SALARY", label: "Salary" },
    { value: "UTILITY", label: "Utility" },
    { value: "OTHER", label: "Other" },
  ];

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/financial-records/");
      setRecords(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingRecord) {
        const res = await axios.put(
          `http://127.0.0.1:8000/api/financial-records/${editingRecord.id}/`,
          form
        );
        setRecords(records.map((rec) => (rec.id === editingRecord.id ? res.data : rec)));
        Swal.fire("Updated!", "Financial record updated successfully", "success");
      } else {
        const res = await axios.post("http://127.0.0.1:8000/api/financial-records/", form);
        setRecords([res.data, ...records]);
        Swal.fire("Added!", "Financial record added successfully", "success");
      }
      setOpen(false);
      setForm({ record_type: "", category: "", amount: "", description: "" });
      setEditingRecord(null);
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the record permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/financial-records/${id}/`);
          setRecords(records.filter((rec) => rec.id !== id));
          Swal.fire("Deleted!", "Financial record deleted successfully", "success");
        } catch (error) {
          Swal.fire("Error", "Something went wrong", "error");
        }
      }
    });
  };

  const handleEdit = (record) => {
    setForm(record);
    setEditingRecord(record);
    setOpen(true);
  };

  const filteredRecords = records.filter(
    (rec) =>
      rec.record_type.toLowerCase().includes(search.toLowerCase()) ||
      rec.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      <h2>Church Financial Records</h2>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search by Type or Category"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Fab color="primary" onClick={() => setOpen(true)}>
          <Add />
        </Fab>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rec) => (
                  <TableRow key={rec.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                    <TableCell>{rec.record_type}</TableCell>
                    <TableCell>{rec.category}</TableCell>
                    <TableCell>${rec.amount}</TableCell>
                    <TableCell>{rec.description}</TableCell>
                    <TableCell>{rec.date}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(rec)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(rec.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredRecords.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      )}

      {/* Bar Chart */}
      <Box mt={5} height={400}>
        <ResponsiveContainer>
          <BarChart data={records}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Popup Form */}
      <Dialog open={open}>
        <DialogTitle>{editingRecord ? "Edit Record" : "Add Record"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Record Type</InputLabel>
            <Select
              value={form.record_type}
              onChange={(e) => setForm({ ...form, record_type: e.target.value })}
            >
              {RECORD_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORY_CHOICES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            label="Amount"
            type="number"
            fullWidth
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <TextField
            margin="normal"
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : editingRecord ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  TablePagination,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";

export default function Transportation() {
  const [transportations, setTransportations] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    person: "",
    person_number: "",
    route_from: "",
    route_to: "",
    transport_date: "",
    cost: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchTransportations = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/transportations/");
      setTransportations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransportations();
  }, []);

  const handleOpen = () => {
    setForm({
      person: "",
      person_number: "",
      route_from: "",
      route_to: "",
      transport_date: "",
      cost: "",
      notes: "",
    });
    setEditingId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        if (editingId) {
          await axios.put(
            `http://127.0.0.1:8000/api/transportations/${editingId}/`,
            form
          );
          Swal.fire("Updated!", "Transportation updated successfully", "success");
        } else {
          await axios.post("http://127.0.0.1:8000/api/transportations/", form);
          Swal.fire("Added!", "Transportation added successfully", "success");
        }
        fetchTransportations();
        setOpen(false);
      } catch (error) {
        Swal.fire("Error!", "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const handleEdit = (data) => {
    setForm({
      person: data.person,
      person_number: data.person_number,
      route_from: data.route_from,
      route_to: data.route_to,
      transport_date: data.transport_date,
      cost: data.cost,
      notes: data.notes,
    });
    setEditingId(data.id);
    setOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/transportations/${id}/`);
          Swal.fire("Deleted!", "Transportation has been deleted.", "success");
          fetchTransportations();
        } catch (error) {
          Swal.fire("Error!", "Something went wrong", "error");
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtered transportations by search
  const filteredTransportations = transportations.filter((t) =>
    t.person.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Transportation</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Transportation
        </Button>
      </Box>

      <TextField
        label="Search by person"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
  <TableRow>
    <TableCell sx={{ backgroundColor: "#424242", color: "#fff", fontWeight: "bold" }}>Person</TableCell>
    <TableCell sx={{ backgroundColor: "#424242", color: "#fff", fontWeight: "bold" }}>Number</TableCell>
    <TableCell sx={{ backgroundColor: "#424242", color: "#fff", fontWeight: "bold" }}>From</TableCell>
    <TableCell sx={{ backgroundColor: "#424242", color: "#fff", fontWeight: "bold" }}>To</TableCell>
    <TableCell sx={{ backgroundColor: "#424242", color: "#fff", fontWeight: "bold" }}>Date</TableCell>
    <TableCell sx={{ backgroundColor: "#424242", color: "#fff", fontWeight: "bold" }}>Cost</TableCell>
    <TableCell sx={{ backgroundColor: "#424242", color: "#fff", fontWeight: "bold" }}>Notes</TableCell>
    <TableCell sx={{ backgroundColor: "#424242", color: "#fff", fontWeight: "bold" }} align="center">
      Actions
    </TableCell>
  </TableRow>
</TableHead>
          <TableBody>
            {filteredTransportations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((t) => (
                <TableRow key={t.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell>{t.person}</TableCell>
                  <TableCell>{t.person_number}</TableCell>
                  <TableCell>{t.route_from}</TableCell>
                  <TableCell>{t.route_to}</TableCell>
                  <TableCell>{t.transport_date}</TableCell>
                  <TableCell>${parseFloat(t.cost).toFixed(2)}</TableCell>
                  <TableCell>{t.notes}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(t)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(t.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredTransportations.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog */}
      <Dialog open={open} onClose={() => {}} disableEscapeKeyDown>
        <DialogTitle>
          {editingId ? "Edit Transportation" : "Add Transportation"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Person"
            name="person"
            fullWidth
            value={form.person}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Person Number"
            name="person_number"
            fullWidth
            value={form.person_number}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Route From"
            name="route_from"
            fullWidth
            value={form.route_from}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Route To"
            name="route_to"
            fullWidth
            value={form.route_to}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Transport Date"
            name="transport_date"
            type="date"
            fullWidth
            value={form.transport_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Cost"
            name="cost"
            type="number"
            fullWidth
            value={form.cost}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            fullWidth
            multiline
            rows={2}
            value={form.notes}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

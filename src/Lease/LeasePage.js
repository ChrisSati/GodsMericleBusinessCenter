import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

export default function LeasePage() {
  const [leases, setLeases] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState(""); // Search by shop name
  const [form, setForm] = useState({
    shop: "",
    landlord_name: "",
    lease_start: "",
    lease_end: "",
    monthly_rent: "",
    notes: "",
    year: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch leases
  const fetchLeases = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/leases/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setLeases(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch leases", "error");
    }
  };

  // Fetch shops
  const fetchShops = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/shops/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setShops(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch shops", "error");
    }
  };

  useEffect(() => {
    fetchLeases();
    fetchShops();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lease_start") {
      const yearVal = new Date(value).getFullYear();
      setForm({ ...form, [name]: value, year: yearVal });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        if (editing) {
          await axios.put(
            `http://127.0.0.1:8000/api/leases/${editing.id}/`,
            form,
            { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
          );
          Swal.fire("Success", "Lease updated!", "success");
        } else {
          await axios.post(
            "http://127.0.0.1:8000/api/leases/",
            form,
            { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
          );
          Swal.fire("Success", "Lease created!", "success");
        }
        setForm({
          shop: "",
          landlord_name: "",
          lease_start: "",
          lease_end: "",
          monthly_rent: "",
          notes: "",
          year: "",
        });
        setEditing(null);
        setOpen(false);
        fetchLeases();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to save lease", "error");
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const handleEdit = (lease) => {
    setEditing(lease);
    setForm({
      shop: lease.shop,
      landlord_name: lease.landlord_name,
      lease_start: lease.lease_start,
      lease_end: lease.lease_end,
      monthly_rent: lease.monthly_rent,
      notes: lease.notes,
      year: lease.year,
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/leases/${id}/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
          });
          Swal.fire("Deleted!", "Lease deleted.", "success");
          fetchLeases();
        } catch (error) {
          Swal.fire("Error", "Failed to delete lease", "error");
        }
      }
    });
  };

  // Filtered leases based on shop name search
  const filteredLeases = leases.filter((lease) =>
    lease.shop_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      {/* Floating + Button */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => {
          setOpen(true);
          setEditing(null);
          setForm({
            shop: "",
            landlord_name: "",
            lease_start: "",
            lease_end: "",
            monthly_rent: "",
            notes: "",
            year: "",
          });
        }}
      >
        <Add />
      </Fab>

      {/* Search Field */}
      <TextField
        label="Search by Shop Name"
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Lease Table */}
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
            <TableRow >
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>Shop</TableCell>
              <TableCell sx={{ color: "#fff" }}>Landlord</TableCell>
              <TableCell sx={{ color: "#fff" }}>Start</TableCell>
              <TableCell sx={{ color: "#fff" }}>End</TableCell>
              <TableCell sx={{ color: "#fff" }}>Monthly Rent</TableCell>
              <TableCell sx={{ color: "#fff" }}>Year</TableCell>
              <TableCell sx={{ color: "#fff" }}>Notes</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeases
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((lease) => (
                <TableRow key={lease.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell>{lease.id}</TableCell>
                  <TableCell>{lease.shop_name || lease.shop}</TableCell>
                  <TableCell>{lease.landlord_name}</TableCell>
                  <TableCell>{lease.lease_start}</TableCell>
                  <TableCell>{lease.lease_end || "-"}</TableCell>
                  <TableCell>${parseFloat(lease.monthly_rent).toFixed(2)}</TableCell>
                  <TableCell>{lease.year}</TableCell>
                  <TableCell>{lease.notes}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(lease)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(lease.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredLeases.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Lease Popup */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Lease" : "Add Lease"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Shop</InputLabel>
            <Select name="shop" value={form.shop} onChange={handleChange} label="Shop">
              {shops.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Landlord Name"
            name="landlord_name"
            fullWidth
            value={form.landlord_name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Lease Start"
            name="lease_start"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.lease_start}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Lease End"
            name="lease_end"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.lease_end}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Monthly Rent"
            name="monthly_rent"
            type="number"
            fullWidth
            value={form.monthly_rent}
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import {
//   Box,
//   Fab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   CircularProgress,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   Paper,
//   TablePagination,
//   IconButton,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import { Add, Edit, Delete } from "@mui/icons-material";
// // import LeasePaymentPage from "./LeasePaymentPage"; // child component

// export default function LeasePage() {
//   const [leases, setLeases] = useState([]);
//   const [shops, setShops] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({
//     shop: "",
//     landlord_name: "",
//     lease_start: "",
//     lease_end: "",
//     monthly_rent: "",
//     notes: "",
//     year: "",
//   });

//   // Pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Fetch leases
//   const fetchLeases = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/leases/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setLeases(res.data);
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Failed to fetch leases", "error");
//     }
//   };

//   // Fetch shops
//   const fetchShops = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/shops/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setShops(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch shops", "error");
//     }
//   };

//   useEffect(() => {
//     fetchLeases();
//     fetchShops();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "lease_start") {
//       const yearVal = new Date(value).getFullYear();
//       setForm({ ...form, [name]: value, year: yearVal });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setTimeout(async () => {
//       try {
//         if (editing) {
//           await axios.put(
//             `http://127.0.0.1:8000/api/leases/${editing.id}/`,
//             form,
//             { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
//           );
//           Swal.fire("Success", "Lease updated!", "success");
//         } else {
//           await axios.post(
//             "http://127.0.0.1:8000/api/leases/",
//             form,
//             { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
//           );
//           Swal.fire("Success", "Lease created!", "success");
//         }
//         setForm({
//           shop: "",
//           landlord_name: "",
//           lease_start: "",
//           lease_end: "",
//           monthly_rent: "",
//           notes: "",
//           year: "",
//         });
//         setEditing(null);
//         setOpen(false);
//         fetchLeases();
//       } catch (error) {
//         console.error(error);
//         Swal.fire("Error", "Failed to save lease", "error");
//       } finally {
//         setLoading(false);
//       }
//     }, 3000);
//   };

//   const handleEdit = (lease) => {
//     setEditing(lease);
//     setForm({
//       shop: lease.shop,
//       landlord_name: lease.landlord_name,
//       lease_start: lease.lease_start,
//       lease_end: lease.lease_end,
//       monthly_rent: lease.monthly_rent,
//       notes: lease.notes,
//       year: lease.year,
//     });
//     setOpen(true);
//   };

//   const handleDelete = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`http://127.0.0.1:8000/api/leases/${id}/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Deleted!", "Lease deleted.", "success");
//           fetchLeases();
//         } catch (error) {
//           Swal.fire("Error", "Failed to delete lease", "error");
//         }
//       }
//     });
//   };

//   return (
//     <Box p={3}>
//       {/* Floating + Button */}
//       <Fab
//         color="primary"
//         sx={{ position: "fixed", bottom: 20, right: 20 }}
//         onClick={() => {
//           setOpen(true);
//           setEditing(null);
//           setForm({
//             shop: "",
//             landlord_name: "",
//             lease_start: "",
//             lease_end: "",
//             monthly_rent: "",
//             notes: "",
//             year: "",
//           });
//         }}
//       >
//         <Add />
//       </Fab>

//       {/* Lease Table */}
//       <TableContainer component={Paper} sx={{ mt: 3 }}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#1976d2" }}>
//             <TableRow>
//               <TableCell sx={{ color: "#fff" }}>ID</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Shop</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Landlord</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Start</TableCell>
//               <TableCell sx={{ color: "#fff" }}>End</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Monthly Rent</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Year</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Notes</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {leases
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((lease) => (
//                 <TableRow key={lease.id}>
//                   <TableCell>{lease.id}</TableCell>
//                   <TableCell>{lease.shop_name || lease.shop}</TableCell>
//                   <TableCell>{lease.landlord_name}</TableCell>
//                   <TableCell>{lease.lease_start}</TableCell>
//                   <TableCell>{lease.lease_end || "-"}</TableCell>
//                   <TableCell>${parseFloat(lease.monthly_rent).toFixed(2)}</TableCell>
//                   <TableCell>{lease.year}</TableCell>
//                   <TableCell>{lease.notes}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleEdit(lease)} color="primary">
//                       <Edit />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(lease.id)} color="error">
//                       <Delete />
//                     </IconButton>
//                     {/* Optionally open payments */}
//                     {/* <LeasePaymentPage leaseId={lease.id} /> */}
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           component="div"
//           count={leases.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </TableContainer>

//       {/* Lease Popup */}
//       <Dialog open={open} onClose={() => {}} disableEscapeKeyDown fullWidth maxWidth="sm">
//         <DialogTitle>{editing ? "Edit Lease" : "Add Lease"}</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Shop</InputLabel>
//             <Select name="shop" value={form.shop} onChange={handleChange} label="Shop">
//               {shops.map((s) => (
//                 <MenuItem key={s.id} value={s.id}>
//                   {s.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <TextField
//             margin="dense"
//             label="Landlord Name"
//             name="landlord_name"
//             fullWidth
//             value={form.landlord_name}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Lease Start"
//             name="lease_start"
//             type="date"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.lease_start}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Lease End"
//             name="lease_end"
//             type="date"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.lease_end}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Monthly Rent"
//             name="monthly_rent"
//             type="number"
//             fullWidth
//             value={form.monthly_rent}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Notes"
//             name="notes"
//             fullWidth
//             multiline
//             rows={2}
//             value={form.notes}
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" disabled={loading}>
//             {loading ? <CircularProgress size={24} /> : "Submit"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

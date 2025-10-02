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
  Checkbox,
  FormControlLabel,
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

export default function LeasePaymentPage() {
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState(""); // Search by shop name
  const [form, setForm] = useState({
    lease: "",
    user: "",
    amount: "",
    interest_rate: "",
    currency: "USD",
    payment_date: "",
    due_date: "",
    paid: false,
    notes: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch payments
  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/lease-payments/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setPayments(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch payments", "error");
      console.error(error);
    }
  };

  // Fetch leases
  const fetchLeases = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/leases/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setLeases(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch leases", "error");
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setUsers(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchLeases();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        if (editing) {
          await axios.put(
            `http://127.0.0.1:8000/api/lease-payments/${editing.id}/`,
            form,
            { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
          );
          Swal.fire("Success", "Payment updated!", "success");
        } else {
          await axios.post("http://127.0.0.1:8000/api/lease-payments/", form, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
          });
          Swal.fire("Success", "Payment added!", "success");
        }
        setForm({
          lease: "",
          user: "",
          amount: "",
          interest_rate: "",
          currency: "USD",
          payment_date: "",
          due_date: "",
          paid: false,
          notes: "",
        });
        setEditing(null);
        setOpen(false);
        fetchPayments();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to save payment", "error");
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const handleEdit = (payment) => {
    setEditing(payment);
    setForm({
      lease: payment.lease,
      user: payment.user,
      amount: payment.amount,
      interest_rate: payment.interest_rate,
      currency: payment.currency,
      payment_date: payment.payment_date,
      due_date: payment.due_date,
      paid: payment.paid,
      notes: payment.notes,
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
          await axios.delete(`http://127.0.0.1:8000/api/lease-payments/${id}/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
          });
          Swal.fire("Deleted!", "Payment deleted.", "success");
          fetchPayments();
        } catch (error) {
          Swal.fire("Error", "Failed to delete payment", "error");
        }
      }
    });
  };

  // Filtered payments based on search
  const filteredPayments = payments.filter((p) =>
    p.shop_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      {/* Floating Add Button */}
      <Fab
        color="secondary"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => {
          setOpen(true);
          setEditing(null);
          setForm({
            lease: "",
            user: "",
            amount: "",
            interest_rate: "",
            currency: "USD",
            payment_date: "",
            due_date: "",
            paid: false,
            notes: "",
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

      {/* Payments Table */}
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Lease</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((p) => (
                <TableRow key={p.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.shop_name || p.lease}</TableCell>
                  <TableCell>{p.user_name || p.user}</TableCell>
                  <TableCell>
                    {p.currency === "USD" ? "$" : "LD "}
                    {parseFloat(p.amount || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>{parseFloat(p.interest_rate || 0).toFixed(2)}%</TableCell>
                  <TableCell>{p.currency}</TableCell>
                  <TableCell sx={{ color: "red", fontWeight: "bold" }}>
                    {p.currency === "USD" ? "$" : "LD "}
                    {parseFloat(p.balance || 0).toFixed(2)}
                  </TableCell>
                  <TableCell>{p.payment_date}</TableCell>
                  <TableCell>{p.due_date}</TableCell>
                  <TableCell>
                    <Checkbox checked={p.paid} disabled />
                  </TableCell>
                  <TableCell>{p.notes}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(p)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(p.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredPayments.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => {}}
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editing ? "Edit Payment" : "Add Payment"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Lease</InputLabel>
            <Select
              name="lease"
              value={form.lease}
              label="Lease"
              onChange={handleChange}
            >
              {leases.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.shop_name || l.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>User</InputLabel>
            <Select
              name="user"
              value={form.user}
              label="User"
              onChange={handleChange}
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.username || u.full_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            sx={{ mt: 2 }}
            value={form.amount}
            onChange={handleChange}
          />
          <TextField
            name="interest_rate"
            label="Interest Rate (%)"
            type="number"
            fullWidth
            sx={{ mt: 2 }}
            value={form.interest_rate}
            onChange={handleChange}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              name="currency"
              value={form.currency}
              label="Currency"
              onChange={handleChange}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="LD">LD</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="payment_date"
            label="Payment Date"
            type="date"
            fullWidth
            sx={{ mt: 2 }}
            value={form.payment_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="due_date"
            label="Due Date"
            type="date"
            fullWidth
            sx={{ mt: 2 }}
            value={form.due_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="paid"
                checked={form.paid}
                onChange={handleChange}
              />
            }
            label="Paid"
            sx={{ mt: 1 }}
          />
          <TextField
            name="notes"
            label="Notes"
            multiline
            rows={2}
            fullWidth
            sx={{ mt: 2 }}
            value={form.notes}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save"}
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
//   Checkbox,
//   FormControlLabel,
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

// export default function LeasePaymentPage() {
//   const [payments, setPayments] = useState([]);
//   const [leases, setLeases] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [search, setSearch] = useState("");

//   const [form, setForm] = useState({
//     lease: "",
//     user: "",
//     amount: "",
//     interest_rate: "",
//     currency: "USD",
//     payment_date: "",
//     due_date: "",
//     paid: false,
//     notes: "",
//   });

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Fetch payments
//   const fetchPayments = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/lease-payments/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setPayments(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch payments", "error");
//     }
//   };

//   // Fetch leases
//   const fetchLeases = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/leases/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setLeases(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch leases", "error");
//     }
//   };

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/users/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setUsers(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch users", "error");
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//     fetchLeases();
//     fetchUsers();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setTimeout(async () => {
//       try {
//         if (editing) {
//           await axios.put(
//             `http://127.0.0.1:8000/api/lease-payments/${editing.id}/`,
//             form,
//             { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
//           );
//           Swal.fire("Success", "Payment updated!", "success");
//         } else {
//           await axios.post("http://127.0.0.1:8000/api/lease-payments/", form, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Success", "Payment added!", "success");
//         }
//         setForm({
//           lease: "",
//           user: "",
//           amount: "",
//           interest_rate: "",
//           currency: "USD",
//           payment_date: "",
//           due_date: "",
//           paid: false,
//           notes: "",
//         });
//         setEditing(null);
//         setOpen(false);
//         fetchPayments();
//       } catch (error) {
//         Swal.fire("Error", "Failed to save payment", "error");
//       } finally {
//         setLoading(false);
//       }
//     }, 1000);
//   };

//   const handleEdit = (payment) => {
//     setEditing(payment);
//     setForm({
//       lease: payment.lease,
//       user: payment.user,
//       amount: payment.amount,
//       interest_rate: payment.interest_rate,
//       currency: payment.currency,
//       payment_date: payment.payment_date,
//       due_date: payment.due_date,
//       paid: payment.paid,
//       notes: payment.notes,
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
//           await axios.delete(`http://127.0.0.1:8000/api/lease-payments/${id}/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Deleted!", "Payment deleted.", "success");
//           fetchPayments();
//         } catch (error) {
//           Swal.fire("Error", "Failed to delete payment", "error");
//         }
//       }
//     });
//   };

//   const filteredPayments = payments.filter((p) =>
//     p.shop_name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Box p={3}>
//       <Fab
//         color="secondary"
//         sx={{ position: "fixed", bottom: 20, right: 20 }}
//         onClick={() => {
//           setOpen(true);
//           setEditing(null);
//           setForm({
//             lease: "",
//             user: "",
//             amount: "",
//             interest_rate: "",
//             currency: "USD",
//             payment_date: "",
//             due_date: "",
//             paid: false,
//             notes: "",
//           });
//         }}
//       >
//         <Add />
//       </Fab>

//       <TextField
//         label="Search by Shop Name"
//         variant="outlined"
//         size="small"
//         sx={{ mb: 2 }}
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Lease</TableCell>
//               <TableCell>User</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Interest Rate</TableCell>
//               <TableCell>Currency</TableCell>
//               <TableCell>Balance</TableCell>
//               <TableCell>Payment Date</TableCell>
//               <TableCell>Due Date</TableCell>
//               <TableCell>Paid</TableCell>
//               <TableCell>Notes</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredPayments
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((p) => (
//                 <TableRow key={p.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
//                   <TableCell>{p.id}</TableCell>
//                   <TableCell>{p.shop_name || p.lease}</TableCell>
//                   <TableCell>{p.user_name || p.user}</TableCell>
//                   <TableCell>
//                     {p.currency === "USD" ? "$" : "LD "}
//                     {parseFloat(p.amount || 0).toFixed(2)}
//                   </TableCell>
//                   <TableCell>{parseFloat(p.interest_rate || 0).toFixed(2)}%</TableCell>
//                   <TableCell>{p.currency}</TableCell>
//                   <TableCell
//                     sx={{ color: "red", fontWeight: "bold" }}
//                   >
//                     {p.currency === "USD" ? "$" : "LD "}
//                     {parseFloat(p.balance || 0).toFixed(2)}
//                   </TableCell>
//                   <TableCell>{p.payment_date}</TableCell>
//                   <TableCell>{p.due_date}</TableCell>
//                   <TableCell>
//                     <Checkbox checked={p.paid} disabled />
//                   </TableCell>
//                   <TableCell>{p.notes}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleEdit(p)} color="primary">
//                       <Edit />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(p.id)} color="error">
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           component="div"
//           count={filteredPayments.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </TableContainer>

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>{editing ? "Edit Payment" : "Add Payment"}</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Lease</InputLabel>
//             <Select name="lease" value={form.lease} onChange={handleChange}>
//               {leases.map((l) => (
//                 <MenuItem key={l.id} value={l.id}>
//                   {l.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth margin="dense">
//             <InputLabel>User</InputLabel>
//             <Select name="user" value={form.user} onChange={handleChange}>
//               {users.map((u) => (
//                 <MenuItem key={u.id} value={u.id}>
//                   {u.username}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             margin="dense"
//             label="Amount"
//             name="amount"
//             type="number"
//             fullWidth
//             value={form.amount}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Interest Rate (%)"
//             name="interest_rate"
//             type="number"
//             fullWidth
//             value={form.interest_rate}
//             onChange={handleChange}
//           />
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Currency</InputLabel>
//             <Select name="currency" value={form.currency} onChange={handleChange}>
//               <MenuItem value="USD">USD</MenuItem>
//               <MenuItem value="LD">LD</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             margin="dense"
//             label="Payment Date"
//             name="payment_date"
//             type="date"
//             fullWidth
//             value={form.payment_date}
//             onChange={handleChange}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             margin="dense"
//             label="Due Date"
//             name="due_date"
//             type="date"
//             fullWidth
//             value={form.due_date}
//             onChange={handleChange}
//             InputLabelProps={{ shrink: true }}
//           />
//           <FormControlLabel
//             control={
//               <Checkbox name="paid" checked={form.paid} onChange={handleChange} />
//             }
//             label="Paid"
//           />
//           <TextField
//             margin="dense"
//             label="Notes"
//             name="notes"
//             fullWidth
//             value={form.notes}
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? <CircularProgress size={24} /> : "Save"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }






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
//   Checkbox,
//   FormControlLabel,
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

// export default function LeasePaymentPage() {
//   const [payments, setPayments] = useState([]);
//   const [leases, setLeases] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [search, setSearch] = useState("");

//   const [form, setForm] = useState({
//     lease: "",
//     user: "",
//     amount: "",
//     interest_rate: "",
//     currency: "USD",
//     payment_date: "",
//     due_date: "",
//     paid: false,
//     notes: "",
//   });

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Fetch payments
//   const fetchPayments = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/lease-payments/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setPayments(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch payments", "error");
//       console.error(error);
//     }
//   };

//   // Fetch leases
//   const fetchLeases = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/leases/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setLeases(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch leases", "error");
//     }
//   };

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/users/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setUsers(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch users", "error");
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//     fetchLeases();
//     fetchUsers();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setTimeout(async () => {
//       try {
//         if (editing) {
//           await axios.put(
//             `http://127.0.0.1:8000/api/lease-payments/${editing.id}/`,
//             form,
//             { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
//           );
//           Swal.fire("Success", "Payment updated!", "success");
//         } else {
//           await axios.post("http://127.0.0.1:8000/api/lease-payments/", form, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Success", "Payment added!", "success");
//         }
//         setForm({
//           lease: "",
//           user: "",
//           amount: "",
//           interest_rate: "",
//           currency: "USD",
//           payment_date: "",
//           due_date: "",
//           paid: false,
//           notes: "",
//         });
//         setEditing(null);
//         setOpen(false);
//         fetchPayments();
//       } catch (error) {
//         console.error(error);
//         Swal.fire("Error", "Failed to save payment", "error");
//       } finally {
//         setLoading(false);
//       }
//     }, 1000);
//   };

//   const handleEdit = (payment) => {
//     setEditing(payment);
//     setForm({
//       lease: payment.lease,
//       user: payment.user,
//       amount: payment.amount,
//       interest_rate: payment.interest_rate,
//       currency: payment.currency,
//       payment_date: payment.payment_date,
//       due_date: payment.due_date,
//       paid: payment.paid,
//       notes: payment.notes,
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
//           await axios.delete(`http://127.0.0.1:8000/api/lease-payments/${id}/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Deleted!", "Payment deleted.", "success");
//           fetchPayments();
//         } catch (error) {
//           Swal.fire("Error", "Failed to delete payment", "error");
//         }
//       }
//     });
//   };

//   const filteredPayments = payments.filter((p) =>
//     p.shop_name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Box p={3}>
//       <Fab
//         color="secondary"
//         sx={{ position: "fixed", bottom: 20, right: 20 }}
//         onClick={() => {
//           setOpen(true);
//           setEditing(null);
//           setForm({
//             lease: "",
//             user: "",
//             amount: "",
//             interest_rate: "",
//             currency: "USD",
//             payment_date: "",
//             due_date: "",
//             paid: false,
//             notes: "",
//           });
//         }}
//       >
//         <Add />
//       </Fab>

//       <TextField
//         label="Search by Shop Name"
//         variant="outlined"
//         size="small"
//         sx={{ mb: 2 }}
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Lease</TableCell>
//               <TableCell>User</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Interest Rate</TableCell>
//               <TableCell>Currency</TableCell>
//               <TableCell>Balance</TableCell>
//               <TableCell>Payment Date</TableCell>
//               <TableCell>Due Date</TableCell>
//               <TableCell>Paid</TableCell>
//               <TableCell>Notes</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredPayments
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((p) => (
//                 <TableRow key={p.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
//                   <TableCell>{p.id}</TableCell>
//                   <TableCell>{p.shop_name || p.lease}</TableCell>
//                   <TableCell>{p.user_name || p.user}</TableCell>
//                   <TableCell>
//                     {p.currency === "USD" ? "$" : "LD "}
//                     {parseFloat(p.amount || 0).toFixed(2)}
//                   </TableCell>
//                   <TableCell>{parseFloat(p.interest_rate || 0).toFixed(2)}%</TableCell>
//                   <TableCell>{p.currency}</TableCell>
//                   <TableCell
//                     sx={{
//                       color: parseFloat(p.balance || 0) < 500 ? "red" : "inherit",
//                       fontWeight: parseFloat(p.balance || 0) < 500 ? "bold" : "normal",
//                     }}
//                   >
//                     {p.currency === "USD" ? "$" : "LD "}
//                     {parseFloat(p.balance || 0).toFixed(2)}
//                   </TableCell>
//                   <TableCell>{p.payment_date}</TableCell>
//                   <TableCell>{p.due_date}</TableCell>
//                   <TableCell>
//                     <Checkbox checked={p.paid} disabled />
//                   </TableCell>
//                   <TableCell>{p.notes}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleEdit(p)} color="primary">
//                       <Edit />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(p.id)} color="error">
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           component="div"
//           count={filteredPayments.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </TableContainer>

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>{editing ? "Edit Payment" : "Add Payment"}</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Lease</InputLabel>
//             <Select name="lease" value={form.lease} onChange={handleChange}>
//               {leases.map((l) => (
//                 <MenuItem key={l.id} value={l.id}>
//                   {l.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth margin="dense">
//             <InputLabel>User</InputLabel>
//             <Select name="user" value={form.user} onChange={handleChange}>
//               {users.map((u) => (
//                 <MenuItem key={u.id} value={u.id}>
//                   {u.username}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             margin="dense"
//             label="Amount"
//             name="amount"
//             type="number"
//             fullWidth
//             value={form.amount}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Interest Rate (%)"
//             name="interest_rate"
//             type="number"
//             fullWidth
//             value={form.interest_rate}
//             onChange={handleChange}
//           />
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Currency</InputLabel>
//             <Select name="currency" value={form.currency} onChange={handleChange}>
//               <MenuItem value="USD">USD</MenuItem>
//               <MenuItem value="LD">LD</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             margin="dense"
//             label="Payment Date"
//             name="payment_date"
//             type="date"
//             fullWidth
//             value={form.payment_date}
//             onChange={handleChange}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             margin="dense"
//             label="Due Date"
//             name="due_date"
//             type="date"
//             fullWidth
//             value={form.due_date}
//             onChange={handleChange}
//             InputLabelProps={{ shrink: true }}
//           />
//           <FormControlLabel
//             control={
//               <Checkbox name="paid" checked={form.paid} onChange={handleChange} />
//             }
//             label="Paid"
//           />
//           <TextField
//             margin="dense"
//             label="Notes"
//             name="notes"
//             fullWidth
//             value={form.notes}
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? <CircularProgress size={24} /> : "Save"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }





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
//   Checkbox,
//   FormControlLabel,
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

// export default function LeasePaymentPage() {
//   const [payments, setPayments] = useState([]);
//   const [leases, setLeases] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [search, setSearch] = useState("");
//   const [form, setForm] = useState({
//     lease: "",
//     user: "",
//     amount: "",
//     interest_rate: "",
//     currency: "USD",
//     payment_date: "",
//     due_date: "",
//     paid: false,
//     notes: "",
//   });

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const fetchPayments = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/lease-payments/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setPayments(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch payments", "error");
//     }
//   };

//   const fetchLeases = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/leases/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setLeases(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch leases", "error");
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/users/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setUsers(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch users", "error");
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//     fetchLeases();
//     fetchUsers();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setTimeout(async () => {
//       try {
//         if (editing) {
//           await axios.put(
//             `http://127.0.0.1:8000/api/lease-payments/${editing.id}/`,
//             form,
//             { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
//           );
//           Swal.fire("Success", "Payment updated!", "success");
//         } else {
//           await axios.post("http://127.0.0.1:8000/api/lease-payments/", form, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Success", "Payment added!", "success");
//         }
//         setForm({
//           lease: "",
//           user: "",
//           amount: "",
//           interest_rate: "",
//           currency: "USD",
//           payment_date: "",
//           due_date: "",
//           paid: false,
//           notes: "",
//         });
//         setEditing(null);
//         setOpen(false);
//         fetchPayments();
//       } catch (error) {
//         Swal.fire("Error", "Failed to save payment", "error");
//       } finally {
//         setLoading(false);
//       }
//     }, 3000);
//   };

//   const handleEdit = (payment) => {
//     setEditing(payment);
//     setForm({
//       lease: payment.lease,
//       user: payment.user,
//       amount: payment.amount,
//       interest_rate: payment.interest_rate,
//       currency: payment.currency,
//       payment_date: payment.payment_date,
//       due_date: payment.due_date,
//       paid: payment.paid,
//       notes: payment.notes,
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
//           await axios.delete(`http://127.0.0.1:8000/api/lease-payments/${id}/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Deleted!", "Payment deleted.", "success");
//           fetchPayments();
//         } catch (error) {
//           Swal.fire("Error", "Failed to delete payment", "error");
//         }
//       }
//     });
//   };

//   const filteredPayments = payments.filter((p) =>
//     p.shop_name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Box p={3}>
//       <Fab
//         color="secondary"
//         sx={{ position: "fixed", bottom: 20, right: 20 }}
//         onClick={() => { setOpen(true); setEditing(null); }}
//       >
//         <Add />
//       </Fab>

//       <TextField
//         label="Search by Shop Name"
//         variant="outlined"
//         size="small"
//         sx={{ mb: 2 }}
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#555", "& th": { color: "#fff" } }}>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Lease</TableCell>
//               <TableCell>User</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Interest Rate</TableCell>
//               <TableCell>Currency</TableCell>
//               <TableCell>Balance</TableCell>
//               <TableCell>Payment Date</TableCell>
//               <TableCell>Due Date</TableCell>
//               <TableCell>Paid</TableCell>
//               <TableCell>Notes</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
//               <TableRow key={p.id}>
//                 <TableCell>{p.id}</TableCell>
//                 <TableCell>{p.shop_name || p.lease}</TableCell>
//                 <TableCell>{p.user_name || p.user}</TableCell>
//                 <TableCell>
//                   {p.currency === "USD" ? "$" : "LD "}
//                   {Number(p.amount ?? 0).toFixed(2)}
//                 </TableCell>
//                 <TableCell>{Number(p.interest_rate ?? 0).toFixed(2)}%</TableCell>
//                 <TableCell>{p.currency}</TableCell>
//                 <TableCell>
//                   {p.currency === "USD" ? "$" : "LD "}
//                   {Number(p.balance ?? 0).toFixed(2)}
//                 </TableCell>
//                 <TableCell>{p.payment_date}</TableCell>
//                 <TableCell>{p.due_date}</TableCell>
//                 <TableCell><Checkbox checked={p.paid} disabled /></TableCell>
//                 <TableCell>{p.notes}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(p)} color="primary"><Edit /></IconButton>
//                   <IconButton onClick={() => handleDelete(p.id)} color="error"><Delete /></IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           component="div"
//           count={filteredPayments.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
//         />
//       </TableContainer>

//       {/* Add/Edit Dialog */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>{editing ? "Edit Payment" : "Add Payment"}</DialogTitle>
//         <DialogContent>
//           {/* Lease */}
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Lease</InputLabel>
//             <Select name="lease" value={form.lease} onChange={handleChange}>
//               {leases.map(l => <MenuItem key={l.id} value={l.id}>{l.shop_name ? `${l.shop_name} - ${l.landlord_name}` : l.id}</MenuItem>)}
//             </Select>
//           </FormControl>

//           {/* User */}
//           <FormControl fullWidth margin="dense">
//             <InputLabel>User</InputLabel>
//             <Select name="user" value={form.user} onChange={handleChange}>
//               {users.map(u => <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>)}
//             </Select>
//           </FormControl>

//           <TextField margin="dense" label="Amount" name="amount" type="number" fullWidth value={form.amount} onChange={handleChange} />
//           <TextField margin="dense" label="Interest Rate (%)" name="interest_rate" type="number" fullWidth value={form.interest_rate} onChange={handleChange} />

//           <FormControl fullWidth margin="dense">
//             <InputLabel>Currency</InputLabel>
//             <Select name="currency" value={form.currency} onChange={handleChange}>
//               <MenuItem value="USD">USD</MenuItem>
//               <MenuItem value="LD">LD</MenuItem>
//             </Select>
//           </FormControl>

//           <TextField margin="dense" label="Payment Date" name="payment_date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.payment_date} onChange={handleChange} />
//           <TextField margin="dense" label="Due Date" name="due_date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.due_date} onChange={handleChange} />
//           <FormControlLabel control={<Checkbox checked={form.paid} onChange={handleChange} name="paid" />} label="Paid" />
//           <TextField margin="dense" label="Notes" name="notes" fullWidth multiline rows={2} value={form.notes} onChange={handleChange} />
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
//   Checkbox,
//   FormControlLabel,
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

// export default function LeasePaymentPage() {
//   const [payments, setPayments] = useState([]);
//   const [leases, setLeases] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [search, setSearch] = useState(""); // Search by shop name
//   const [form, setForm] = useState({
//     lease: "",
//     user: "",
//     amount: "",
//     interest_rate: "",
//     currency: "USD",
//     payment_date: "",
//     due_date: "",
//     paid: false,
//     notes: "",
//   });

//   // Pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Fetch payments
//   const fetchPayments = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/lease-payments/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setPayments(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch payments", "error");
//       console.error(error);
//     }
//   };

//   // Fetch leases
//   const fetchLeases = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/leases/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setLeases(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch leases", "error");
//     }
//   };

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/users/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setUsers(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch users", "error");
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//     fetchLeases();
//     fetchUsers();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setTimeout(async () => {
//       try {
//         if (editing) {
//           await axios.put(
//             `http://127.0.0.1:8000/api/lease-payments/${editing.id}/`,
//             form,
//             { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
//           );
//           Swal.fire("Success", "Payment updated!", "success");
//         } else {
//           await axios.post("http://127.0.0.1:8000/api/lease-payments/", form, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Success", "Payment added!", "success");
//         }
//         setForm({
//           lease: "",
//           user: "",
//           amount: "",
//           interest_rate: "",
//           currency: "USD",
//           payment_date: "",
//           due_date: "",
//           paid: false,
//           notes: "",
//         });
//         setEditing(null);
//         setOpen(false);
//         fetchPayments();
//       } catch (error) {
//         console.error(error);
//         Swal.fire("Error", "Failed to save payment", "error");
//       } finally {
//         setLoading(false);
//       }
//     }, 3000);
//   };

//   const handleEdit = (payment) => {
//     setEditing(payment);
//     setForm({
//       lease: payment.lease,
//       user: payment.user,
//       amount: payment.amount,
//       interest_rate: payment.interest_rate,
//       currency: payment.currency,
//       payment_date: payment.payment_date,
//       due_date: payment.due_date,
//       paid: payment.paid,
//       notes: payment.notes,
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
//           await axios.delete(`http://127.0.0.1:8000/api/lease-payments/${id}/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Deleted!", "Payment deleted.", "success");
//           fetchPayments();
//         } catch (error) {
//           Swal.fire("Error", "Failed to delete payment", "error");
//         }
//       }
//     });
//   };

//   // Filtered payments based on search
//   const filteredPayments = payments.filter((p) =>
//     p.shop_name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Box p={3}>
//       {/* Floating Add Button */}
//       <Fab
//         color="secondary"
//         sx={{ position: "fixed", bottom: 20, right: 20 }}
//         onClick={() => {
//           setOpen(true);
//           setEditing(null);
//           setForm({
//             lease: "",
//             user: "",
//             amount: "",
//             interest_rate: "",
//             currency: "USD",
//             payment_date: "",
//             due_date: "",
//             paid: false,
//             notes: "",
//           });
//         }}
//       >
//         <Add />
//       </Fab>

//       {/* Search Field */}
//       <TextField
//         label="Search by Shop Name"
//         variant="outlined"
//         size="small"
//         sx={{ mb: 2 }}
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* Payments Table */}
//       <TableContainer component={Paper} sx={{ mt: 1 }}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Lease</TableCell>
//               <TableCell>User</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Interest Rate</TableCell>
//               <TableCell>Currency</TableCell>
//               <TableCell>Balance</TableCell>
//               <TableCell>Payment Date</TableCell>
//               <TableCell>Due Date</TableCell>
//               <TableCell>Paid</TableCell>
//               <TableCell>Notes</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredPayments
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((p) => (
//                 <TableRow key={p.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
//                   <TableCell>{p.id}</TableCell>
//                   <TableCell>{p.shop_name || p.lease}</TableCell>
//                   <TableCell>{p.user_name || p.user}</TableCell>
//                   <TableCell>
//                     {p.currency === "USD" ? "$" : "LD "}
//                     {parseFloat(p.amount).toFixed(2)}
//                   </TableCell>
//                   <TableCell>{parseFloat(p.interest_rate).toFixed(2)}%</TableCell>
//                   <TableCell>{p.currency}</TableCell>
//                   <TableCell
//                     sx={{
//                       color: p.balance < 500 ? "red" : "inherit",
//                       fontWeight: p.balance < 500 ? "bold" : "normal",
//                     }}
//                   >
//                     {p.currency === "USD" ? "$" : "LD "}
//                     {parseFloat(p.balance).toFixed(2)}
//                   </TableCell>
//                   <TableCell>{p.payment_date}</TableCell>
//                   <TableCell>{p.due_date}</TableCell>
//                   <TableCell>
//                     <Checkbox checked={p.paid} disabled />
//                   </TableCell>
//                   <TableCell>{p.notes}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleEdit(p)} color="primary">
//                       <Edit />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(p.id)} color="error">
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           component="div"
//           count={filteredPayments.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </TableContainer>

//       {/* Add/Edit Dialog */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>{editing ? "Edit Payment" : "Add Payment"}</DialogTitle>
//         <DialogContent>
//           {/* Lease Dropdown */}
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Lease</InputLabel>
//             <Select name="lease" value={form.lease} onChange={handleChange} label="Lease">
//               {leases.map((l) => (
//                 <MenuItem key={l.id} value={l.id}>
//                   {l.shop_name ? `${l.shop_name} - ${l.landlord_name}` : l.id}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* User Dropdown */}
//           <FormControl fullWidth margin="dense">
//             <InputLabel>User</InputLabel>
//             <Select name="user" value={form.user} onChange={handleChange} label="User">
//               {users.map((u) => (
//                 <MenuItem key={u.id} value={u.id}>
//                   {u.username}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             margin="dense"
//             label="Amount"
//             name="amount"
//             type="number"
//             fullWidth
//             value={form.amount}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Interest Rate (%)"
//             name="interest_rate"
//             type="number"
//             fullWidth
//             value={form.interest_rate}
//             onChange={handleChange}
//           />

//           {/* Currency Dropdown */}
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Currency</InputLabel>
//             <Select name="currency" value={form.currency} onChange={handleChange} label="Currency">
//               <MenuItem value="USD">USD</MenuItem>
//               <MenuItem value="LD">LD</MenuItem>
//             </Select>
//           </FormControl>

//           <TextField
//             margin="dense"
//             label="Payment Date"
//             name="payment_date"
//             type="date"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.payment_date}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Due Date"
//             name="due_date"
//             type="date"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.due_date}
//             onChange={handleChange}
//           />
//           <FormControlLabel
//             control={<Checkbox checked={form.paid} onChange={handleChange} name="paid" />}
//             label="Paid"
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
//   Checkbox,
//   FormControlLabel,
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

// export default function LeasePaymentPage() {
//   const [payments, setPayments] = useState([]);
//   const [leases, setLeases] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [search, setSearch] = useState(""); // Search by shop name
//   const [form, setForm] = useState({
//     lease: "",
//     user: "",
//     amount: "",
//     interest_rate: "",
//     payment_date: "",
//     due_date: "",
//     paid: false,
//     notes: "",
//   });

//   // Pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Fetch payments
//   const fetchPayments = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/lease-payments/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setPayments(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch payments", "error");
//       console.error(error);
//     }
//   };

//   // Fetch leases
//   const fetchLeases = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/leases/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setLeases(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch leases", "error");
//     }
//   };

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/users/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setUsers(res.data);
//     } catch (error) {
//       Swal.fire("Error", "Failed to fetch users", "error");
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//     fetchLeases();
//     fetchUsers();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setTimeout(async () => {
//       try {
//         if (editing) {
//           await axios.put(
//             `http://127.0.0.1:8000/api/lease-payments/${editing.id}/`,
//             form,
//             { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
//           );
//           Swal.fire("Success", "Payment updated!", "success");
//         } else {
//           await axios.post("http://127.0.0.1:8000/api/lease-payments/", form, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Success", "Payment added!", "success");
//         }
//         setForm({
//           lease: "",
//           user: "",
//           amount: "",
//           interest_rate: "",
//           payment_date: "",
//           due_date: "",
//           paid: false,
//           notes: "",
//         });
//         setEditing(null);
//         setOpen(false);
//         fetchPayments();
//       } catch (error) {
//         console.error(error);
//         Swal.fire("Error", "Failed to save payment", "error");
//       } finally {
//         setLoading(false);
//       }
//     }, 3000);
//   };

//   const handleEdit = (payment) => {
//     setEditing(payment);
//     setForm({
//       lease: payment.lease,
//       user: payment.user,
//       amount: payment.amount,
//       interest_rate: payment.interest_rate,
//       payment_date: payment.payment_date,
//       due_date: payment.due_date,
//       paid: payment.paid,
//       notes: payment.notes,
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
//           await axios.delete(`http://127.0.0.1:8000/api/lease-payments/${id}/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Deleted!", "Payment deleted.", "success");
//           fetchPayments();
//         } catch (error) {
//           Swal.fire("Error", "Failed to delete payment", "error");
//         }
//       }
//     });
//   };

//   // Filtered payments based on search
//   const filteredPayments = payments.filter((p) =>
//     p.shop_name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Box p={3}>
//       {/* Floating Add Button */}
//       <Fab
//         color="secondary"
//         sx={{ position: "fixed", bottom: 20, right: 20 }}
//         onClick={() => {
//           setOpen(true);
//           setEditing(null);
//           setForm({
//             lease: "",
//             user: "",
//             amount: "",
//             interest_rate: "",
//             payment_date: "",
//             due_date: "",
//             paid: false,
//             notes: "",
//           });
//         }}
//       >
//         <Add />
//       </Fab>

//       {/* Search Field */}
//       <TextField
//         label="Search by Shop Name"
//         variant="outlined"
//         size="small"
//         sx={{ mb: 2 }}
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* Payments Table */}
//       <TableContainer component={Paper} sx={{ mt: 1 }}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
//             <TableRow >
//               <TableCell sx={{ color: "#fff" }}>ID</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Lease</TableCell>
//               <TableCell sx={{ color: "#fff" }}>User</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Interest Rate</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Payment Date</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Due Date</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Paid</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Notes</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredPayments
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((p) => (
//                 <TableRow key={p.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
//                   <TableCell>{p.id}</TableCell>
//                   <TableCell>{p.shop_name || p.lease}</TableCell>
//                   <TableCell>{p.user_name || p.user}</TableCell>
//                   <TableCell>${parseFloat(p.amount).toFixed(2)}</TableCell>
//                   <TableCell>{parseFloat(p.interest_rate).toFixed(2)}%</TableCell>
//                   <TableCell>{p.payment_date}</TableCell>
//                   <TableCell>{p.due_date}</TableCell>
//                   <TableCell>
//                     <Checkbox checked={p.paid} disabled />
//                   </TableCell>
//                   <TableCell>{p.notes}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleEdit(p)} color="primary">
//                       <Edit />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(p.id)} color="error">
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           component="div"
//           count={filteredPayments.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </TableContainer>

//       {/* Add/Edit Dialog */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>{editing ? "Edit Payment" : "Add Payment"}</DialogTitle>
//         <DialogContent>
//           {/* Lease Dropdown */}
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Lease</InputLabel>
//             <Select name="lease" value={form.lease} onChange={handleChange} label="Lease">
//               {leases.map((l) => (
//                 <MenuItem key={l.id} value={l.id}>
//                   {l.shop_name ? `${l.shop_name} - ${l.landlord_name}` : l.id}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* User Dropdown */}
//           <FormControl fullWidth margin="dense">
//             <InputLabel>User</InputLabel>
//             <Select name="user" value={form.user} onChange={handleChange} label="User">
//               {users.map((u) => (
//                 <MenuItem key={u.id} value={u.id}>
//                   {u.username}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             margin="dense"
//             label="Amount"
//             name="amount"
//             type="number"
//             fullWidth
//             value={form.amount}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Interest Rate (%)"
//             name="interest_rate"
//             type="number"
//             fullWidth
//             value={form.interest_rate}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Payment Date"
//             name="payment_date"
//             type="date"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.payment_date}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Due Date"
//             name="due_date"
//             type="date"
//             fullWidth
//             InputLabelProps={{ shrink: true }}
//             value={form.due_date}
//             onChange={handleChange}
//           />
//           <FormControlLabel
//             control={<Checkbox checked={form.paid} onChange={handleChange} name="paid" />}
//             label="Paid"
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



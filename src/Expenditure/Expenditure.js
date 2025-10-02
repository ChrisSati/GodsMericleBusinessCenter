import React, { useEffect, useState } from "react";
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
import Swal from "sweetalert2";
import axios from "axios";

export default function Expenditure() {
  const [expenditures, setExpenditures] = useState([]);
  const [users, setUsers] = useState([]); // users for dropdown
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    user: "",
    title: "",
    description: "",
    amount: "",
    expenditure_date: "",
    year: "",
    category: "",
  });
  const [editingRecord, setEditingRecord] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch expenditures
  const fetchExpenditures = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/expenditures/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      setExpenditures(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch expenditures", "error");
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
      console.error(error);
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  useEffect(() => {
    fetchExpenditures();
    fetchUsers();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "expenditure_date") {
      const yearVal = new Date(value).getFullYear();
      setForm({ ...form, [name]: value, year: yearVal });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        if (editingRecord) {
          await axios.put(
            `http://127.0.0.1:8000/api/expenditures/${editingRecord.id}/`,
            form,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
            }
          );
          Swal.fire("Success", "Expenditure updated successfully!", "success");
        } else {
          await axios.post("http://127.0.0.1:8000/api/expenditures/", form, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
          });
          Swal.fire("Success", "Expenditure added successfully!", "success");
        }

        setForm({
         
          title: "",
          description: "",
          amount: "",
          expenditure_date: "",
          year: "",
          category: "",
        });
        setEditingRecord(null);
        setOpen(false);
        fetchExpenditures();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to save expenditure", "error");
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditingRecord(record);
    setForm({
      user: record.user,
      title: record.title,
      description: record.description,
      amount: record.amount,
      expenditure_date: record.expenditure_date,
      year: record.year,
      category: record.category,
    });
    setOpen(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/expenditures/${id}/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
          });
          Swal.fire("Deleted!", "Expenditure deleted successfully.", "success");
          fetchExpenditures();
        } catch (error) {
          Swal.fire("Error", "Failed to delete expenditure", "error");
        }
      }
    });
  };

  return (
    <Box p={3}>
      {/* Floating + Button */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => {
          setOpen(true);
          setEditingRecord(null);
          setForm({
            user: "",
            title: "",
            description: "",
            amount: "",
            expenditure_date: "",
            year: "",
            category: "",
          });
        }}
      >
        <Add />
      </Fab>

      {/* Expenditure Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#555", "& th": { color: "white" } }}> 
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>User</TableCell>
              <TableCell sx={{ color: "#fff" }}>Title</TableCell>
              <TableCell sx={{ color: "#fff" }}>Description</TableCell>
              <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
              <TableCell sx={{ color: "#fff" }}>Expenditure Date</TableCell>
              <TableCell sx={{ color: "#fff" }}>Year</TableCell>
              <TableCell sx={{ color: "#fff" }}>Category</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenditures
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((exp) => (
                <TableRow key={exp.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell>{exp.id}</TableCell>
                  <TableCell>
                    {exp.user_name || exp.user} {/* depends on serializer */}
                  </TableCell>
                  <TableCell>{exp.title}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>${parseFloat(exp.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(exp.expenditure_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{exp.year}</TableCell>
                  <TableCell>{exp.category}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(exp)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(exp.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={expenditures.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Popup Dialog */}
      <Dialog
  open={open}
  onClose={() => {}}   // prevents closing on backdrop click
  disableEscapeKeyDown // prevents closing with Esc key
  fullWidth
  maxWidth="sm"
>
        <DialogTitle>
          {editingRecord ? "Edit Expenditure" : "Add Expenditure"}
        </DialogTitle>
        <DialogContent>
          {/* User Dropdown */}
          <FormControl fullWidth margin="dense">
            <InputLabel>User</InputLabel>
            <Select
              name="user"
              value={form.user}
              onChange={handleChange}
              label="User"
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.full_name || u.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            value={form.amount}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Expenditure Date"
            name="expenditure_date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.expenditure_date}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Year"
            name="year"
            type="number"
            fullWidth
            value={form.year}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            fullWidth
            value={form.category}
            onChange={handleChange}
          />
        </DialogContent>
   <DialogActions>
  <Button onClick={() => setOpen(false)}>Cancel</Button>
  <Button
    onClick={handleSubmit}
    variant="contained"
    disabled={loading}
  >
    {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
  </Button>
</DialogActions>
      </Dialog>
    </Box>
  );
}





// import React, { useEffect, useState } from "react";
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
// } from "@mui/material";
// import { Add, Edit, Delete } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import axios from "axios";

// export default function Expenditure() {
//   const [expenditures, setExpenditures] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({ description: "", amount: "" });
//   const [editingRecord, setEditingRecord] = useState(null);

//   // Pagination states
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Fetch expenditures
//   const fetchExpenditures = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/expenditures/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       });
//       setExpenditures(res.data);
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Failed to fetch expenditures", "error");
//     }
//   };

//   useEffect(() => {
//     fetchExpenditures();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Handle submit
//   const handleSubmit = async () => {
//     setLoading(true);

//     setTimeout(async () => {
//       try {
//         if (editingRecord) {
//           // Update
//           await axios.put(
//             `http://127.0.0.1:8000/api/expenditures/${editingRecord.id}/`,
//             form,
//             {
//               headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//             }
//           );
//           Swal.fire("Success", "Expenditure updated successfully!", "success");
//         } else {
//           // Create
//           await axios.post("http://127.0.0.1:8000/api/expenditures/", form, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Success", "Expenditure added successfully!", "success");
//         }

//         setForm({ description: "", amount: "" });
//         setEditingRecord(null);
//         setOpen(false);
//         fetchExpenditures();
//       } catch (error) {
//         console.error(error);
//         Swal.fire("Error", "Failed to save expenditure", "error");
//       } finally {
//         setLoading(false);
//       }
//     }, 3000);
//   };

//   // Handle edit
//   const handleEdit = (record) => {
//     setEditingRecord(record);
//     setForm({ description: record.description, amount: record.amount });
//     setOpen(true);
//   };

//   // Handle delete
//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`http://127.0.0.1:8000/api/expenditures/${id}/`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//           });
//           Swal.fire("Deleted!", "Expenditure deleted successfully.", "success");
//           fetchExpenditures();
//         } catch (error) {
//           Swal.fire("Error", "Failed to delete expenditure", "error");
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
//           setEditingRecord(null);
//           setForm({ description: "", amount: "" });
//         }}
//       >
//         <Add />
//       </Fab>

//       {/* Expenditure Table */}
//       <TableContainer component={Paper} sx={{ mt: 3 }}>
//         <Table>
//           <TableHead sx={{ backgroundColor: "#1976d2" }}>
//             <TableRow>
//               <TableCell sx={{ color: "#fff" }}>ID</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Description</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Date</TableCell>
//               <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {expenditures
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((exp) => (
//                 <TableRow key={exp.id}>
//                   <TableCell>{exp.id}</TableCell>
//                   <TableCell>{exp.description}</TableCell>
//                   <TableCell>${parseFloat(exp.amount).toFixed(2)}</TableCell>
//                   <TableCell>
//                     {new Date(exp.date).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleEdit(exp)} color="primary">
//                       <Edit />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDelete(exp.id)}
//                       color="error"
//                     >
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           component="div"
//           count={expenditures.length}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </TableContainer>

//       {/* Popup Dialog */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>
//           {editingRecord ? "Edit Expenditure" : "Add Expenditure"}
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             label="Description"
//             name="description"
//             fullWidth
//             value={form.description}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="dense"
//             label="Amount"
//             name="amount"
//             type="number"
//             fullWidth
//             value={form.amount}
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button
//             onClick={handleSubmit}
//             variant="contained"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

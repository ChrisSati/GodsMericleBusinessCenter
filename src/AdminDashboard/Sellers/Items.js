import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Items = () => {
  const [items, setItems] = useState([]);
  const [shops, setShops] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    shop: "",
    item_name: "",
    sale_price: "",
  });
  const [userRole, setUserRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");

  // Fetch user info and shops
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data.role);

        if (res.data.role === "ADMIN") {
          const shopsRes = await axios.get("http://127.0.0.1:8000/api/shops/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setShops(shopsRes.data);
        } else {
          setShops(res.data.assigned_shops || []);
        }
      } catch (err) {
        console.error("Error fetching user or shops:", err);
      }
    };
    fetchUser();
  }, [token]);

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/items/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    if (userRole) fetchItems();
  }, [userRole]);

  // Open form
  const handleOpen = () => {
    setFormData({
      id: null,
      shop: shops[0]?.id || "",
      item_name: "",
      sale_price: "",
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Add/Edit
  const handleSubmit = async () => {
    if (!formData.shop) {
      Swal.fire("Error", "Shop is required", "error");
      return;
    }
    setLoading(true);
    try {
      if (formData.id) {
        await axios.put(
          `http://127.0.0.1:8000/api/items/${formData.id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("Updated!", "Item has been updated.", "success");
      } else {
        await axios.post("http://127.0.0.1:8000/api/items/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Created!", "Item has been created.", "success");
      }
      setOpen(false);
      fetchItems();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.shop || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      shop: item.shop,
      item_name: item.item_name,
      sale_price: item.sale_price,
    });
    setOpen(true);
  };

  // Delete item
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/items/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(items.filter((i) => i.id !== id));
        Swal.fire("Deleted!", "Item has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete item", "error");
      }
    }
  };

  // Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter items by search
  const filteredItems = items.filter((item) =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter for PDF download
  const getFilteredItems = () => {
    return items.filter((item) => {
      const itemDate = dayjs(item.created_at);
      let dateMatch = true;
      let monthMatch = true;

      if (selectedDate) dateMatch = itemDate.isSame(dayjs(selectedDate), "day");
      if (selectedMonth) monthMatch = itemDate.isSame(dayjs(selectedMonth), "month");

      if (userRole === "SELLERS") {
        if (item.created_by_username !== username) return false;
      }
      return dateMatch && monthMatch;
    });
  };

  // Download PDF
//   const downloadPDF = async () => {
//     const filtered = getFilteredItems();
//     if (!filtered.length) {
//       Swal.fire("No data", "No items found for selected date/month", "info");
//       return;
//     }

//     const table = document.createElement("table");
//     table.style.width = "100%";
//     table.style.borderCollapse = "collapse";

//     table.innerHTML = `
//       <thead style="background-color: #87CEFA; color: black;">
//         <tr>
//           <th style="border: 1px solid black; padding: 4px;">Shop</th>
//           <th style="border: 1px solid black; padding: 4px;">Item Name</th>
//           <th style="border: 1px solid black; padding: 4px;">Sale Price</th>
//           <th style="border: 1px solid black; padding: 4px;">Assigned Seller</th>
//           <th style="border: 1px solid black; padding: 4px;">Edited By</th>
//           <th style="border: 1px solid black; padding: 4px;">Created At</th>
//         </tr>
//       </thead>
//       <tbody style="background-color: #FFDAB9; color: black;">
//         ${filtered
//           .map(
//             (item) => `
//           <tr>
//             <td style="border: 1px solid black; padding: 4px;">${item.shop_name}</td>
//             <td style="border: 1px solid black; padding: 4px;">${item.item_name}</td>
//             <td style="border: 1px solid black; padding: 4px;">${item.sale_price}</td>
//             <td style="border: 1px solid black; padding: 4px;">${item.created_by_username || "-"}</td>
//             <td style="border: 1px solid black; padding: 4px;">${item.updated_by_username || "-"}</td>
//             <td style="border: 1px solid black; padding: 4px;">${new Date(item.created_at).toLocaleString()}</td>
//           </tr>`
//           )
//           .join("")}
//       </tbody>
//     `;

//     const totalItems = filtered.length;
//     const totalSale = filtered.reduce(
//       (sum, item) => sum + parseFloat(item.sale_price),
//       0
//     );

//     document.body.appendChild(table);
//     const canvas = await html2canvas(table, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "pt", "a4");
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.setFontSize(12);
//     pdf.text(
//       `Total Items: ${totalItems} | Total Sale: ${totalSale.toFixed(2)}`,
//       40,
//       pdfHeight + 30
//     );

//     pdf.save(
//       `Items_Report_${
//         selectedDate
//           ? dayjs(selectedDate).format("YYYY-MM-DD")
//           : selectedMonth
//           ? dayjs(selectedMonth).format("YYYY-MM")
//           : "all"
//       }.pdf`
//     );

//     document.body.removeChild(table);
//   };

// Download PDF
const downloadPDF = async () => {
  const filtered = getFilteredItems();
  if (!filtered.length) {
    Swal.fire("No data", "No items found for selected date/month", "info");
    return;
  }

  // Create a table element
  const table = document.createElement("table");
  table.style.width = "90%"; // reduced width for margins
  table.style.margin = "0 auto"; // center table
  table.style.borderCollapse = "collapse";

  table.innerHTML = `
    <thead style="background-color: #87CEFA; color: black;">
      <tr>
        <th style="border: 1px solid black; padding: 4px;">Shop</th>
        <th style="border: 1px solid black; padding: 4px;">Item Name</th>
        <th style="border: 1px solid black; padding: 4px;">Sale Price</th>
        <th style="border: 1px solid black; padding: 4px;">Assigned Seller</th>
        <th style="border: 1px solid black; padding: 4px;">Edited By</th>
        <th style="border: 1px solid black; padding: 4px;">Created At</th>
      </tr>
    </thead>
    <tbody style="background-color: #FFDAB9; color: black;">
      ${filtered
        .map(
          (item) => `
        <tr>
          <td style="border: 1px solid black; padding: 4px;">${item.shop_name}</td>
          <td style="border: 1px solid black; padding: 4px;">${item.item_name}</td>
          <td style="border: 1px solid black; padding: 4px;">${item.sale_price}</td>
          <td style="border: 1px solid black; padding: 4px;">${item.created_by_username || "-"}</td>
          <td style="border: 1px solid black; padding: 4px;">${item.updated_by_username || "-"}</td>
          <td style="border: 1px solid black; padding: 4px;">${new Date(item.created_at).toLocaleString()}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  `;

  const totalItems = filtered.length;
  const totalSale = filtered.reduce(
    (sum, item) => sum + parseFloat(item.sale_price),
    0
  );

  document.body.appendChild(table);
  const canvas = await html2canvas(table, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const imgProps = pdf.getImageProperties(imgData);
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 30; // left/right margin
  const pdfWidth = pageWidth - margin * 2;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", margin, 20, pdfWidth, pdfHeight);

  pdf.setFontSize(12);
  pdf.text(
    `Total Items: ${totalItems} | Total Sale: ${totalSale.toFixed(
      2
    )} | Date: ${selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : "-"} | Month: ${
      selectedMonth ? dayjs(selectedMonth).format("MMMM YYYY") : "-"
    }`,
    margin,
    pdfHeight + 50
  );

  pdf.save(
    `Items_Report_${
      selectedDate
        ? dayjs(selectedDate).format("YYYY-MM-DD")
        : selectedMonth
        ? dayjs(selectedMonth).format("YYYY-MM")
        : "all"
    }.pdf`
  );

  document.body.removeChild(table);
};


  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Items Management
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search Item Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={setSelectedDate}
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            views={["year", "month"]}
            label="Select Month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            slotProps={{ textField: { size: "small" } }}
          />
        </LocalizationProvider>
        <Button variant="contained" color="success" onClick={downloadPDF}>
          Download PDF
        </Button>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Item
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
        <TableRow sx={{ backgroundColor: "#1a3c47ff" }}>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Shop</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Item Name</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sale Price</TableCell>
        <TableCell sx={{ color: "yellow", fontWeight: "bold" }}>Assigned Seller</TableCell>
        <TableCell sx={{ color: "yellow", fontWeight: "bold" }}>Edited By</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created At</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
      </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    backgroundColor: "#FFDAB9",
                    "&:hover": { backgroundColor: "#FFFFE0" },
                  }}
                >
                  <TableCell>{item.shop_name}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.sale_price}</TableCell>
                  <TableCell>{item.created_by_username || "-"}</TableCell>
                  <TableCell>{item.updated_by_username || "-"}</TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(item)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog Form */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{formData.id ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="dense"
            name="shop"
            label="Shop"
            value={formData.shop}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="">Select Shop</option>
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            label="Item Name"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Sale Price"
            name="sale_price"
            type="number"
            value={formData.sale_price}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Items;








// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   CircularProgress,
//   TablePagination,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import axios from "axios";

// const Items = () => {
//   const [items, setItems] = useState([]);
//   const [shops, setShops] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     id: null,
//     shop: "",
//     item_name: "",
//     sale_price: "",
//   });
//   const [userRole, setUserRole] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const token = localStorage.getItem("access");

//   // Fetch user info
// //   useEffect(() => {
// //     const fetchUser = async () => {
// //       try {
// //         const res = await axios.get("http://127.0.0.1:8000/api/me/", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setUserRole(res.data.role);
// //         setShops(res.data.assigned_shops || []);
// //       } catch (err) {
// //         console.error("Error fetching user:", err);
// //       }
// //     };
// //     fetchUser();
// //   }, [token]);

// useEffect(() => {
//   const fetchUser = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/me/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserRole(res.data.role);

//       if (res.data.role === "ADMIN") {
//         // Admin: fetch all shops
//         const shopsRes = await axios.get("http://127.0.0.1:8000/api/shops/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setShops(shopsRes.data);
//       } else {
//         // Seller: only assigned shops
//         setShops(res.data.assigned_shops || []);
//       }
//     } catch (err) {
//       console.error("Error fetching user or shops:", err);
//     }
//   };
//   fetchUser();
// }, [token]);

//   // Fetch items
//   const fetchItems = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/items/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setItems(res.data);
//     } catch (err) {
//       console.error("Error fetching items:", err);
//     }
//   };

//   useEffect(() => {
//     if (userRole) fetchItems();
//   }, [userRole]);

//   const handleOpen = () => {
//     setFormData({
//       id: null,
//       shop: shops[0]?.id || "",
//       item_name: "",
//       sale_price: "",
//     });
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!formData.shop) {
//       Swal.fire("Error", "Shop is required", "error");
//       return;
//     }
//     setLoading(true);
//     try {
//       if (formData.id) {
//         await axios.put(
//           `http://127.0.0.1:8000/api/items/${formData.id}/`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         Swal.fire("Updated!", "Item has been updated.", "success");
//       } else {
//         await axios.post("http://127.0.0.1:8000/api/items/", formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         Swal.fire("Created!", "Item has been created.", "success");
//       }
//       setOpen(false);
//       fetchItems();
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         err.response?.data?.shop || "Something went wrong",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setFormData({
//       id: item.id,
//       shop: item.shop,
//       item_name: item.item_name,
//       sale_price: item.sale_price,
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (confirm.isConfirmed) {
//       try {
//         await axios.delete(`http://127.0.0.1:8000/api/items/${id}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setItems(items.filter((i) => i.id !== id));
//         Swal.fire("Deleted!", "Item has been deleted.", "success");
//       } catch (err) {
//         Swal.fire("Error", "Failed to delete item", "error");
//       }
//     }
//   };

//   // ---------------- Pagination ----------------
//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // ---------------- Filter items ----------------
//   const filteredItems = items.filter((item) =>
//     item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box p={3}>
//       <Typography variant="h5" gutterBottom>
//         Items Management
//       </Typography>

//       <Box mb={2} display="flex" justifyContent="space-between">
//         <TextField
//           label="Search Item Name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Button variant="contained" color="primary" onClick={handleOpen}>
//           Add Item
//         </Button>
//       </Box>

// <TableContainer component={Paper}>
//   <Table>
//     <TableHead>
//       <TableRow sx={{ backgroundColor: "#1a3c47ff" }}>
//         <TableCell sx={{ color: "white", fontWeight: "bold" }}>Shop</TableCell>
//         <TableCell sx={{ color: "white", fontWeight: "bold" }}>Item Name</TableCell>
//         <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sale Price</TableCell>
//         <TableCell sx={{ color: "yellow", fontWeight: "bold" }}>Assigned Seller</TableCell>
//         <TableCell sx={{ color: "yellow", fontWeight: "bold" }}>Edited By</TableCell>
//         <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created At</TableCell>
//         <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {filteredItems
//         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//         .map((item) => (
//           <TableRow
//             key={item.id}
//             sx={{
//               backgroundColor: "#bcd8eeff",
//               color: "black",
//               transition: "background-color 0.3s ease",
//               "&:hover": { backgroundColor: "#FFFFE0" },
//             }}
//           >
//             <TableCell>{item.shop_name}</TableCell>
//             <TableCell>{item.item_name}</TableCell>
//             <TableCell>{item.sale_price}</TableCell>
//             <TableCell>{item.created_by_username || "-"}</TableCell>
//             <TableCell>{item.updated_by_username || "-"}</TableCell>
//             <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
//             <TableCell>
//               <IconButton onClick={() => handleEdit(item)} color="primary">
//                 <Edit />
//               </IconButton>
//               <IconButton onClick={() => handleDelete(item.id)} color="error">
//                 <Delete />
//               </IconButton>
//             </TableCell>
//           </TableRow>
//         ))}
//     </TableBody>
//   </Table>
//   <TablePagination
//     rowsPerPageOptions={[5, 10, 25]}
//     component="div"
//     count={filteredItems.length}
//     rowsPerPage={rowsPerPage}
//     page={page}
//     onPageChange={handleChangePage}
//     onRowsPerPageChange={handleChangeRowsPerPage}
//   />
// </TableContainer>


//       {/* Dialog Form */}
//       <Dialog
//         open={open}
//         onClose={(event, reason) => {
//           if (reason === "backdropClick" || reason === "escapeKeyDown") return;
//           handleClose();
//         }}
//         fullWidth
//       >
//         <DialogTitle>{formData.id ? "Edit Item" : "Add Item"}</DialogTitle>
//         <DialogContent>
//           <TextField
//             select
//             fullWidth
//             margin="dense"
//             name="shop"
//             label="Shop"
//             value={formData.shop}
//             onChange={handleChange}
//             SelectProps={{ native: true }}
//           >
//             <option value="">Select Shop</option>
//             {shops.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </TextField>

//           <TextField
//             fullWidth
//             margin="dense"
//             name="item_name"
//             label="Item Name"
//             value={formData.item_name}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             name="sale_price"
//             label="Sale Price"
//             type="number"
//             value={formData.sale_price}
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {loading ? <CircularProgress size={24} /> : "Save"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Items;










// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   CircularProgress,
//   TablePagination,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import axios from "axios";

// const Items = () => {
//   const [items, setItems] = useState([]);
//   const [shops, setShops] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     id: null,
//     shop: "",
//     item_name: "",
//     sale_price: "",
//   });
//   const [userRole, setUserRole] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const token = localStorage.getItem("access");

//   // Fetch user info
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/api/me/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserRole(res.data.role);
//         setShops(res.data.assigned_shops || []);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };
//     fetchUser();
//   }, [token]);

//   // Fetch items
//   const fetchItems = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/items/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setItems(res.data);
//     } catch (err) {
//       console.error("Error fetching items:", err);
//     }
//   };

//   useEffect(() => {
//     if (userRole) fetchItems();
//   }, [userRole]);

//   const handleOpen = () => {
//     setFormData({
//       id: null,
//       shop: shops[0]?.id || "",
//       item_name: "",
//       sale_price: "",
//     });
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!formData.shop) {
//       Swal.fire("Error", "Shop is required", "error");
//       return;
//     }
//     setLoading(true);
//     try {
//       if (formData.id) {
//         await axios.put(
//           `http://127.0.0.1:8000/api/items/${formData.id}/`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         Swal.fire("Updated!", "Item has been updated.", "success");
//       } else {
//         await axios.post("http://127.0.0.1:8000/api/items/", formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         Swal.fire("Created!", "Item has been created.", "success");
//       }
//       setOpen(false);
//       fetchItems();
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         err.response?.data?.shop || "Something went wrong",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setFormData({
//       id: item.id,
//       shop: item.shop,
//       item_name: item.item_name,
//       sale_price: item.sale_price,
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (confirm.isConfirmed) {
//       try {
//         await axios.delete(`http://127.0.0.1:8000/api/items/${id}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setItems(items.filter((i) => i.id !== id));
//         Swal.fire("Deleted!", "Item has been deleted.", "success");
//       } catch (err) {
//         Swal.fire("Error", "Failed to delete item", "error");
//       }
//     }
//   };

//   // ---------------- Pagination ----------------
//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // ---------------- Filter items ----------------
//   const filteredItems = items.filter((item) =>
//     item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box p={3}>
//       <Typography variant="h5" gutterBottom>
//         Items Management
//       </Typography>

//       <Box mb={2} display="flex" justifyContent="space-between">
//         <TextField
//           label="Search Item Name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Button variant="contained" color="primary" onClick={handleOpen}>
//           Add Item
//         </Button>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Shop</TableCell>
//               <TableCell>Item Name</TableCell>
//               <TableCell>Sale Price</TableCell>
//               <TableCell>Assigned Seller</TableCell>
//               <TableCell>Edited By</TableCell>
//               <TableCell>Created At</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredItems
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((item) => (
//                 <TableRow key={item.id}>
//                   <TableCell>{item.shop_name}</TableCell>
//                   <TableCell>{item.item_name}</TableCell>
//                   <TableCell>{item.sale_price}</TableCell>
//                   <TableCell>{item.created_by_username || "-"}</TableCell>
//                   <TableCell>{item.updated_by_username || "-"}</TableCell>
//                   <TableCell>
//                     {new Date(item.created_at).toLocaleString()}
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleEdit(item)} color="primary">
//                       <Edit />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDelete(item.id)}
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
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={filteredItems.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>

//       {/* Dialog Form */}
//       <Dialog
//         open={open}
//         onClose={(event, reason) => {
//           if (reason === "backdropClick" || reason === "escapeKeyDown") return;
//           handleClose();
//         }}
//         fullWidth
//       >
//         <DialogTitle>{formData.id ? "Edit Item" : "Add Item"}</DialogTitle>
//         <DialogContent>
//           <TextField
//             select
//             fullWidth
//             margin="dense"
//             name="shop"
//             label="Shop"
//             value={formData.shop}
//             onChange={handleChange}
//             SelectProps={{ native: true }}
//           >
//             <option value="">Select Shop</option>
//             {shops.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </TextField>

//           <TextField
//             fullWidth
//             margin="dense"
//             name="item_name"
//             label="Item Name"
//             value={formData.item_name}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             name="sale_price"
//             label="Sale Price"
//             type="number"
//             value={formData.sale_price}
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {loading ? <CircularProgress size={24} /> : "Save"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Items;









// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import axios from "axios";

// const Items = () => {
//   const [items, setItems] = useState([]);
//   const [shops, setShops] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     id: null,
//     shop: "",
//     item_name: "",
//     sale_price: "",
//   });
//   const [userRole, setUserRole] = useState(null);

//   const token = localStorage.getItem("access");

//   // Fetch user info (role + assigned shops)
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/api/me/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserRole(res.data.role);
//         setShops(res.data.assigned_shops || []);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };
//     fetchUser();
//   }, [token]);

//   // Fetch items
//   const fetchItems = async () => {
//     try {
//       const url = "http://127.0.0.1:8000/api/items/";
//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setItems(res.data);
//     } catch (err) {
//       console.error("Error fetching items:", err);
//     }
//   };

//   useEffect(() => {
//     if (userRole) fetchItems();
//   }, [userRole]);

//   const handleOpen = () => {
//     setFormData({
//       id: null,
//       shop: shops[0]?.id || "",
//       item_name: "",
//       sale_price: "",
//     });
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!formData.shop) {
//       Swal.fire("Error", "Shop is required", "error");
//       return;
//     }
//     setLoading(true);
//     try {
//       if (formData.id) {
//         await axios.put(
//           `http://127.0.0.1:8000/api/items/${formData.id}/`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         Swal.fire("Updated!", "Item has been updated.", "success");
//       } else {
//         await axios.post("http://127.0.0.1:8000/api/items/", formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         Swal.fire("Created!", "Item has been created.", "success");
//       }
//       setOpen(false);
//       fetchItems();
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         err.response?.data?.shop || "Something went wrong",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setFormData({
//       id: item.id,
//       shop: item.shop,
//       item_name: item.item_name,
//       sale_price: item.sale_price,
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (confirm.isConfirmed) {
//       try {
//         await axios.delete(`http://127.0.0.1:8000/api/items/${id}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setItems(items.filter((i) => i.id !== id));
//         Swal.fire("Deleted!", "Item has been deleted.", "success");
//       } catch (err) {
//         Swal.fire("Error", "Failed to delete item", "error");
//       }
//     }
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h5" gutterBottom>
//         Items Management
//       </Typography>

//       <Button variant="contained" color="primary" onClick={handleOpen}>
//         Add Item
//       </Button>

// <TableContainer component={Paper} sx={{ mt: 3 }}>
//   <Table>
//     <TableHead>
//       <TableRow>
//         <TableCell>Shop</TableCell>
//         <TableCell>Item Name</TableCell>
//         <TableCell>Sale Price</TableCell>
//         <TableCell>Assigned Seller</TableCell>
//         <TableCell>Edited By</TableCell>
//         <TableCell>Created At</TableCell>
//         <TableCell>Actions</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {items.map((item) => (
//         <TableRow key={item.id}>
//           <TableCell>{item.shop_name}</TableCell>
//           <TableCell>{item.item_name}</TableCell>
//           <TableCell>{item.sale_price}</TableCell>
//           <TableCell>{item.created_by_username || "-"}</TableCell>
//           <TableCell>{item.updated_by_username || "-"}</TableCell>
//           <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
//           <TableCell>
//             <IconButton onClick={() => handleEdit(item)} color="primary">
//               <Edit />
//             </IconButton>
//             <IconButton
//               onClick={() => handleDelete(item.id)}
//               color="error"
//             >
//               <Delete />
//             </IconButton>
//           </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>


//       {/* Dialog Form */}
//       {/* <Dialog open={open} onClose={handleClose} fullWidth> */}
//       <Dialog
//   open={open}
//   onClose={(event, reason) => {
//     // Prevent closing on backdrop click
//     if (reason === "backdropClick" || reason === "escapeKeyDown") return;
//     handleClose();
//   }}
//   fullWidth
// >
//         <DialogTitle>{formData.id ? "Edit Item" : "Add Item"}</DialogTitle>
//         <DialogContent>
//           <TextField
//             select
//             fullWidth
//             margin="dense"
//             name="shop"
//             label="Shop"
//             value={formData.shop}
//             onChange={handleChange}
//             SelectProps={{ native: true }}
//           >
//             <option value="">Select Shop</option>
//             {shops.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </TextField>

//           <TextField
//             fullWidth
//             margin="dense"
//             name="item_name"
//             label="Item Name"
//             value={formData.item_name}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             name="sale_price"
//             label="Sale Price"
//             type="number"
//             value={formData.sale_price}
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {loading ? <CircularProgress size={24} /> : "Save"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Items;








// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import axios from "axios";

// const Items = () => {
//   const [items, setItems] = useState([]);
//   const [shops, setShops] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     id: null,
//     shop: "",
//     item_name: "",
//     sale_price: "",
//   });
//   const [userRole, setUserRole] = useState(null);

//   const token = localStorage.getItem("access");

//   // Fetch user info (role + assigned shops)
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://127.0.0.1:8000/api/me/", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserRole(res.data.role);
//         setShops(res.data.assigned_shops || []);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };
//     fetchUser();
//   }, [token]);

//   // Fetch items
//   const fetchItems = async () => {
//     try {
//       const url = "http://127.0.0.1:8000/api/items/";
//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setItems(res.data);
//     } catch (err) {
//       console.error("Error fetching items:", err);
//     }
//   };

//   useEffect(() => {
//     if (userRole) fetchItems();
//   }, [userRole]);

//   const handleOpen = () => {
//     setFormData({
//       id: null,
//       shop: shops[0]?.id || "",
//       item_name: "",
//       sale_price: "",
//     });
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!formData.shop) {
//       Swal.fire("Error", "Shop is required", "error");
//       return;
//     }
//     setLoading(true);
//     try {
//       if (formData.id) {
//         await axios.put(
//           `http://127.0.0.1:8000/api/items/${formData.id}/`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         Swal.fire("Updated!", "Item has been updated.", "success");
//       } else {
//         await axios.post("http://127.0.0.1:8000/api/items/", formData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         Swal.fire("Created!", "Item has been created.", "success");
//       }
//       setOpen(false);
//       fetchItems();
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         err.response?.data?.shop || "Something went wrong",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setFormData({
//       id: item.id,
//       shop: item.shop,
//       item_name: item.item_name,
//       sale_price: item.sale_price,
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (confirm.isConfirmed) {
//       try {
//         await axios.delete(`http://127.0.0.1:8000/api/items/${id}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setItems(items.filter((i) => i.id !== id));
//         Swal.fire("Deleted!", "Item has been deleted.", "success");
//       } catch (err) {
//         Swal.fire("Error", "Failed to delete item", "error");
//       }
//     }
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h5" gutterBottom>
//         Items Management
//       </Typography>

//       <Button variant="contained" color="primary" onClick={handleOpen}>
//         Add Item
//       </Button>

//       <TableContainer component={Paper} sx={{ mt: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Shop</TableCell>
//               <TableCell>Item Name</TableCell>
//               <TableCell>Sale Price</TableCell>
//               <TableCell>Created At</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {items.map((item) => (
//               <TableRow key={item.id}>
//                 <TableCell>{item.shop_name}</TableCell>
//                 <TableCell>{item.item_name}</TableCell>
//                 <TableCell>{item.sale_price}</TableCell>
//                 <TableCell>
//                   {new Date(item.created_at).toLocaleString()}
//                 </TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(item)} color="primary">
//                     <Edit />
//                   </IconButton>
//                   <IconButton
//                     onClick={() => handleDelete(item.id)}
//                     color="error"
//                   >
//                     <Delete />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Dialog Form */}
//       {/* <Dialog open={open} onClose={handleClose} fullWidth> */}
//       <Dialog
//   open={open}
//   onClose={(event, reason) => {
//     // Prevent closing on backdrop click
//     if (reason === "backdropClick" || reason === "escapeKeyDown") return;
//     handleClose();
//   }}
//   fullWidth
// >
//         <DialogTitle>{formData.id ? "Edit Item" : "Add Item"}</DialogTitle>
//         <DialogContent>
//           <TextField
//             select
//             fullWidth
//             margin="dense"
//             name="shop"
//             label="Shop"
//             value={formData.shop}
//             onChange={handleChange}
//             SelectProps={{ native: true }}
//           >
//             <option value="">Select Shop</option>
//             {shops.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name}
//               </option>
//             ))}
//           </TextField>

//           <TextField
//             fullWidth
//             margin="dense"
//             name="item_name"
//             label="Item Name"
//             value={formData.item_name}
//             onChange={handleChange}
//           />
//           <TextField
//             fullWidth
//             margin="dense"
//             name="sale_price"
//             label="Sale Price"
//             type="number"
//             value={formData.sale_price}
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleSubmit} disabled={loading}>
//             {loading ? <CircularProgress size={24} /> : "Save"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Items;

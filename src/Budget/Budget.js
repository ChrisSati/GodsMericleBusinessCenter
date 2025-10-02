import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import html2pdf from "html2pdf.js";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  InputLabel,
  Select,
  FormControl,
  Fab,
  Typography
} from "@mui/material";
import { Add, Edit, Delete, Download } from "@mui/icons-material";

const API_URL = "http://127.0.0.1:8000/api/budgets/";
const SUMMARY_URL = "http://127.0.0.1:8000/api/budgets-summary/";

const recordTypes = [
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
];

const categories = ["DONATION", "PROJECT", "SALARY", "UTILITY", "OTHER"];

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: "",
    record_type: "",
    category: "",
    planned_amount: "",
    actual_amount: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterRecordType, setFilterRecordType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const token = localStorage.getItem("access");

  // Fetch budgets
  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterRecordType) params.record_type = filterRecordType;
      if (filterCategory) params.category = filterCategory;
      if (filterYear) params.year = filterYear;
      if (filterMonth) params.month = filterMonth;

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch budgets", "error");
    }
    setLoading(false);
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const params = {};
      if (filterRecordType) params.record_type = filterRecordType;
      if (filterYear) params.year = filterYear;
      if (filterMonth) params.month = filterMonth;

      const res = await axios.get(SUMMARY_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchSummary();
  }, [filterRecordType, filterCategory, filterYear, filterMonth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = (budget = null) => {
    if (budget) {
      setEditBudget(budget.id);
      setFormData({
        year: budget.year,
        month: budget.month || "",
        record_type: budget.record_type,
        category: budget.category,
        planned_amount: budget.planned_amount,
        actual_amount: budget.actual_amount,
      });
    } else {
      setEditBudget(null);
      setFormData({
        year: new Date().getFullYear(),
        month: "",
        record_type: "",
        category: "",
        planned_amount: "",
        actual_amount: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      const data = { ...formData };
      if (editBudget) {
        await axios.put(`${API_URL}${editBudget}/`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Updated!", "Budget record updated successfully", "success");
      } else {
        await axios.post(API_URL, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Added!", "Budget record added successfully", "success");
      }
      fetchBudgets();
      fetchSummary();
      handleClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save budget record", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the budget record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", "Budget record has been deleted.", "success");
          fetchBudgets();
          fetchSummary();
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to delete budget record", "error");
        }
      }
    });
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // PDF download handler
  const downloadPDF = async () => {
    if (!filterYear) {
      Swal.fire("Select Year", "Please select a year before downloading PDF", "info");
      return;
    }

    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year: filterYear },
      });

      const allBudgetsForYear = res.data;

      if (!allBudgetsForYear.length) {
        Swal.fire("No Data", "No budget records found for this year", "info");
        return;
      }

      const pdfContainer = document.createElement("div");
      pdfContainer.style.padding = "20px";
      pdfContainer.innerHTML = `
        <h2 style="text-align:center; margin-bottom:20px;">Church Budget Report</h2>
        <h4 style="text-align:center; margin-bottom:20px;">Year: ${filterYear}</h4>
        <table style="width:100%; border-collapse: collapse; font-family: Arial, sans-serif;">
          <thead>
            <tr style="background-color:#1976d2; color:white;">
              <th style="border:1px solid #ccc; padding:8px;">Year</th>
              <th style="border:1px solid #ccc; padding:8px;">Month</th>
              <th style="border:1px solid #ccc; padding:8px;">Record Type</th>
              <th style="border:1px solid #ccc; padding:8px;">Category</th>
              <th style="border:1px solid #ccc; padding:8px;">Planned</th>
              <th style="border:1px solid #ccc; padding:8px;">Actual</th>
              <th style="border:1px solid #ccc; padding:8px;">Variance</th>
            </tr>
          </thead>
          <tbody>
            ${allBudgetsForYear
              .map(
                (b, idx) => `
              <tr style="background-color:${idx % 2 === 0 ? "#f5f5f5" : "white"};">
                <td style="border:1px solid #ccc; padding:8px;">${b.year}</td>
                <td style="border:1px solid #ccc; padding:8px;">${b.month || "Yearly"}</td>
                <td style="border:1px solid #ccc; padding:8px;">${b.record_type}</td>
                <td style="border:1px solid #ccc; padding:8px;">${b.category}</td>
                <td style="border:1px solid #ccc; padding:8px;">${b.planned_amount}</td>
                <td style="border:1px solid #ccc; padding:8px;">${b.actual_amount}</td>
                <td style="border:1px solid #ccc; padding:8px;">${(b.planned_amount - b.actual_amount).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;

      const opt = {
        margin: 10,
        filename: `Church_Budget_${filterYear}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };

      html2pdf().set(opt).from(pdfContainer).save();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to download PDF", "error");
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Church Budget</Typography>

      {/* Filters */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={2} alignItems="center">
        <FormControl sx={{ minWidth: 130 }}>
          <InputLabel>Year</InputLabel>
          <Select value={filterYear} label="Year" onChange={(e) => setFilterYear(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {[...Array(10)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <MenuItem key={year} value={year}>{year}</MenuItem>;
            })}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 130 }}>
          <InputLabel>Month</InputLabel>
          <Select value={filterMonth} label="Month" onChange={(e) => setFilterMonth(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 130 }}>
          <InputLabel>Record Type</InputLabel>
          <Select value={filterRecordType} label="Record Type" onChange={(e) => setFilterRecordType(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {recordTypes.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 130 }}>
          <InputLabel>Category</InputLabel>
          <Select value={filterCategory} label="Category" onChange={(e) => setFilterCategory(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>

        <Fab color="primary" aria-label="add" sx={{ ml: "auto" }} onClick={() => handleOpen()}>
          <Add />
        </Fab>

        <Fab color="secondary" aria-label="download" onClick={downloadPDF}>
          <Download />
        </Fab>
      </Box>

      {/* Totals */}
      <Box display="flex" gap={4} mb={2} flexWrap="wrap">
        {summary.map((s) => (
          <Box key={s.record_type} p={2} sx={{ backgroundColor: "#f0f0f0", borderRadius: 2 }}>
            <Typography variant="subtitle1">{s.record_type}</Typography>
            <Typography>Planned: {s.total_planned}</Typography>
            <Typography>Actual: {s.total_actual}</Typography>
          </Box>
        ))}
      </Box>

      {loading ? (
        <Box textAlign="center" mt={5}><CircularProgress /></Box>
      ) : (
        <>
          {/* Budget Table */}
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  {/* <TableRow sx={{ backgroundColor: "#1976d2", "& th": { color: "white" } }}> */}
                  <TableRow sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
                    <TableCell>Year</TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Record Type</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Planned</TableCell>
                    <TableCell>Actual</TableCell>
                    <TableCell>Variance</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {budgets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((b) => (
                    <TableRow key={b.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell>{b.year}</TableCell>
                      <TableCell>{b.month || "Yearly"}</TableCell>
                      <TableCell>{b.record_type}</TableCell>
                      <TableCell>{b.category}</TableCell>
                      <TableCell>{b.planned_amount}</TableCell>
                      <TableCell>{b.actual_amount}</TableCell>
                      <TableCell>{(b.planned_amount - b.actual_amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpen(b)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(b.id)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <TablePagination
            component="div"
            count={budgets.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Add/Edit Popup */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editBudget ? "Edit Budget" : "Add Budget"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Year" type="number" name="year" value={formData.year} onChange={handleChange} />
          <TextField label="Month (optional)" type="number" name="month" value={formData.month} onChange={handleChange} />
          <FormControl fullWidth>
            <InputLabel>Record Type</InputLabel>
            <Select name="record_type" value={formData.record_type} onChange={handleChange}>
              {recordTypes.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select name="category" value={formData.category} onChange={handleChange}>
              {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Planned Amount" type="number" name="planned_amount" value={formData.planned_amount} onChange={handleChange} />
          <TextField label="Actual Amount" type="number" name="actual_amount" value={formData.actual_amount} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={handleSubmit}>{editBudget ? "Update" : "Add"}</Button>
          <Button color="secondary" variant="outlined" onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Budget;









// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   IconButton,
//   CircularProgress,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   Paper,
//   TablePagination,
//   InputLabel,
//   Select,
//   FormControl,
//   Fab,
//   Typography
// } from "@mui/material";
// import { Add, Edit, Delete } from "@mui/icons-material";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// const API_URL = "http://127.0.0.1:8000/api/budgets/";
// const SUMMARY_URL = "http://127.0.0.1:8000/api/budgets-summary/";

// const recordTypes = [
//   { value: "INCOME", label: "Income" },
//   { value: "EXPENSE", label: "Expense" },
// ];

// const categories = ["DONATION", "PROJECT", "SALARY", "UTILITY", "OTHER"];

// const Budget = () => {
//   const [budgets, setBudgets] = useState([]);
//   const [summary, setSummary] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [editBudget, setEditBudget] = useState(null);
//   const [formData, setFormData] = useState({
//     year: new Date().getFullYear(),
//     month: "",
//     record_type: "",
//     category: "",
//     planned_amount: "",
//     actual_amount: "",
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [filterRecordType, setFilterRecordType] = useState("");
//   const [filterCategory, setFilterCategory] = useState("");
//   const [filterYear, setFilterYear] = useState("");
//   const [filterMonth, setFilterMonth] = useState("");

//   const token = localStorage.getItem("access");

//   // Fetch budgets
//   const fetchBudgets = async () => {
//     setLoading(true);
//     try {
//       const params = {};
//       if (filterRecordType) params.record_type = filterRecordType;
//       if (filterCategory) params.category = filterCategory;
//       if (filterYear) params.year = filterYear;
//       if (filterMonth) params.month = filterMonth;

//       const res = await axios.get(API_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });
//       setBudgets(res.data);
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Failed to fetch budgets", "error");
//     }
//     setLoading(false);
//   };

//   // Fetch summary (total planned vs actual)
//   const fetchSummary = async () => {
//     try {
//       const params = {};
//       if (filterRecordType) params.record_type = filterRecordType;
//       if (filterYear) params.year = filterYear;
//       if (filterMonth) params.month = filterMonth;

//       const res = await axios.get(SUMMARY_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });
//       setSummary(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchBudgets();
//     fetchSummary();
//   }, [filterRecordType, filterCategory, filterYear, filterMonth]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleOpen = (budget = null) => {
//     if (budget) {
//       setEditBudget(budget.id);
//       setFormData({
//         year: budget.year,
//         month: budget.month || "",
//         record_type: budget.record_type,
//         category: budget.category,
//         planned_amount: budget.planned_amount,
//         actual_amount: budget.actual_amount,
//       });
//     } else {
//       setEditBudget(null);
//       setFormData({
//         year: new Date().getFullYear(),
//         month: "",
//         record_type: "",
//         category: "",
//         planned_amount: "",
//         actual_amount: "",
//       });
//     }
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleSubmit = async () => {
//     try {
//       const data = { ...formData };
//       if (editBudget) {
//         await axios.put(`${API_URL}${editBudget}/`, data, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         Swal.fire("Updated!", "Budget record updated successfully", "success");
//       } else {
//         await axios.post(API_URL, data, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         Swal.fire("Added!", "Budget record added successfully", "success");
//       }
//       fetchBudgets();
//       fetchSummary();
//       handleClose();
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Failed to save budget record", "error");
//     }
//   };

//   const handleDelete = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This will delete the budget record!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`${API_URL}${id}/`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           Swal.fire("Deleted!", "Budget record has been deleted.", "success");
//           fetchBudgets();
//           fetchSummary();
//         } catch (err) {
//           console.error(err);
//           Swal.fire("Error", "Failed to delete budget record", "error");
//         }
//       }
//     });
//   };

//   // Pagination handlers
//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   // Prepare chart data
//   const chartData = budgets.map((b) => ({
//     name: `${b.category} (${b.record_type})`,
//     Planned: parseFloat(b.planned_amount),
//     Actual: parseFloat(b.actual_amount),
//   }));

//   return (
//     <Box p={2}>
//       <Typography variant="h5" mb={2}>Church Budget</Typography>
      
//       {/* Filters */}
//       <Box display="flex" flexWrap="wrap" gap={2} mb={2} alignItems="center">
//         <FormControl sx={{ minWidth: 130 }}>
//           <InputLabel>Year</InputLabel>
//           <Select value={filterYear} label="Year" onChange={(e) => setFilterYear(e.target.value)}>
//             <MenuItem value="">All</MenuItem>
//             {[...Array(10)].map((_, i) => {
//               const year = new Date().getFullYear() - i;
//               return <MenuItem key={year} value={year}>{year}</MenuItem>;
//             })}
//           </Select>
//         </FormControl>

//         <FormControl sx={{ minWidth: 130 }}>
//           <InputLabel>Month</InputLabel>
//           <Select value={filterMonth} label="Month" onChange={(e) => setFilterMonth(e.target.value)}>
//             <MenuItem value="">All</MenuItem>
//             {[...Array(12)].map((_, i) => (
//               <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <FormControl sx={{ minWidth: 130 }}>
//           <InputLabel>Record Type</InputLabel>
//           <Select value={filterRecordType} label="Record Type" onChange={(e) => setFilterRecordType(e.target.value)}>
//             <MenuItem value="">All</MenuItem>
//             {recordTypes.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
//           </Select>
//         </FormControl>

//         <FormControl sx={{ minWidth: 130 }}>
//           <InputLabel>Category</InputLabel>
//           <Select value={filterCategory} label="Category" onChange={(e) => setFilterCategory(e.target.value)}>
//             <MenuItem value="">All</MenuItem>
//             {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
//           </Select>
//         </FormControl>

//         <Fab color="primary" aria-label="add" sx={{ ml: "auto" }} onClick={() => handleOpen()}>
//           <Add />
//         </Fab>
//       </Box>

//       {/* Totals */}
//       <Box display="flex" gap={4} mb={2} flexWrap="wrap">
//         {summary.map((s) => (
//           <Box key={s.record_type} p={2} sx={{ backgroundColor: "#f0f0f0", borderRadius: 2 }}>
//             <Typography variant="subtitle1">{s.record_type}</Typography>
//             <Typography>Planned: {s.total_planned}</Typography>
//             <Typography>Actual: {s.total_actual}</Typography>
//           </Box>
//         ))}
//       </Box>

//       {loading ? (
//         <Box textAlign="center" mt={5}><CircularProgress /></Box>
//       ) : (
//         <>
//           {/* Budget Table */}
//           <Box sx={{ overflowX: "auto" }}>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#555", "& th": { color: "white" } }}>
//                   <TableCell>Year</TableCell>
//                   <TableCell>Month</TableCell>
//                   <TableCell>Record Type</TableCell>
//                   <TableCell>Category</TableCell>
//                   <TableCell>Planned</TableCell>
//                   <TableCell>Actual</TableCell>
//                   <TableCell>Variance</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {budgets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((b) => (
//                   <TableRow key={b.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
//                     <TableCell>{b.year}</TableCell>
//                     <TableCell>{b.month || "Yearly"}</TableCell>
//                     <TableCell>{b.record_type}</TableCell>
//                     <TableCell>{b.category}</TableCell>
//                     <TableCell>{b.planned_amount}</TableCell>
//                     <TableCell>{b.actual_amount}</TableCell>
//                     <TableCell>{(b.planned_amount - b.actual_amount).toFixed(2)}</TableCell>
//                     <TableCell>
//                       <IconButton color="primary" onClick={() => handleOpen(b)}><Edit /></IconButton>
//                       <IconButton color="error" onClick={() => handleDelete(b.id)}><Delete /></IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           </Box>

//           <TablePagination
//             component="div"
//             count={budgets.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </>
//       )}

//       {/* Add/Edit Popup */}
//       <Dialog open={open} onClose={() => {}} fullWidth maxWidth="sm">
//         <DialogTitle>{editBudget ? "Edit Budget" : "Add Budget"}</DialogTitle>
//         <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//           <TextField label="Year" type="number" name="year" value={formData.year} onChange={handleChange} />
//           <TextField label="Month (optional)" type="number" name="month" value={formData.month} onChange={handleChange} />
//           <FormControl fullWidth>
//             <InputLabel>Record Type</InputLabel>
//             <Select name="record_type" value={formData.record_type} onChange={handleChange}>
//               {recordTypes.map((r) => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth>
//             <InputLabel>Category</InputLabel>
//             <Select name="category" value={formData.category} onChange={handleChange}>
//               {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
//             </Select>
//           </FormControl>
//           <TextField label="Planned Amount" type="number" name="planned_amount" value={formData.planned_amount} onChange={handleChange} />
//           <TextField label="Actual Amount" type="number" name="actual_amount" value={formData.actual_amount} onChange={handleChange} />
//         </DialogContent>
//         <DialogActions>
//           <Button color="primary" variant="contained" onClick={handleSubmit}>{editBudget ? "Update" : "Add"}</Button>
//           <Button color="secondary" variant="outlined" onClick={handleClose}>Cancel</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bar Chart */}
//       <Box mt={5} height={400}>
//         {/* <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="Planned" fill="#8884d8" />
//             <Bar dataKey="Actual" fill="#82ca9d" />
//           </BarChart>
//         </ResponsiveContainer> */}
//       </Box>
//     </Box>
//   );
// };

// export default Budget;

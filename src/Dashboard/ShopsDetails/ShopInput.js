import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";

export default function ShopInput({ open, handleClose, shops, onSubmit, editingRecord }) {
  const [formData, setFormData] = useState({
    shop: "",
    sales_date: "",
    notes: "",
    total_sales: 0,
    total_items_sold: 0,
  });

  const token = localStorage.getItem("access");

  // Reset or load editing data
  useEffect(() => {
    if (editingRecord) {
      setFormData({
        shop: editingRecord.shop || "",
        sales_date: editingRecord.sales_date || "",
        notes: editingRecord.notes || "",
        total_sales: editingRecord.total_sales || 0,
        total_items_sold: editingRecord.total_items_sold || 0,
      });
    } else {
      setFormData({
        shop: "",
        sales_date: "",
        notes: "",
        total_sales: 0,
        total_items_sold: 0,
      });
    }
  }, [editingRecord]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Auto-fetch totals when shop + sales_date are selected
  useEffect(() => {
    const fetchTotals = async () => {
      if (formData.shop && formData.sales_date) {
        try {
          const res = await axios.get("http://127.0.0.1:8000/api/daily-sales/", {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              shop: formData.shop,
              sales_date: formData.sales_date,
            },
          });

          // If a record exists, show totals
          if (res.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              total_sales: res.data[0].total_sales,
              total_items_sold: res.data[0].total_items_sold,
            }));
          } else {
            // Reset to zero if no record exists
            setFormData((prev) => ({
              ...prev,
              total_sales: 0,
              total_items_sold: 0,
            }));
          }
        } catch (error) {
          console.error("Error fetching totals:", error);
        }
      }
    };

    fetchTotals();
  }, [formData.shop, formData.sales_date, token]);

  const handleSubmit = () => {
    // Send only editable fields, ignore totals
    const payload = {
      shop: formData.shop,
      sales_date: formData.sales_date,
      notes: formData.notes,
    };

    onSubmit(payload, editingRecord?.id || null);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingRecord ? "Edit Sales Record" : "Add Sales Record"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              select
              label="Shop"
              name="shop"
              fullWidth
              value={formData.shop}
              onChange={handleChange}
            >
              {shops.map((shop) => (
                <MenuItem key={shop.id} value={shop.id}>
                  {shop.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Sales Date"
              type="date"
              name="sales_date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.sales_date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              name="notes"
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>


      </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingRecord ? "Update" : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}



// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
//   Grid,
// } from "@mui/material";

// export default function ShopInput({ open, handleClose, shops, onSubmit, editingRecord }) {
//   const [formData, setFormData] = useState({
//     shop: "",
//     sales_date: "",
//     notes: "",
//     total_sales: 0,
//     total_items_sold: 0,
//   });

//   // Reset or load editing data
//   useEffect(() => {
//     if (editingRecord) {
//       setFormData({
//         shop: editingRecord.shop || "",
//         sales_date: editingRecord.sales_date || "",
//         notes: editingRecord.notes || "",
//         total_sales: editingRecord.total_sales || 0,
//         total_items_sold: editingRecord.total_items_sold || 0,
//       });
//     } else {
//       setFormData({
//         shop: "",
//         sales_date: "",
//         notes: "",
//         total_sales: 0,
//         total_items_sold: 0,
//       });
//     }
//   }, [editingRecord]);

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // Example: Auto-calculate totals (replace with real logic if you add items/quantities)
//   useEffect(() => {
//     // Placeholder: if you later add sales items, calculate properly here.
//     // For now, just ensure it's always numeric and displayed.
//     const totalSales = Number(formData.total_sales) || 0;
//     const totalItems = Number(formData.total_items_sold) || 0;

//     setFormData((prev) => ({
//       ...prev,
//       total_sales: totalSales,
//       total_items_sold: totalItems,
//     }));
//   }, [formData.total_sales, formData.total_items_sold]);

//   const handleSubmit = () => {
//     // Send only editable fields, ignore read-only totals
//     const payload = {
//       shop: formData.shop,
//       sales_date: formData.sales_date,
//       notes: formData.notes,
//     };

//     onSubmit(payload, editingRecord?.id || null);
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//       <DialogTitle>{editingRecord ? "Edit Sales Record" : "Add Sales Record"}</DialogTitle>
//       <DialogContent dividers>
//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           <Grid item xs={12}>
//             <TextField
//               select
//               label="Shop"
//               name="shop"
//               fullWidth
//               value={formData.shop}
//               onChange={handleChange}
//             >
//               {shops.map((shop) => (
//                 <MenuItem key={shop.id} value={shop.id}>
//                   {shop.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Sales Date"
//               type="date"
//               name="sales_date"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               value={formData.sales_date}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Notes"
//               name="notes"
//               fullWidth
//               multiline
//               rows={3}
//               value={formData.notes}
//               onChange={handleChange}
//             />
//           </Grid>

//           {/* Read-only auto-filled totals */}
//           <Grid item xs={6}>
//             <TextField
//               label="Total Sales"
//               value={formData.total_sales}
//               fullWidth
//               InputProps={{ readOnly: true }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Total Items Sold"
//               value={formData.total_items_sold}
//               fullWidth
//               InputProps={{ readOnly: true }}
//             />
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} color="secondary">
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} variant="contained" color="primary">
//           {editingRecord ? "Update" : "Submit"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   CircularProgress,
//   MenuItem,
// } from "@mui/material";

// export default function ShopInput({ open, handleClose, shops, onSubmit, editingRecord }) {
//   const [form, setForm] = useState({
//     shop: "",
//     sales_date: "",
//     total_sales: "",
//     total_items_sold: "",
//     notes: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const token = localStorage.getItem("access");

//   // Initialize form for editing or new
//   useEffect(() => {
//     if (editingRecord) {
//       setForm({
//         shop: editingRecord.shop,
//         sales_date: editingRecord.sales_date,
//         total_sales: editingRecord.total_sales,
//         total_items_sold: editingRecord.total_items_sold,
//         notes: editingRecord.notes,
//       });
//     } else {
//       setForm({
//         shop: "",
//         sales_date: "",
//         total_sales: "",
//         total_items_sold: "",
//         notes: "",
//       });
//     }
//   }, [editingRecord]);

//   // Auto-fill totals when shop or date changes
//   useEffect(() => {
//     const fetchTotals = async () => {
//       if (form.shop && form.sales_date) {
//         try {
//           const res = await axios.post(
//             "http://127.0.0.1:8000/api/daily-sales/calculate/",
//             {
//               shop: form.shop,
//               sales_date: form.sales_date,
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           setForm(prev => ({
//             ...prev,
//             total_sales: res.data.total_sales,
//             total_items_sold: res.data.total_items_sold,
//           }));
//         } catch (err) {
//           console.error(err);
//           setForm(prev => ({
//             ...prev,
//             total_sales: 0,
//             total_items_sold: 0,
//           }));
//         }
//       } else {
//         setForm(prev => ({
//           ...prev,
//           total_sales: "",
//           total_items_sold: "",
//         }));
//       }
//     };

//     fetchTotals();
//   }, [form.shop, form.sales_date]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     await onSubmit(form, editingRecord ? editingRecord.id : null);
//     setLoading(false);
//     handleClose();
//     setForm({
//       shop: "",
//       sales_date: "",
//       total_sales: "",
//       total_items_sold: "",
//       notes: "",
//     });
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//       <DialogTitle>{editingRecord ? "Edit Daily Sales Record" : "Add Daily Sales Record"}</DialogTitle>
//       <DialogContent>
//         <TextField
//           select
//           name="shop"
//           label="Select Shop"
//           fullWidth
//           margin="normal"
//           value={form.shop}
//           onChange={handleChange}
//         >
//           {shops.map(shop => (
//             <MenuItem key={shop.id} value={shop.id}>
//               {shop.name}
//             </MenuItem>
//           ))}
//         </TextField>

//         <TextField
//           name="sales_date"
//           label="Sales Date"
//           type="date"
//           fullWidth
//           margin="normal"
//           InputLabelProps={{ shrink: true }}
//           value={form.sales_date}
//           onChange={handleChange}
//         />

//         <TextField
//           name="total_sales"
//           label="Total Sales"
//           type="number"
//           fullWidth
//           margin="normal"
//           value={form.total_sales}
//           InputProps={{ readOnly: true }}
//         />

//         <TextField
//           name="total_items_sold"
//           label="Total Items Sold"
//           type="number"
//           fullWidth
//           margin="normal"
//           value={form.total_items_sold}
//           InputProps={{ readOnly: true }}
//         />

//         <TextField
//           name="notes"
//           label="Notes"
//           fullWidth
//           margin="normal"
//           multiline
//           rows={3}
//           value={form.notes}
//           onChange={handleChange}
//         />
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={handleClose} color="error">
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           disabled={loading || !form.shop || !form.sales_date}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : editingRecord ? "Update" : "Submit"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }





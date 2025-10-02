import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import html2pdf from "html2pdf.js";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material";

const SalesRecordItem = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef();

  // Fetch SalesRecordItem data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://127.0.0.1:8000/api/sales-record-items/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
        Swal.fire("Error", "Could not fetch sales records", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Download PDF
  const downloadPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.5,
      filename: "sales_record_items.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
        Sales Record Items
      </Typography>

      {loading ? (
        <CircularProgress sx={{ marginTop: 4 }} />
      ) : (
        <Paper
          ref={pdfRef}
          sx={{
            width: "100%",
            maxWidth: "1000px",
            padding: 3,
            boxShadow: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdf />}
              onClick={downloadPDF}
            >
              Download PDF
            </Button>
          </Box>

          <Table>
            <TableHead sx={{ backgroundColor: "#2f3e46" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Shop</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Item</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Cost</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Quantity</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>{record.sales_record.sales_date}</TableCell>
                  <TableCell>{record.sales_record.shop.name}</TableCell>
                  <TableCell>{record.item.name}</TableCell>
                  <TableCell>${record.item.cost}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#006d77" }}>
                    ${record.subtotal}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default SalesRecordItem;

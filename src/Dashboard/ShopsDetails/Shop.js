import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Chip, Button,
} from "@mui/material";
import { styled } from "@mui/system";
import html2pdf from "html2pdf.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import './table.css'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StyledCard = styled(Card)({
  position: "relative",
  cursor: "pointer",
  overflow: "hidden",
  width: "100%",
  maxWidth: 300,
  height: 250,
  margin: "auto",
  "&:hover .cardContent": {
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transform: "translate(-50%, -50%)",
    transition: "all 0.5s ease",
  },
  "&:hover img": {
    transform: "scale(1.05)",
    transition: "all 0.5s ease",
  },
});

const StyledCardContent = styled(CardContent)({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "auto",
  backgroundColor: "rgba(13,26,51,0.7)",
  color: "#fff",
  padding: "8px",
  transition: "all 0.5s ease",
  textAlign: "left",
  "& .totalSales": {
    color: "yellow",
    fontWeight: "bold",
  },
  "& .badge": {
    marginTop: "2px",
    marginRight: "4px",
    fontWeight: "bold",
    color: "#000",
  },
});

export default function Shop() {
  const [shops, setShops] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");

        // Fetch shops
        const shopsRes = await axios.get("http://127.0.0.1:8000/api/shops/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch all items
        const itemsRes = await axios.get("http://127.0.0.1:8000/api/items/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allShops = shopsRes.data;
        const allItems = itemsRes.data;

        const shopsWithTotals = allShops.map((shop) => {
          const shopItems = allItems.filter(
            (item) => item.shop === shop.id || item.shop?.id === shop.id
          );

          const totalSales = shopItems.reduce(
            (sum, item) => sum + (parseFloat(item.sale_price) || 0),
            0
          );

          const lastInputItem = shopItems.reduce((latest, item) => {
            const itemDate = new Date(item.created_at);
            return !latest || itemDate > new Date(latest.created_at)
              ? item
              : latest;
          }, null);

          const today = new Date();
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();

          // Total Sales Today (TST)
          const totalSalesToday = shopItems
            .filter((item) => {
              const itemDate = new Date(item.created_at);
              return (
                itemDate.getDate() === today.getDate() &&
                itemDate.getMonth() === today.getMonth() &&
                itemDate.getFullYear() === today.getFullYear()
              );
            })
            .reduce((sum, item) => sum + (parseFloat(item.sale_price) || 0), 0);

          // Total Sales This Month (TSTM)
          const totalSalesMonth = shopItems
            .filter((item) => {
              const itemDate = new Date(item.created_at);
              return (
                itemDate.getMonth() === currentMonth &&
                itemDate.getFullYear() === currentYear
              );
            })
            .reduce((sum, item) => sum + (parseFloat(item.sale_price) || 0), 0);

          return {
            ...shop,
            income: totalSales,
            last_input: lastInputItem
              ? new Date(lastInputItem.created_at).toLocaleString()
              : "No record",
            totalSalesToday,
            totalSalesMonth,
          };
        });

        setShops(shopsWithTotals);
        setAllItems(allItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    // Chart Data
  const chartData = {
    labels: shops.map((shop) => shop.name),
    datasets: [
      {
        label: "Total Sales ($)",
        data: shops.map((shop) => shop.income),
        backgroundColor: [
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#f6c23e",
          "#e74a3b",
          "#858796",
        ],
        borderRadius: 8,
      },
    ],
  };

  // Download PDF
  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.5,
      filename: "Shops_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading)
    return (
      <Box textAlign="center" sx={{ mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <br/>
       <Box textAlign="right" sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
          Download Shops Data
        </Button>
      </Box>
            <div ref={pdfRef} style={{ padding: "20px", backgroundColor: "#fff" }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, fontWeight: "bold", color: "#0d1a33" }}
        >
          Shops Sales Report
        </Typography>

        {/* Modern Styled Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "30px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#0d1a33", color: "#fff" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Shop Name</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Address</th>
              <th style={{ padding: "10px", textAlign: "right" }}>
                Total Sales ($)
              </th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop, index) => (
              <tr
                key={shop.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td style={{ padding: "8px" }}>{shop.name}</td>
                <td style={{ padding: "8px" }}>{shop.address}</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  {(shop.income ?? 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bar Chart */}
<Box className="chart-container">
  <Bar
    data={chartData}
    options={{
      responsive: true,          // makes chart responsive
      maintainAspectRatio: false, // allows chart to fill container height
      plugins: {
        legend: { display: true, position: "bottom" },
        title: { display: true, text: "Sales Analysis Per Shop" },
      },
      scales: {
        x: { ticks: { autoSkip: false } }, 
      },
    }}
  /> 
</Box>
      </div>
    <Box sx={{ mt: { xs: 8, sm: 10, md: 12 }, px: { xs: 2, sm: 3, md: 5 } }}>
      <Grid container spacing={3} justifyContent="center">
        {shops.map((shop) => (
          <Grid item xs={12} sm={6} md={3} key={shop.id}>
            <StyledCard>
              {shop.image && (
                <CardMedia
                  component="img"
                  image={shop.image}
                  alt={shop.name}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              <StyledCardContent className="cardContent">
                <Typography variant="subtitle2" sx={{ fontSize: "0.9rem" }}>
                  {shop.name}
                </Typography>
                <Typography variant="caption" display="block" sx={{ fontSize: "0.75rem" }}>
                  {shop.address}
                </Typography>
                <Typography className="totalSales" sx={{ mt: 0.5 }}>
                  Total Sales: ${shop.income.toLocaleString()}
                </Typography>
                <Typography variant="caption" display="block">
                  Last Input: {shop.last_input}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={`TST: $${shop.totalSalesToday.toLocaleString()}`}
                    color="success"
                    size="small"
                    className="badge"
                  />
                  <Chip
                    label={`TSTM: $${shop.totalSalesMonth.toLocaleString()}`}
                    color="warning"
                    size="small"
                    className="badge"
                  />
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
  );
}



import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// Colors
const COLORS = ["#82ca9d", "#8884d8", "#ffc658", "#ff7f50", "#a569bd", "#f39c12"];
const CARD_COLORS = [
  "#e0f7fa",
  "#f1f8e9",
  "#fff3e0",
  "#fce4ec",
  "#ede7f6",
  "#fff8e1",
  "#e8f5e9", // new color for Balance card
];

// Styled card
const StyledCard = styled(Card)(({ bgcolor }) => ({
  backgroundColor: bgcolor,
  minHeight: 120,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  borderRadius: 12,
  boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
}));

export default function ShopDataAnalysic() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/shop-finance-summary/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ✅ Calculate Balance
  const balance =
    data.total_sales - (data.total_transport_cost + data.total_expenditures);

  // Prepare chart data
  const pieData = [
    { name: "Total Lease", value: data.total_monthly_rent },
    { name: "Total LAP", value: data.total_payments },
    { name: "Expenditures", value: data.total_expenditures },
    { name: "Transport Cost", value: data.total_transport_cost },
    { name: "Total Sales", value: data.total_sales },
    { name: "Items Sold", value: data.total_items_sold },
    { name: "Balance", value: balance },
  ];

  const barData = [
    {
      name: "Finance Summary",
      Rent: data.total_monthly_rent,
      Payments: data.total_payments,
      Expenditures: data.total_expenditures,
      Cost: data.total_transport_cost,
      Sales: data.total_sales,
      Items: data.total_items_sold,
      Balance: balance,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        px: 2,
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 1200, width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          Shop Finance Analytics
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: "center" }}>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard bgcolor={CARD_COLORS[0]}>
              <CardContent>
                <Typography variant="subtitle1">Total Lease</Typography>
                <Typography variant="h6">${data.total_monthly_rent}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard bgcolor={CARD_COLORS[1]}>
              <CardContent>
                <Typography variant="subtitle1">Total LAP</Typography>
                <Typography variant="h6">${data.total_payments}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard bgcolor={CARD_COLORS[2]}>
              <CardContent>
                <Typography variant="subtitle1">Expenditures</Typography>
                <Typography variant="h6">${data.total_expenditures}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard bgcolor={CARD_COLORS[3]}>
              <CardContent>
                <Typography variant="subtitle1">Transport Cost</Typography>
                <Typography variant="h6">${data.total_transport_cost}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard bgcolor={CARD_COLORS[4]}>
              <CardContent>
                <Typography variant="subtitle1">Total Sales</Typography>
                <Typography variant="h6">${data.total_sales}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard bgcolor={CARD_COLORS[5]}>
              <CardContent>
                <Typography variant="subtitle1">Items Sold</Typography>
                <Typography variant="h6">{data.total_items_sold}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          {/* ✅ Balance Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard bgcolor={CARD_COLORS[6]}>
              <CardContent>
                <Typography variant="subtitle1">Balance</Typography>
                <Typography variant="h6">${balance}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                Finance Distribution (Donut Chart)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                Finance Comparison (Bar Chart)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Rent" fill={COLORS[0]} />
                  <Bar dataKey="Payments" fill={COLORS[1]} />
                  <Bar dataKey="Expenditures" fill={COLORS[2]} />
                  <Bar dataKey="Cost" fill={COLORS[3]} />
                  <Bar dataKey="Sales" fill={COLORS[4]} />
                  <Bar dataKey="Items" fill={COLORS[5]} />
                  <Bar dataKey="Balance" fill={COLORS[6]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
// } from "recharts";

// // Colors
// const COLORS = ["#82ca9d", "#8884d8", "#ffc658", "#ff7f50", "#a569bd", "#f39c12"];
// const CARD_COLORS = ["#e0f7fa", "#f1f8e9", "#fff3e0", "#fce4ec", "#ede7f6", "#fff8e1"];

// // Styled card
// const StyledCard = styled(Card)(({ bgcolor }) => ({
//   backgroundColor: bgcolor,
//   minHeight: 120,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   textAlign: "center",
//   borderRadius: 12,
//   boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
// }));

// export default function ShopDataAnalysic() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:8000/api/shop-finance-summary/", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
//       })
//       .then((res) => {
//         setData(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // Prepare chart data
//   const pieData = [
//     { name: "Total Lease", value: data.total_monthly_rent },
//     { name: "Total LAP", value: data.total_payments },
//     { name: "Expenditures", value: data.total_expenditures },
//     { name: "Transport Cost", value: data.total_transport_cost },
//     { name: "Total Sales", value: data.total_sales },
//     { name: "Items Sold", value: data.total_items_sold },
//   ];

//   const barData = [
//     {
//       name: "Finance Summary",
//       Rent: data.total_monthly_rent,
//       Payments: data.total_payments,
//       Expenditures: data.total_expenditures,
//       Cost: data.total_transport_cost,
//       Sales: data.total_sales,
//       Items: data.total_items_sold,
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "100vh",
//         width: "100%",
//         px: 2,
//         boxSizing: "border-box",
//         overflowX: "hidden",
//       }}
//     >
//       <Box sx={{ maxWidth: 1200, width: "100%" }}>
//         <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
//           Shop Finance Analytics
//         </Typography>

//         {/* Summary Cards */}
//         <Grid container spacing={3} sx={{ mb: 4, justifyContent: "center" }}>
//           <Grid item xs={12} sm={6} md={3}>
//             <StyledCard bgcolor={CARD_COLORS[0]}>
//               <CardContent>
//                 <Typography variant="subtitle1">Total Lease</Typography>
//                 <Typography variant="h6">${data.total_monthly_rent}</Typography>
//               </CardContent>
//             </StyledCard>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StyledCard bgcolor={CARD_COLORS[1]}>
//               <CardContent>
//                 <Typography variant="subtitle1">Total LAP</Typography>
//                 <Typography variant="h6">${data.total_payments}</Typography>
//               </CardContent>
//             </StyledCard>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StyledCard bgcolor={CARD_COLORS[2]}>
//               <CardContent>
//                 <Typography variant="subtitle1">Expenditures</Typography>
//                 <Typography variant="h6">${data.total_expenditures}</Typography>
//               </CardContent>
//             </StyledCard>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StyledCard bgcolor={CARD_COLORS[3]}>
//               <CardContent>
//                 <Typography variant="subtitle1">Transport Cost</Typography>
//                 <Typography variant="h6">${data.total_transport_cost}</Typography>
//               </CardContent>
//             </StyledCard>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StyledCard bgcolor={CARD_COLORS[4]}>
//               <CardContent>
//                 <Typography variant="subtitle1">Total Sales</Typography>
//                 <Typography variant="h6">${data.total_sales}</Typography>
//               </CardContent>
//             </StyledCard>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StyledCard bgcolor={CARD_COLORS[5]}>
//               <CardContent>
//                 <Typography variant="subtitle1">Items Sold</Typography>
//                 <Typography variant="h6">{data.total_items_sold}</Typography>
//               </CardContent>
//             </StyledCard>
//           </Grid>
//         </Grid>

//         {/* Charts */}
//         <Grid container spacing={3} sx={{ justifyContent: "center" }}>
//           <Grid item xs={12} md={6}>
//             <Card
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
//               }}
//             >
//               <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
//                 Finance Distribution (Donut Chart)
//               </Typography>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     innerRadius={60}
//                     fill="#8884d8"
//                     label
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Card
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
//               }}
//             >
//               <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
//                 Finance Comparison (Bar Chart)
//               </Typography>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart
//                   data={barData}
//                   margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="Lease" fill={COLORS[0]} />
//                   <Bar dataKey="LAP" fill={COLORS[1]} />
//                   <Bar dataKey="Expenditures" fill={COLORS[2]} />
//                   <Bar dataKey="Transpotation Cost" fill={COLORS[3]} />
//                   <Bar dataKey="Sales" fill={COLORS[4]} />
//                   <Bar dataKey="Items" fill={COLORS[5]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// }



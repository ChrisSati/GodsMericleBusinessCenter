import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

const ShopInfo = () => {
  const [ownerId, setOwnerId] = useState(""); // Select the owner by ID
  const [sellerIds, setSellerIds] = useState([]); // Multiple sellers
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [users, setUsers] = useState([]); // All users for owner select
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:8000/api/shops/"; // Endpoint to create shop
  const USERS_API = "http://127.0.0.1:8000/api/users/"; // Endpoint to fetch users

  useEffect(() => {
    // Fetch all users for owner and sellers
    axios
      .get(USERS_API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData();
    formData.append("owner", ownerId);
    sellerIds.forEach((id) => formData.append("sellers", id)); // Add sellers
    formData.append("name", name);
    formData.append("address", address);
    if (image) formData.append("image", image);

    try {
      await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      setSuccess("Shop created successfully!");
      setName("");
      setAddress("");
      setOwnerId("");
      setSellerIds([]);
      setImage(null);
    } catch (err) {
      setError("Failed to create shop. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: "20px auto" }}>
      <Typography variant="h5" gutterBottom>
        Create New Shop
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Owner select stays the same */}
        <TextField
          select
          label="Owner"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          SelectProps={{ native: true }}
          required
        >
          <option value="">Select Owner</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name} ({user.email})
            </option>
          ))}
        </TextField>

        {/* Sellers multiple select */}
        <TextField
          select
          label="Sellers"
          value={sellerIds}
          onChange={(e) =>
            setSellerIds(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          SelectProps={{ native: true, multiple: true }}
          helperText="Hold Ctrl (Cmd) to select multiple sellers"
        >
          {users
            .filter((user) => user.role === "SELLERS")
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name} ({user.email})
              </option>
            ))}
        </TextField>

        <TextField
          label="Shop Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <Button variant="contained" component="label">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>

        {loading ? (
          <CircularProgress />
        ) : (
          <Button type="submit" variant="contained" color="primary">
            Create Shop
          </Button>
        )}

        {success && <Typography color="success.main">{success}</Typography>}
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Paper>
  );
};

export default ShopInfo;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   CircularProgress,
// } from "@mui/material";

// const ShopInfo = () => {
//   const [ownerId, setOwnerId] = useState(""); // Select the owner by ID
//   const [name, setName] = useState("");
//   const [address, setAddress] = useState("");
//   const [image, setImage] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const API_URL = "http://127.0.0.1:8000/api/shops/"; // Change to your endpoint
//   const USERS_API = "http://127.0.0.1:8000/api/users/"; // Endpoint to fetch owners

//   useEffect(() => {
//     // Fetch all users to select as shop owners
//     axios
//       .get(USERS_API, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access")}`,
//         },
//       })
//       .then((res) => setUsers(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setSuccess("");
//     setError("");

//     const formData = new FormData();
//     formData.append("owner", ownerId);
//     formData.append("name", name);
//     formData.append("address", address);
//     if (image) formData.append("image", image);

//     try {
//       await axios.post(API_URL, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${localStorage.getItem("access")}`,
//         },
//       });
//       setSuccess("Shop created successfully!");
//       setName("");
//       setAddress("");
//       setOwnerId("");
//       setImage(null);
//     } catch (err) {
//       setError("Failed to create shop. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Paper sx={{ p: 4, maxWidth: 600, margin: "20px auto" }}>
//       <Typography variant="h5" gutterBottom>
//         Create New Shop
//       </Typography>
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//       >
//         <TextField
//           select
//           label="Owner"
//           value={ownerId}
//           onChange={(e) => setOwnerId(e.target.value)}
//           SelectProps={{ native: true }}
//           required
//         >
//           <option value="">Select Owner</option>
//           {users.map((user) => (
//             <option key={user.id} value={user.id}>
//               {user.full_name} ({user.email})
//             </option>
//           ))}
//         </TextField>

//         <TextField
//           label="Shop Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />

//         <TextField
//           label="Address"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           required
//         />

//         <Button variant="contained" component="label">
//           Upload Image
//           <input
//             type="file"
//             hidden
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0])}
//           />
//         </Button>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <Button type="submit" variant="contained" color="primary">
//             Create Shop
//           </Button>
//         )}

//         {success && <Typography color="success.main">{success}</Typography>}
//         {error && <Typography color="error">{error}</Typography>}
//       </Box>
//     </Paper>
//   );
// };

// export default ShopInfo;

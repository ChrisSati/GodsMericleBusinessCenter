// src/components/UserForm.js
import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

export default function UserForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
    contact: "",
    address: "",
    profile_image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      setFormData({ ...formData, profile_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      await axios.post("http://127.0.0.1:8000/api/users/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "User Created!",
        text: "The user has been added successfully.",
        confirmButtonColor: "#3085d6",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Something went wrong while creating the user.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Create User
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          select
          fullWidth
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="ADMIN">Admin</MenuItem>
          <MenuItem value="OWNER">Owner</MenuItem>
          <MenuItem value="SELLERS">Seller</MenuItem>
          <MenuItem value="ADVICER">Advicer</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          margin="normal"
        />

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Upload Profile Image
          <input
            type="file"
            hidden
            name="profile_image"
            accept="image/*"
            onChange={handleChange}
          />
        </Button>

        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create User"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

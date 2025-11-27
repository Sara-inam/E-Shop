import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const subCategoryOptions = ["Men", "Women", "Kids"];

  // Create axios instance with token
  const token = localStorage.getItem("authToken"); // ensure login stores token in localStorage
  const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_DEVELOPMENT_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchCategories = async () => {
    try {
      const response = await axiosAuth.get("/category/all");
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Error loading categories", err);
      alert("Failed to load categories. Make sure you are logged in.");
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim() || !selectedGender) {
      alert("Please enter category name and select gender");
      return;
    }

    try {
      const response = await axiosAuth.post("/category/create", {
        name: categoryName,
        gender: selectedGender,
      });

      setCategories([...categories, response.data.category]);
      setCategoryName("");
      setSelectedGender("");
      setOpenModal(false);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Unable to add category");
      }
    }
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat._id !== id));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Box sx={{ ml: "240px", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Category List
        </Typography>

        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f0f0f0" }}>
            <TableRow>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Sub Category</b></TableCell>
              <TableCell><b>Brands</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.gender}</TableCell>
                <TableCell>{cat.brands ? cat.brands.join(", ") : "-"}</TableCell>
                <TableCell>
                  <IconButton>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(cat._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            width: 380,
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Category
          </Typography>
          <TextField
            fullWidth
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Select Gender"
            select
            SelectProps={{ native: true }}
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            sx={{ mb: 2 }}
          >
            <option value=""></option>
            {subCategoryOptions.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </TextField>
          <Button fullWidth variant="contained" onClick={handleAddCategory}>
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CategoryPage;

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
  const [editCategory, setEditCategory] = useState(null);

  const subCategoryOptions = ["Men", "Women", "Kids"];
  const token = localStorage.getItem("authToken");

  const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_DEVELOPMENT_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchCategories = async () => {
    try {
      const response = await axiosAuth.get("/category/all");
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Error loading categories", err);
      alert("Failed to load categories. Make sure you are logged in.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosAuth.delete(`/category/delete/${id}`);
      setCategories(categories.filter((cat) => cat && cat._id !== id));
    } catch (err) {
      console.error("Error deleting category", err);
      alert("Failed to delete category");
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim() || !selectedGender) {
      alert("Please enter category name and select gender");
      return;
    }

    try {
      if (editCategory && editCategory._id) {
        // Update existing category
        const response = await axiosAuth.put(`/category/update/${editCategory._id}`, {
          name: categoryName,
          gender: selectedGender,
        });

        // Update the local state safely
        setCategories(categories.map((cat) =>
          cat && cat._id === editCategory._id
            ? { ...cat, name: categoryName, gender: selectedGender } // use updated values
            : cat
        ));

        setEditCategory(null);
      } else {
        // Create new category
        const response = await axiosAuth.post("/category/create", {
          name: categoryName,
          gender: selectedGender,
        });
        const newCategory = response.data.category || response.data;
        setCategories([...categories, newCategory]);
      }

      // Reset modal
      setCategoryName("");
      setSelectedGender("");
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.message || "Unable to save category");
    }
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
            {categories.filter(Boolean).map((cat) => (
              <TableRow key={cat._id || cat.name}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.gender}</TableCell>
                <TableCell>{cat.brands ? cat.brands.join(", ") : "-"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setEditCategory(cat);
                      setCategoryName(cat.name || "");
                      setSelectedGender(cat.gender || "");
                      setOpenModal(true);
                    }}
                  >
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
            {editCategory ? "Edit Category" : "Add Category"}
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
          <Button fullWidth variant="contained" onClick={handleSaveCategory}>
            {editCategory ? "Update" : "Save"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CategoryPage;

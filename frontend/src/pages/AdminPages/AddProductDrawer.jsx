import { useEffect, useState } from "react";
import { Drawer, Box, Typography, TextField, Button, Stack, Snackbar } from "@mui/material";
import axios from "axios";

const AddProductDrawer = ({ openDrawer, setOpenDrawer, editProduct, setEditProduct, products, setProducts, }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [toast, setToast] = useState({ open: false, message: "" });
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        brand: "",
        description: "",
        price: "",
        quantity: "",
        image: null,
    });
    // Axios instance with auth
    const axiosAuth = axios.create({
        baseURL: import.meta.env.VITE_DEVELOPMENT_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    });
    // Show toast helper
    const showToast = (message) => {
        setToast({ open: true, message });
        setTimeout(() => setToast({ open: false, message: "" }), 3000);
    };
    // ================= FETCH DATA =================
    const fetchCategories = async () => {
        try {
            const res = await axiosAuth.get("/category/all");
            setCategories(res.data.categories || []);
        } catch (err) {
            console.error("Fetch Categories Error:", err);
        }
    };
    const fetchBrands = async () => {
        try {
            const res = await axiosAuth.get("/brand/all");
            setBrands(res.data.brands || []);
        } catch (err) {
            console.error("Fetch Brands Error:", err);
        }
    };
    useEffect(() => {
        if (openDrawer) {
            fetchCategories();
            fetchBrands();
        }
    }, [openDrawer]);
    // ================= EDIT MODE FILL =================
    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name || "",
                category: editProduct.category?.name || "",
                brand: editProduct.brand?.name || "",
                description: editProduct.description || "",
                price: editProduct.price || "",
                quantity: editProduct.quantity || "",
                image: null,
            });
        } else {
            setFormData({
                name: "",
                category: "",
                brand: "",
                description: "",
                price: "",
                quantity: "",
                image: null,
            });
        }
    }, [editProduct]);
    // ================= IMAGE =================
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result }); // Base64
        };
        reader.readAsDataURL(file);
    };
    // ================= CREATE =================
    const handleSubmit = async () => {
        try {
            // Prepare payload
            const payload = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                quantity: formData.quantity,
                category: formData.category,
                brand: formData.brand,
                image: formData.image, // Base64 string
            };
            const res = await axiosAuth.post("/product/create", payload);
            setProducts([...products, res.data.product]);
            showToast("Product created successfully");
            setOpenDrawer(false);
            setEditProduct(null);
        } catch (err) {
            console.error("Create Product Error:", err.response?.data || err);
            alert("Failed to add product");
        }
    };
    // ================= UPDATE =================
    const handleUpdate = async () => {
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                quantity: formData.quantity,
                category: formData.category,
                brand: formData.brand,
                image: formData.image, // Base64 or null
            };
            const res = await axiosAuth.put(
                `/product/update/${editProduct._id}`,
                payload
            );
            setProducts(
                products.map((p) =>
                    p._id === editProduct._id ? res.data.updated : p
                )
            );
             showToast("Product updated successfully");
            setOpenDrawer(false);
            setEditProduct(null);
        } catch (err) {
            console.error("Update Product Error:", err.response?.data || err);
            alert("Update failed");
        }
    };
    return (
        <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
            <Box sx={{ width: 350, p: 3 }}>
                <Typography variant="h6" mb={2}>
                    {editProduct ? "Edit Product" : "Add Product"}
                </Typography>
                <Stack spacing={2}>
                    <Button component="label" variant="outlined">
                        Upload Image
                        <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
                    </Button>
                    {(formData.image || editProduct?.images?.[0]) && (
                        <img
                            src={formData.image || editProduct?.images?.[0]}
                            alt="preview"
                            style={{
                                width: "100%",
                                height: 150,
                                objectFit: "cover",
                                borderRadius: 6,
                            }}
                        />

                    )}
                    <TextField
                        label="Product Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />
                    <TextField
                        // label="Category"
                        select
                        SelectProps={{ native: true }}
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                    >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option value={c.name}>{c.name}</option>
                        ))}
                    </TextField>

                    <TextField
                        // label="Brand"
                        select
                        SelectProps={{ native: true }}
                        value={formData.brand}
                        onChange={(e) =>
                            setFormData({ ...formData, brand: e.target.value })
                        }
                    >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                            <option value={b.name}>{b.name}</option>
                        ))}
                    </TextField>
                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    />
                    <TextField
                        type="number"
                        label="Price"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                        }
                    />
                    <TextField
                        type="number"
                        label="Quantity"
                        value={formData.quantity}
                        onChange={(e) =>
                            setFormData({ ...formData, quantity: e.target.value })
                        }
                    />
                    <Button
                        variant="contained"
                        onClick={editProduct ? handleUpdate : handleSubmit}
                    >
                        {editProduct ? "Update Product" : "Add Product"}
                    </Button>
                </Stack>
            </Box>
            <Snackbar
                open={toast.open}
                message={toast.message}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            />
        </Drawer>
    );
};
export default AddProductDrawer;
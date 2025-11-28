import React, { useEffect, useState } from "react";
import { Drawer, Box, Typography, TextField, Button, Stack } from "@mui/material";
import axios from "axios";

const AddProductDrawer = ({ openDrawer, setOpenDrawer, editProduct, setEditProduct, products, setProducts }) => {

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        brand: "",
        description: "",
        price: "",
        quantity: "",
        image: null,
    });

    const brandOptions = [
        "Nikie",
        "Puma",
        "Adidas",
        "ZARA",
        "Celine",
        "Outfiters",
        "Edenrobe",
    ];

    const axiosAuth = axios.create({
        baseURL: import.meta.env.VITE_DEVELOPMENT_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    });

    const fetchCategories = async () => {
        try {
            const response = await axiosAuth.get("/category/all");
            setCategories(response.data.categories);
        } catch (err) {
            console.error("Error loading categories", err);
        }
    };
    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name,
                price: editProduct.price,
                quantity: editProduct.quantity,
                description: editProduct.description,
                category: editProduct.category,
                brand: editProduct.brand,
                images: editProduct.images || []
            });
        }
    }, [editProduct]);


    useEffect(() => {
        if (openDrawer) fetchCategories();
    }, [openDrawer]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData({ ...formData, image: file });
    };

    const handleUpdate = async () => {
        try {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("category", formData.category); // make sure this is ID, not name
            fd.append("brand", formData.brand);
            fd.append("price", formData.price);
            fd.append("quantity", formData.quantity);
            fd.append("description", formData.description);

            // Only append image if user uploads a new one
            if (formData.image instanceof File) {
                fd.append("image", formData.image);
            }

            const response = await axiosAuth.put(
                `/product/update/${editProduct._id}`,
                fd,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // Update local UI
            setProducts(prev =>
                prev.map(p => (p._id === editProduct._id ? response.data.product : p))
            );

            setOpenDrawer(false);
            setEditProduct(null);

        } catch (error) {
            console.error("Update failed:", error);
        }
    };


    const handleSubmit = async () => {
        if (!formData.name || !formData.category || !formData.brand || !formData.price || !formData.quantity || !formData.description) {
            alert("Please fill all required fields");
            return;
        }

        try {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("category", formData.category); // ID
            fd.append("brand", formData.brand);
            fd.append("price", parseFloat(formData.price)); // convert to number
            fd.append("quantity", parseInt(formData.quantity)); // convert to number
            fd.append("description", formData.description);

            if (formData.image instanceof File) {
                fd.append("image", formData.image); // must match backend field
            }

            const response = await axiosAuth.post("/product/create", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setProducts([...products, response.data.product]);
            setOpenDrawer(false);
        } catch (error) {
            console.error("Product upload error:", error.response?.data || error.message);
        }
    };


    return (
        <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
            <Box sx={{ width: 350, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {editProduct ? "Edit Product" : "Add Product"}
                </Typography>

                <Stack spacing={2}>
                    <Button variant="outlined" component="label">
                        Upload Image
                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    </Button>

                    {formData.image && (
                        <img
                            src={URL.createObjectURL(formData.image)}
                            alt="Preview"
                            style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "6px",
                            }}
                        />
                    )}


                    <TextField
                        label="Product Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <TextField
                        select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>

                        ))}
                    </TextField>


                    <TextField
                        select
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value="">Select Brand</option>
                        {brandOptions.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </TextField>

                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />


                    <TextField
                        type="number"
                        label="Price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />

                    <TextField
                        type="number"
                        label="Quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />

                    <Button variant="contained" onClick={editProduct ? handleUpdate : handleSubmit}>
                        {editProduct ? "Update Product" : "Add Product"}
                    </Button>


                </Stack>
            </Box>
        </Drawer>
    );
};

export default AddProductDrawer;

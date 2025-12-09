import { useEffect, useState } from "react";
import { Drawer, Box, Typography, TextField, Button, Stack, Snackbar } from "@mui/material";
import axios from "axios";

const AddProductDrawer = ({ openDrawer, setOpenDrawer, editProduct, setEditProduct, products, setProducts }) => {

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [formData, setFormData] = useState({ name: "", category: "", brand: "", description: "", price: "", quantity: "", image: null, });


    const [toast, setToast] = useState({ open: false, message: "", });
    const showToast = (message) => {
        setToast({ open: true, message });
        setTimeout(() => {
            setToast({ open: false, message: "" });
        }, 3000);
    };
    const axiosAuth = axios.create({
        baseURL: import.meta.env.VITE_DEVELOPMENT_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    });
    const fetchCategories = async () => {
        try {
            const res = await axiosAuth.get("/category/all");
            setCategories(res.data.categories || []);
        } catch (err) {
            console.error("Error loading categories", err);
        }
    };
    // Fetch Brands 
    const fetchBrands = async () => {
        try {
            const res = await axiosAuth.get("/brand/all");
            setBrands(res.data.brands || []);
        } catch (err) {
            console.error("Failed to load brands", err);
        }
    };

    // Form Fill When Editing
    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name || "",
                category: editProduct.category?._id || "",
                brand: editProduct.brand || "",
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

    // const showToast = (message) => {
    //     setToast({ open: true, message });
    // };


    // Image Upload Handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) setFormData({ ...formData, image: file });
    };

    const handleSubmit = async () => {
        const { name, category, brand, price, quantity, description, image } = formData;

        if (!name || !category || !brand || !price || !quantity || !description) {
            alert("Please fill all required fields");
            return;
        }

        try {
            const fd = new FormData();
            fd.append("name", name);
            fd.append("category", category.trim());
            fd.append("brand", brand);
            fd.append("price", Number(price));
            fd.append("quantity", Number(quantity));
            fd.append("description", description);

            if (image instanceof File) {
                fd.append("image", image);
            }

            const res = await axiosAuth.post("/product/create", fd);
            setProducts([...products, res.data.product]);

            showToast("Product created successfully!");
            setOpenDrawer(false);
            setEditProduct(null);

        } catch (error) {
            console.log("Product upload error:", error);
            alert(error.response?.data?.message || "Failed to add product");
        }
    };
    useEffect(() => {
        if (openDrawer)
            fetchCategories();
        fetchBrands();

    }, [openDrawer]);
    const handleUpdate = async () => {
        try {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("category", formData.category);
            fd.append("brand", formData.brand);
            fd.append("price", Number(formData.price));
            fd.append("quantity", Number(formData.quantity));
            fd.append("description", formData.description);

            if (formData.image instanceof File) {
                fd.append("image", formData.image);
            }

            const res = await axiosAuth.put(`/product/update/${editProduct._id}`, fd);
            setProducts(
                products.map((p) =>
                    p._id === editProduct._id ? res.data.product : p
                )
            );
            showToast("Product created successfully!");
            setOpenDrawer(false);
            setEditProduct(null);
        } catch (error) {
            console.error("Update failed:", error);
            alert(error.response?.data?.message || "Failed to update product");
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
                    {(formData.image || editProduct?.imageUrl) && (
                        <img
                            src={
                                formData.image
                                    ? URL.createObjectURL(formData.image)
                                    : editProduct ? `${import.meta.env.VITE_DEVELOPMENT_URL}/${editProduct.image}` : ""
                            }
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
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </TextField>
                    <TextField
                        select
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand._id} value={brand.name}>
                                {brand.name}
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
                        onChange={(e) =>
                            setFormData({ ...formData, quantity: e.target.value })
                        }
                    />
                    <Button variant="contained" onClick={editProduct ? handleUpdate : handleSubmit}>
                        {editProduct ? "Update Product" : "Add Product"}
                    </Button>
                </Stack>
            </Box>
            <Snackbar
                open={toast.open}
                message={toast.message}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setToast({ open: false, message: "" })}
            />
            <Snackbar
                open={toast.open}
                message={toast.message}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            />
        </Drawer>
    );
};

export default AddProductDrawer;

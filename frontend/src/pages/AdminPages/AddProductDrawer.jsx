import React, { useEffect, useState } from "react";
import { Drawer, Box, Typography, TextField, Button, Stack } from "@mui/material";

const AddProductDrawer = ({ openDrawer, setOpenDrawer, editProduct, products, setProducts, editDescription, editSubCategory }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        subCategory:"",
        brand: "",
        description: "",
        price: "",
        quantity: "",
        image: "",
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
    const categoryToSelect = ["Home", "Fashion", "Bags", "Footwear", "Beauty", "Jewellery"];
     const subCategoryToSelect=["Men", "Women", "Kid"]
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setFormData({ ...formData, image: imageURL });
        }
    };

    useEffect(() => {
        if (!openDrawer) return;

        if (editProduct) {
            setFormData({
                name: editProduct.name || "",
                category: editProduct.category || "",
                subCategory: editSubCategory. subCategory || "",
                brand: editProduct.brand || "",
                description: editDescription.description || "",
                price: editProduct.price || "",
                quantity: editProduct.quantity || "",
            });
        } else {
            setFormData({
                name: "",
                category: "",
                subCategory: "",
                brand: "",
                description: "",
                price: "",
                quantity: "",
            });
        }
    }, [openDrawer, editProduct]);

    const handleSubmit = () => {
        if (editProduct) {
            setProducts(products.map(p =>
                p.id === editProduct.id ? { ...editProduct, ...formData } : p
            ));
        } else {
            const newProduct = {
                id: Date.now(),
                ...formData,
            };
            setProducts([...products, newProduct]);
        }
        setOpenDrawer(false);
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
                        <input type="file" hidden onChange={handleImageUpload} />
                    </Button>

                    {formData.image && (
                        <img
                            src={formData.image}
                            alt="Preview"
                            style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px" }}
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
                        <option value="">Selcet Category</option>
                        {
                            categoryToSelect.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))
                        }
                    </TextField>
                     <TextField
                        select
                        value={formData.subCategory}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value="">Selcet Sub-Category</option>
                        {
                            subCategoryToSelect.map((subCategory) => (
                                <option key={subCategory} value={subCategory}>{subCategory}</option>
                            ))
                        }
                    </TextField>
                    <TextField
                        select
                        // label="Brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        SelectProps={{ native: true }}
                    >
                        <option value="">Selcet a Brand</option>
                        {
                            brandOptions.map((brand) => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))
                        }
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

                    <Button variant="contained" fullWidth onClick={handleSubmit}>
                        {editProduct ? "Update Product" : "Confirm"}
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default AddProductDrawer;

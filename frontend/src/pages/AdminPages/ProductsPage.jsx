import { Box, Grid, Button, Card, CardContent, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProductDrawer from "./AddProductDrawer";
import React, { useState, useEffect } from "react";
import axios from "axios";


const ProductsPage = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Start with empty products
  const [products, setProducts] = useState([]);



  const handleEdit = (product) => {
    setEditProduct(product);
    setOpenDrawer(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosAuth.delete(`/product/delete/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };


  const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_DEVELOPMENT_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  const fetchProducts = async () => {
    try {
      const response = await axiosAuth.get("/product/all");
      // Assuming your API returns products in response.data.products
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const thStyle = {
    padding: "12px",
    fontWeight: "600",
    textAlign: "left",
    borderBottom: "2px solid #ddd"
  };

  const tdStyle = {
    padding: "12px",
    textAlign: "left"
  };

  return (
    <Box sx={{ ml: "240px", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          All Products
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            setEditProduct(null);
            setOpenDrawer(true);
          }}
        >
          Add Product
        </Button>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f5f5f5" }}>
            <tr>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Brand</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products &&
              products
                .filter(item => item) // filter out undefined/null
                .map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={tdStyle}>
                      {item.images && item.images.length > 0 && (
                        <img
                          src={`${import.meta.env.VITE_DEVELOPMENT_URL}${item.images[0]}`}
                          alt={item.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "6px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </td>

                    <td style={tdStyle}>{item.name}</td>
                    <td style={tdStyle}>{item.category?.name || item.category}</td>
                    <td style={tdStyle}>{item.brand?.name || item.brand}</td>
                    <td style={tdStyle}>{item.description}</td>
                    <td style={tdStyle}>{item.price}</td>
                    <td style={tdStyle}>{item.quantity}</td>

                    <td style={tdStyle}>
                      <IconButton size="small" onClick={() => handleEdit(item)}>
                        <EditIcon color="primary" />
                      </IconButton>

                      <IconButton size="small" onClick={() => handleDelete(item._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
          </tbody>

        </table>
      </Box>

      <AddProductDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
        products={products}
        setProducts={setProducts}
      />

    </Box>
  );

};

export default ProductsPage;

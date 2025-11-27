import { Box, Grid, Button, Card, CardContent, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProductDrawer from "./AddProductDrawer";
import React, { useState } from "react";

const ProductsPage = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Start with empty products
  const [products, setProducts] = useState([]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setOpenDrawer(true);
  };

  const handleDelete = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };

  return (
    <Box sx={{ ml: "240px", p: 3 }}> {/* Shift content right by sidebar width */}
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

      <Grid container spacing={3}>
        {products.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Card
              sx={{
                p: 2,
                height: 320,            // fixed card height
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginBottom: "10px",
                    }}
                  />
                )}

                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="h6">Price: {item.price}</Typography>
                <Typography variant="h6">Category: {item.category}</Typography>
                <Typography variant="h6">Brand: {item.price}</Typography>
                <Typography variant="h6">Category: {item.category}</Typography>
              </CardContent>

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton size="small" onClick={() => handleEdit(item)} sx={{ bgcolor: "#E3F2FD" }}>
                  <EditIcon color="primary" />
                </IconButton>

                <IconButton size="small" onClick={() => handleDelete(item.id)} sx={{ bgcolor: "#FFEBEE" }}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Card>

          </Grid>
        ))}
      </Grid>

      <AddProductDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        editProduct={editProduct}
        products={products}
        setProducts={setProducts}
      />
    </Box>
  );
};

export default ProductsPage;

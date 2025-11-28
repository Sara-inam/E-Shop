import React, { useState } from "react";
import { Box, Typography, Checkbox, FormControlLabel, Divider, Grid, Button } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import axios from "axios";
import { useEffect } from "react";


export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState({
    men: false,
    women: false,
    kids: false,
    accessories: false,
    footwear: false,
  });

  const Category = ["Home", "Fashion", "Bags", "Footwear", "Beauty", "Jewellery"];

  const [brands, setBrands] = useState({
    nike: false,
    adidas: false,
    puma: false,
    levis: false,
    zara: false,
    hnm: false,
  });

  // const productsList = [
  //   {
  //     title: "Women TShirt",
  //     category: "Fashion",
  //     brand: "Nike",
  //     price: "Rs 150",
  //     image: "/prod1.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Product One",
  //     category: "Bags",
  //     brand: "Adidas",
  //     price: "Rs 350",
  //     image: "/prod2.jpg",
  //     originalPrice: "450",
  //   },
  //   {
  //     title: "Kids Tshirt",
  //     category: "Footwear",
  //     brand: "Nike",
  //     price: "Rs 250",
  //     image: "/prod1.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Review Check",
  //     category: "Beauty",
  //     brand: "Puma",
  //     price: "Rs 1000",
  //     image: "/prod4-1.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Product One",
  //     category: "Jewellery",
  //     brand: "Adidas",
  //     price: "Rs 350",
  //     image: "/prod2.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Kids Tshirt",
  //     category: "Beauty",
  //     brand: "Nike",
  //     price: "Rs 250",
  //     image: "/prod3.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Review Check",
  //     category: "Jewellery",
  //     brand: "Puma",
  //     price: "Rs 1000",
  //     image: "/prod4-1.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Product One",
  //     category: "Footwear",
  //     brand: "Adidas",
  //     price: "Rs 350",
  //     image: "/prod2.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Kids Tshirt",
  //     category: "Bags",
  //     brand: "Nike",
  //     price: "Rs 250",
  //     image: "/prod3.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Review Check",
  //     category: "Fashion",
  //     brand: "Puma",
  //     price: "Rs 1000",
  //     image: "/prod4-1.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Women TShirt",
  //     category: "Bags",
  //     brand: "Nike",
  //     price: "Rs 150",
  //     image: "/prod1.jpg",
  //     originalPrice: "250",
  //   },
  //   {
  //     title: "Kids Tshirt",
  //     category: "Bags",
  //     brand: "Nike",
  //     price: "Rs 250",
  //     image: "/prod3.jpg",
  //     originalPrice: "250",
  //   },
  // ];

  const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_DEVELOPMENT_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  const fetchProducts = async () => {
    try {
      const res = await axiosAuth.get("/product/all");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper function to pick N random items
  // const getRandomProductsByCategory = (categories, products, count = 3) => {
  //   const result = [];

  //   categories.forEach((cat) => {
  //     const categoryProducts = products.filter((p) => p.category === cat);

  //     const shuffled = categoryProducts.sort(() => 0.5 - Math.random());

  //     result.push(...shuffled.slice(0, count));
  //   });

  //   return result;
  // };
  // const productList = getRandomProductsByCategory(Category, productsList, 3);
  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          width: "100%",
          background: "white",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
          py: 1.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            color: "#0A1D37",
            "&:hover": {
              color: "#FF5722",
              cursor: "pointer",
            },
          }}
          onClick={() => setShowSidebar(!showSidebar)}>
          <Typography sx={{ fontWeight: 600 }}>Shop By Category</Typography>
          <Typography variant="body2" sx={{ transform: "translateY(2px)" }}>
            ▼
          </Typography>
        </Box>

        {/* Right Side of Categories */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, marginRight: "20px" }}>
          {Category &&
            Category.map((item, i) => (
              <Typography
                key={i}
                sx={{
                  cursor: "pointer",
                  color: "#0A1D37",
                  fontSize: "15px",
                  transition: "0.3s ease",
                  "&:hover": {
                    color: "#FF5722",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                {item}
              </Typography>
            ))}
        </Box>
      </Box>

      <Box sx={{ display: "flex", p: 3, mt: 2 }}>
        {/*  Left Filter Bar  */}
        <Box
          sx={{
            width: showSidebar ? "450px" : "0px",
            pr: showSidebar ? 3 : 0,
            overflow: "hidden",
            transition: "all 0.4s ease",
          }}
        >
          {showSidebar && (
            <>
              <Typography variant="h6" mb={2} fontWeight={600} sx={{ color: "#0A1D37" }}>
                Filters
              </Typography>

              <Typography variant="subtitle1" fontWeight={600} mt={2} sx={{ color: "#0A1D37" }}>
                Category
              </Typography>
              <Box>
                {Object.keys(categories).map((cat) => (
                  <FormControlLabel
                    key={cat}
                    control={
                      <Checkbox
                        checked={categories[cat]}
                        onChange={() =>
                          setCategories({ ...categories, [cat]: !categories[cat] })
                        }
                      />
                    }
                    label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  />
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} mt={2} sx={{ color: "#0A1D37" }}>
                Brand
              </Typography>
              <Box>
                {Object.keys(brands).map((br) => (
                  <FormControlLabel
                    key={br}
                    control={
                      <Checkbox
                        checked={brands[br]}
                        onChange={() =>
                          setBrands({ ...brands, [br]: !brands[br] })
                        }
                      />
                    }
                    label={br.charAt(0).toUpperCase() + br.slice(1)}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>

        {/* Product Grid */}
        <Box sx={{ flexGrow: 1, transition: "0.4s ease" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
              alignItems: "center",
            }}>
            <Typography variant="h5" fontWeight={600} sx={{ color: "#0A1D37" }}>
              All Products
            </Typography>
            {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">{productList.length} Products</Typography>
              <Button startIcon={<SortIcon />} variant="outlined" sx={{ borderRadius: 2 }}>
                Sort by
              </Button>
            </Box> */}
          </Box>
          {/* Products Grid */}
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "stretch",
            }}
          >
            {products.map((product, index) => (
              <Grid item key={index} sx={{ flex: "0 0 260px", maxWidth: "260px", display: "flex" }}>
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    bgcolor: "white",
                    display: "flex",
                    flexDirection: "column",
                    transition: "0.3s",
                    height: 420,
                  }}
                >
                  <Box sx={{ width: "100%", height: 250, overflow: "hidden" }}>
                    <img
                      src={`${import.meta.env.VITE_DEVELOPMENT_URL}${product.images?.[0]}`}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                  </Box>

                  <Box sx={{ p: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ color: "gray", mt: 0.5, fontSize: "12px" }}>
                      {product.category?.name || product.category} — {product.brand?.name || product.brand}
                    </Typography>

                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: "16px", color: "#0A1D37" }}>
                      {product.name}
                    </Typography>

                    <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: "line-through", color: "gray", fontSize: "12px" }}
                      >
                        Rs.{product.originalPrice || product.price + 200}
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ fontSize: "18px", color: "#0A1D37" }}
                      >
                        Rs.{product.price}
                      </Typography>
                    </Box>

                    <Button
                      onClick={() => dispatch(addItem({ ...product, id: product._id }))}
                      variant="outlined"
                      fullWidth
                      sx={{
                        mt: 2,
                        borderColor: "#0A1D37",
                        color: "#0A1D37",
                        borderRadius: 2,
                        py: 1,
                        textTransform: "none",
                        fontSize: "14px",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#0A1D37",
                          color: "white",
                          borderColor: "#0A1D37",
                        }
                      }}
                    >
                      Add to cart
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}

          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

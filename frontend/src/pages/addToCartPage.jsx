import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardMedia, CardContent, IconButton, Button, Divider, Snackbar, } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, incrementQuantity, decrementQuantity, } from "../redux/slices/cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";

export default function CartPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const [productsData, setProductsData] = useState([]);
    // const navigate = useNavigate();

    const [toast, setToast] = useState({ open: false, message: "" });
    const [loading, setLoading] = useState(false);
    const axiosAuth = axios.create({
        baseURL: import.meta.env.VITE_DEVELOPMENT_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
    });
    const fetchProducts = async () => {
        try {
            if (cartItems.length === 0) {
                setProductsData([]);
                return;
            }

            const productPromises = cartItems.map(item =>
                axiosAuth.get(`/product/${item.id}`)
            );
            const responses = await Promise.all(productPromises);

            const fullProducts = responses.map(res => ({
                ...res.data.product,
                quantity: cartItems.find(c => c.id === res.data.product._id)?.quantity || 1,
                id: res.data.product._id
            }));


            setProductsData(fullProducts);
        } catch (error) {
            console.error("Failed to fetch cart products", error);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, [cartItems]);

    const totalPrice = productsData.reduce(
        (acc, item) => acc + parseInt(item.price) * item.quantity,
        0
    );
    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            alert("Cart is empty");
            return;
        }
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("You are not logged in. Please log in first.");
            return;
        }
        setLoading(true);
        try {
            // ⿡ Fetch product details from backend to get price
            const productPromises = cartItems.map(item =>
                axiosAuth.get(`/product/${item.id}`)
            );
            const responses = await Promise.all(productPromises);

            const itemsWithPrice = responses.map(res => {
                const product = res.data.product;
                const cartItem = cartItems.find(c => c.id === product._id);
                return {
                    product: product._id,
                    quantity: cartItem.quantity,
                    price: product.price,
                };
            });
            const totalPrice = itemsWithPrice.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            const orderData = {
                items: itemsWithPrice,
                totalPrice,
                address: "123 Street, City",
                paymentMethod: "COD",
            };
            await axiosAuth.post("/order/create", orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Order placed successfully!");
            dispatch({ type: "cart/clearCart" });
            setProductsData([]);
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Order failed! Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "80vh", bgcolor: "#f9f9f9", position: "relative" }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3, textAlign: "center" }}>
                Products in Cart
            </Typography>

            {productsData.length === 0 ? (
                <Typography variant="h6" sx={{ mt: 5, textAlign: "center" }}>
                    Cart is Empty.
                </Typography>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {productsData.map((item, index) => (
                            <Grid item xs={12} key={index}>
                                <Card
                                    sx={{
                                        display: "flex",
                                        p: 2,
                                        height: 280,
                                        "&:hover": {
                                            boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
                                            transform: "translateY(-2px)",
                                            transition: "0.3s ease",
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={item.images?.[0] ? `${import.meta.env.VITE_DEVELOPMENT_URL}${item.images[0]}` : "/placeholder.png"}
                                        alt={item.name}
                                        sx={{
                                            width: 180,
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: 2,
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, pl: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <Box>
                                            <Typography fontWeight={600} variant="h6">{item.name}</Typography>
                                            <Typography variant="body2" color="gray">{item.category?.name || item.category} — {item.brand?.name || item.brand}</Typography>
                                            <Typography sx={{ ml: "auto", fontWeight: 700 }}>Rs.{parseInt(item.price)}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <IconButton
                                                onClick={() => dispatch(decrementQuantity(item.id))}
                                                sx={{ border: "1px solid #ddd", borderRadius: "5px", width: 36, height: 36, p: 0 }}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography>{item.quantity}</Typography>
                                            <IconButton
                                                onClick={() => dispatch(incrementQuantity(item.id))}
                                                sx={{ border: "1px solid #ddd", borderRadius: "5px", width: 36, height: 36, p: 0 }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => dispatch(removeItem(item.id))}
                                                sx={{ color: "red", borderRadius: "5px", width: 36, height: 36, p: 0 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <Typography sx={{ ml: "auto", fontWeight: 700 }}>Rs.{parseInt(item.price) * item.quantity}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box
                        sx={{
                            position: "fixed",
                            bottom: 20,
                            right: 20,
                            width: 300,
                            p: 3,
                            borderRadius: 2,
                            bgcolor: "white",
                            boxShadow: 3,
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Order Summary
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            Items: {productsData.length}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Total: Rs.{totalPrice}
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ py: 1.5, backgroundColor: "#0A1D37", "&:hover": { backgroundColor: "#FF5722" } }}
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Place Order"}
                        </Button>

                    </Box>
                </>
            )}
            <Snackbar
                open={toast.open}
                message={toast.message}
                autoHideDuration={3000}
                onClose={() => setToast({ open: false, message: "" })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            />

        </Box>

    );
}

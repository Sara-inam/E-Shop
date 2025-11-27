import React from "react";
import {
    Box,
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Button,
    Divider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
    removeItem,
    incrementQuantity,
    decrementQuantity,
} from "../redux/slices/cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function CartPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + parseInt(item.originalPrice) * item.quantity,
        0
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "80vh", bgcolor: "#f9f9f9", position: "relative" }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3, textAlign: "center" }}>
                Products in Cart
            </Typography>

            {cartItems.length === 0 ? (
                <Typography variant="h6" sx={{ mt: 5, textAlign: "center" }}>
                    Cart is Empty.
                </Typography>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {cartItems.map((item, index) => (
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
                                        image={item.image}
                                        alt={item.title}
                                        sx={{
                                            width: 180,
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: 2,
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, pl: 3, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                        <Box>
                                            <Typography fontWeight={600} variant="h6">{item.title}</Typography>
                                            <Typography variant="body2" color="gray">{item.category} — {item.brand}</Typography>
                                            <Typography sx={{ ml: "auto", fontWeight: 700 }}>Rs.{parseInt(item.originalPrice)}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <IconButton
                                                onClick={() => dispatch(decrementQuantity(item.title))}
                                                sx={{
                                                    border: "1px solid #ddd",
                                                    borderRadius: "5px",
                                                    width: 36,
                                                    height: 36,
                                                    p: 0,
                                                }}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography>{item.quantity}</Typography>
                                            <IconButton onClick={() => dispatch(incrementQuantity(item.title))} sx={{ border: "1px solid #ddd",borderRadius: "5px", width: 36, height: 36, p: 0, }}>
                                                <AddIcon />
                                            </IconButton>
                                            <IconButton onClick={() => dispatch(removeItem(item.title))} sx={{ color: "red",borderRadius: "5px", width: 36, height: 36, p: 0, }}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <Typography sx={{ ml: "auto", fontWeight: 700 }}>Rs.{parseInt(item.originalPrice) * item.quantity}</Typography>
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
                            Items: {cartItems.length}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Total: Rs.{totalPrice}
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ py: 1.5, backgroundColor: "#0A1D37", "&:hover": { backgroundColor: "#FF5722" } }}
                        >
                            Place Order
                        </Button>
                    </Box>
                </>
            )}
        </Box>

    );
}

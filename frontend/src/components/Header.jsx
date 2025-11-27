import * as React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Button
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HeroCarousel from './HeroCarousel';
import { useSelector } from 'react-redux';



export default function Header() {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ background: "white", color: "black", boxShadow: 0 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/891/891419.png"
                alt="logo"
                style={{ width: 35 }}
              />
              {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              CLASSYSHOP
            </Typography>
            <Typography variant="caption" sx={{ letterSpacing: 2 }}>
              BIG MEGA STORE
            </Typography> */}
            </Box>
            <Box
              sx={{
                background: "#e5e5e5",
                width: "45%",
                display: "flex",
                alignItems: "center",
                padding: "5px 12px",
                borderRadius: "8px"
              }}
            >
              <InputBase
                placeholder="Search for products.."
                sx={{ flex: 1 }}
              />
              <SearchIcon />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Button
                onClick={() => navigate('/login')}
                sx={{ textTransform: "none", color: "black" }}
              >
                Login
              </Button>
              {/* <Button
              onClick={() => navigate('/login')}
              sx={{ textTransform: "none",  color: "white", backgroundColor:"#0A1D37",transition: "0.3s ease", "&:hover": {
                  // color: "#FF5722",
                  transform: "translateY(-5px)",
                  cursor: "pointer",
                }}}
            >
              Login
            </Button> */}
              <Typography>|</Typography>
              <Button
                onClick={() => navigate('/signup')}
                sx={{ textTransform: "none", color: "black", }}
              >
                SignUp
              </Button>
              {/* <Button
              onClick={() => navigate('/signup')}
              sx={{ textTransform: "none",padding:"5px", borderRadius:"10px", color: "white", backgroundColor:"#0A1D37",transition: "0.3s ease", "&:hover": {
                  // color: "#FF5722",
                  transform: "translateY(-5px)",
                  cursor: "pointer",
                } }}
                // className="footer-subscribe-btn"
            >
              SignUp
            </Button> */}
              <IconButton onClick={() => navigate('/dashboard')} sx={{ position: "relative" }}>
                <FavoriteBorderIcon />
              </IconButton>
               <IconButton onClick={() => navigate('/cart')} sx={{ position: "relative" }}>
              <ShoppingCartIcon sx={{ color: "#0A1D37" }} />
              {/* Cart item count badge */}
              {cart.totalItems > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 12,
                  }}
                >
                  {cart.totalItems}
                </Box>
              )}
            </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {/* <HeroCarousel /> */}
    </>
  );
}

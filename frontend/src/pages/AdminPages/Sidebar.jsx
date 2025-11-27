import React from "react";
import { Box, List, ListItemButton, Typography } from "@mui/material";
import CategoryPage from "./CategoryPage";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  return (
    <Box
      sx={{
        width: "240px",
        height: "100vh",
        bgcolor: "#0A1D37",
        color: "white",
        p: 2,
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Admin Panel
      </Typography>

      <List>
        <ListItemButton
          selected={selectedTab === "products"}
          onClick={() => setSelectedTab("products")}
          sx={{ borderRadius: 1, mb: 1, bgcolor: selectedTab === "products" ? "#12345A" : "transparent" }}
        >
          Products
        </ListItemButton>

        <ListItemButton
          selected={selectedTab === "users"}
          onClick={() => setSelectedTab("users")}
          sx={{ borderRadius: 1, bgcolor: selectedTab === "users" ? "#12345A" : "transparent" }}
        >
          Users
        </ListItemButton>
         <ListItemButton
          selected={selectedTab === "categories"}
          onClick={() => setSelectedTab("categories")}
          sx={{ borderRadius: 1, bgcolor: selectedTab === "categories" ? "#12345A" : "transparent" }}
        >
          Manage Categories
        </ListItemButton>
         {/* <ListItemButton
          selected={selectedTab === "brand" }
          onClick={() => setSelectedTab("brand")}
          sx={{ borderRadius: 1, bgcolor: selectedTab === "brand" ? "#12345A" : "transparent" }}
        >
          Add Brand
        </ListItemButton> */}
      </List>
    </Box>
  );
};

export default Sidebar;

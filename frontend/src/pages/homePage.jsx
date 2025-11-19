import React from "react";
import Header from "../components/Header";
import ProductCard from "../ui/ProductCard";
import FeaturedCard from "../ui/FeaturedCard";
import { Box } from "@mui/material";

export default function HomePage() {
  return (
    <>

      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
          paddingBottom: 10,
        }}
      >
        {/* Left card */}
        <ProductCard
          image="./drink-1.png"
          title="Midnight Mint Mocha Frappuccino"
        />

        {/* Center green card */}
        <FeaturedCard
          image="./drink-3.png"
          title="Midnight Mint Mocha Frappuccino"
        />

        {/* Right card */}
        <ProductCard
          image="./drink-2.png"
          title="Midnight Mint Mocha Frappuccino"
        />
      </Box>
    </>
  );
}

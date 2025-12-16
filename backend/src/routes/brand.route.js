import express from "express";
import { createBrand, getAllBrands, updateBrand, deleteBrand,getBrandById } from "../controllers/brand.controller.js";

const router = express.Router();

router.post("/create", createBrand);
router.get("/all", getAllBrands);
router.get("/:id", getBrandById);
router.put("/update/:id", updateBrand);
router.delete("/delete/:id", deleteBrand);

export default router;
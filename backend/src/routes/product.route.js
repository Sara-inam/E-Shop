import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const productRouter = express.Router();


// single file upload field name: 'image'
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

productRouter.post("/create", verifyToken, isAdmin, upload.single("image"), createProduct);
productRouter.put("/update/:id", verifyToken, isAdmin, upload.single("image"), updateProduct);

productRouter.get("/all", getProducts);
productRouter.get("/:id", getProductById);
productRouter.delete("/delete/:id", verifyToken, isAdmin, deleteProduct);

export default productRouter;
// No multer needed now
Productrouter.post("/create", verifyToken, isAdmin, createProduct);
Productrouter.put("/update/:id", verifyToken, isAdmin, updateProduct);
Productrouter.get("/all", getAllProducts);
Productrouter.delete("/delete/:id", verifyToken, isAdmin, deleteProduct);

// Search and filters
Productrouter.get("/search", verifyToken, searchProducts);
Productrouter.get("/get/:id", verifyToken, getProductById);
Productrouter.get("/category/:category", verifyToken, getProductsByCategory);
Productrouter.get("/brand/:brand", verifyToken, getProductsByBrand);

export default Productrouter;(final)

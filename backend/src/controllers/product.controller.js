import Product from "../models/product.model.js";
import mongoose from "mongoose";
import NodeCache from "node-cache";
import cloudinary from "../config/cloudinary.js";

// NodeCache with 1 hour TTL
const productCache = new NodeCache({ stdTTL: 3600 });

// Helper: flush product cache
const flushProductCache = () => productCache.flushAll();

// Upload image to Cloudinary (Base64)
const uploadImage = async (imageBase64) => {
  if (!imageBase64) return [];

  const result = await cloudinary.uploader.upload(imageBase64, {
    folder: "products",
  });

  return [result.secure_url];
};

// CREATE Product
export const createProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, category, brand, price, quantity, description, image } = req.body;

    if (!name || !category || !brand || !price || !description)
      return res.status(400).json({ message: "Missing required fields" });

<<<<<<< HEAD
    const images = [];
    if (req.file) images.push(`/uploads/${req.file.filename}`);
=======
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) return res.status(400).json({ message: "Category not found" });

    const brandDoc = await Brand.findOne({ name: brand });
    if (!brandDoc) return res.status(400).json({ message: "Brand not found" });

    const images = await uploadImage(image); // Base64 image
>>>>>>> c987b89 (final)

    const existing = await Product.findOne({ name }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = await Product.create(
      [{ name, category, brand, price, quantity, images, description }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    flushProductCache();

    res.status(201).json({ message: "Product created successfully", product: product[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
<<<<<<< HEAD
=======
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET ALL Products
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `allProducts-${page}-${limit}`;
    if (productCache.has(cacheKey)) return res.status(200).json(productCache.get(cacheKey));

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category", "name")
      .populate("brand", "name")
      .lean();

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const response = {
      products,
      pagination: { totalRecords: total, totalPages, currentPage: page, perPage: limit },
    };

    productCache.set(cacheKey, response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid product ID" });

    const cacheKey = `product-${id}`;
    if (productCache.has(cacheKey)) return res.status(200).json(productCache.get(cacheKey));

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("brand", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });

    productCache.set(cacheKey, { product });
    res.status(200).json({ product });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
>>>>>>> c987b89 (final)
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// UPDATE Product
export const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.images = [`/uploads/${req.file.filename}`];
    }

<<<<<<< HEAD
    const updated = await Product.findByIdAndUpdate(id, updatedData, { new: true, session });
=======
    if (updatedData.brand) {
      const brandDoc = await Brand.findOne({ name: updatedData.brand });
      if (!brandDoc) return res.status(400).json({ message: "Brand not found" });
      updatedData.brand = brandDoc._id;
    }

    if (updatedData.image) updatedData.images = await uploadImage(updatedData.image);

    const updated = await Product.findByIdAndUpdate(id, updatedData, { new: true, session })
      .populate("category", "name")
      .populate("brand", "name");

>>>>>>> c987b89 (final)
    if (!updated) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    await session.commitTransaction();
    session.endSession();
    flushProductCache();

    res.status(200).json({ message: "Product updated successfully", updated });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET, GET by ID, DELETE remain same
export const getProducts = async (req, res) => {
  try {
    const cacheKey = "allProducts";
    const cachedData = productCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ products: cachedData, source: "cache" });
    }

    const products = await Product.find().populate("category").sort({ createdAt: -1 });
    productCache.set(cacheKey, products);
    res.status(200).json({ products, source: "db" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id, { session });
    if (!deleted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }
    await session.commitTransaction();
    session.endSession();
    flushProductCache();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
<<<<<<< HEAD
=======

// SEARCH Products
export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.status(400).json({ message: "Please provide a search query" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const regex = new RegExp(query, "i");

    const products = await Product.find({
      $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
    })
      .populate("category", "name")
      .populate("brand", "name")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments({
      $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
    });

    res.status(200).json({
      products,
      pagination: { totalRecords: total, totalPages: Math.ceil(total / limit), currentPage: page, perPage: limit },
    });
  } catch (error) {
    console.error("Search Products Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET Products By Category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) return res.status(400).json({ message: "Category name is required" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) return res.status(404).json({ message: "Category not found" });

    const products = await Product.find({ category: categoryDoc._id })
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments({ category: categoryDoc._id });

    res.status(200).json({
      products,
      pagination: { totalRecords: total, totalPages: Math.ceil(total / limit), currentPage: page, perPage: limit },
    });
  } catch (error) {
    console.error("Get Products By Category Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET Products By Brand
export const getProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    if (!brand) return res.status(400).json({ message: "Brand name is required" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const brandDoc = await Brand.findOne({ name: brand });
    if (!brandDoc) return res.status(404).json({ message: "Brand not found" });

    const products = await Product.find({ brand: brandDoc._id })
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments({ brand: brandDoc._id });

    res.status(200).json({
      products,
      pagination: { totalRecords: total, totalPages: Math.ceil(total / limit), currentPage: page, perPage: limit },
    });
  } catch (error) {
    console.error("Get Products By Brand Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
>>>>>>> c987b89 (final)

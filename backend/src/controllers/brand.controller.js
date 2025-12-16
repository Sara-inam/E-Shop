import mongoose from "mongoose";
import Brand from "../models/brand.model.js";
// In-memory cache
const memoryCache = {
    brands: null,
    timestamp: null,
    ttl: 3600 * 1000, // 1 hour 
};
// Helper: flush cache
const flushBrandCache = () => {
    memoryCache.brands = null;
    memoryCache.timestamp = null;
};
// CREATE Brand (POST) with transaction
export const createBrand = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, description } = req.body;
        // Check if brand with same name exists
        const existing = await Brand.findOne({ name }).session(session);
        if (existing) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Brand with this name already exists" });
        }
        const brand = await Brand.create([{ name, description }], { session });

        await session.commitTransaction();
        session.endSession();
        flushBrandCache();

        res.status(200).json({ message: "Brand created successfully", brand: brand[0] });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// GET Brands (no transaction/session, read-only)
export const getBrand = async (req, res) => {
    try {
        const now = Date.now();

        if (
            memoryCache.brands &&
            memoryCache.timestamp + memoryCache.ttl > now
        ) {
            return res.status(200).json({ brands: memoryCache.brands, source: "cache" });
        }

        const brands = await Brand.find()
            .sort({ createdAt: -1 })
            .lean();

        memoryCache.brands = brands;
        memoryCache.timestamp = now;

        res.status(200).json({ brands, source: "database" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

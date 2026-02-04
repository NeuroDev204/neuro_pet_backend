import mongoose from "mongoose";
import { env } from "./env.config";

/**
 * MongoDB Connection
 */
export const connectMongo = async (): Promise<void> => {
    try {
        await mongoose.connect(env.mongoUri);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
};

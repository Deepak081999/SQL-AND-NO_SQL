// db/mongo.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false; // prevent multiple connections

const connectMongoDB = async () => {
    if (isConnected) {
        console.log("🟢 MongoDB already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log("🟢 Connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectMongoDB;

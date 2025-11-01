import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectMongoDB from "./db/mongo.js";
import queryRoutes from "./routes/queryRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB once
connectMongoDB();

// ✅ Register routes
app.use("/api/query", queryRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

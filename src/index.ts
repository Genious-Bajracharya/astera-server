import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import careerRoutes from "./routes/career.routes";
import buyRoutes from "./routes/buy.routes";
import offplanRoutes from "./routes/offplan.route";
import userRoutes from "./routes/user.route";
import blogsRoutes from "./routes/blogs.route";
import teamRoutes from "./routes/team.route";
import adminRoutes from "./routes/admin.routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);

// Database
const mongoURI = process.env.MONGO_URI || "";
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

app.use("/api/careers", careerRoutes);

app.use("/api/buy", buyRoutes);

app.use("/api/offplan", offplanRoutes);

app.use("/api/user", userRoutes);

app.use("/api/blogs", blogsRoutes);
app.use("/api/team", teamRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

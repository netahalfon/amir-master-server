require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRouter = require("./routers");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://amir-master.vercel.app",
  "https://amir-master-client-adjqfnee-neta303366-gmailcoms-projects.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());

// Routers (API)
app.use("/api", apiRouter);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port :${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

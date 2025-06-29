require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRouter = require("./routers");
const cookieParser = require("cookie-parser");
const path = require("path");
const next = require("next");

const nextApp = next({ dev:false, dir: path.join(__dirname, "client") });
const handle = nextApp.getRequestHandler();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: true | "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Routers (API)
app.use("/api", apiRouter);

// Start app
nextApp.prepare().then(() => {
  mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
      console.log("✅ Connected to MongoDB");

      const PORT = process.env.PORT || 5000;

      // כל הבקשות הלא-API עוברות ל-Next
      app.all("*", (req, res) => {
        return handle(req, res);
      });

      app.listen(PORT, () =>
        console.log(`🚀 Server + Next ready on http://localhost:${PORT}`)
      );
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
    });
});

// Medicine Inventory Management System - Backend Server
// Node.js + Express + MongoDB

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medical_inventory";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    console.log(`📊 Database: medical_inventory`);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });

// Import Routes
const medicineRoutes = require("./routes/medicineRoutes");

// API Routes
app.use("/api/medicines", medicineRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Medicine Inventory Management System API",
    version: "1.0.0",
    endpoints: {
      addMedicine: "POST /api/medicines/add",
      getAllMedicines: "GET /api/medicines/all",
      searchByName: "GET /api/medicines/search?name=MedicineName",
      getMedicineById: "GET /api/medicines/:id",
      updateMedicine: "PUT /api/medicines/update/:id",
      deleteExpired: "DELETE /api/medicines/deleteExpired",
      deleteMedicine: "DELETE /api/medicines/:id",
      getExpiredMedicines: "GET /api/medicines/expired",
      getLowStock: "GET /api/medicines/lowstock?threshold=50"
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}`);
  console.log(`📚 API documentation: http://localhost:${PORT}/`);
});

module.exports = app;

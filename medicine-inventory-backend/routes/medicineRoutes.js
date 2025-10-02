// Medicine Routes - CRUD APIs
const express = require("express");
const router = express.Router();
const Medicine = require("../models/medicineModel");

// ==================== CREATE ====================

// POST /api/medicines/add - Add new medicine
router.post("/add", async (req, res) => {
  try {
    const { medicineId, name, manufacturer, expiryDate, stock, price } = req.body;

    // Validate required fields and business rules
    if (!medicineId || !name || !manufacturer || expiryDate === undefined || stock === undefined || price === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid expiry date" });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiry < today) {
      return res.status(400).json({ success: false, message: "Cannot add medicine with expired date" });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ success: false, message: "Price must be greater than 0" });
    }

    // Check if medicine with same ID already exists
    const existingMedicine = await Medicine.findOne({ medicineId });
    if (existingMedicine) {
      return res.status(400).json({
        success: false,
        message: `Medicine with ID ${medicineId} already exists`
      });
    }

    // Create new medicine
    const newMedicine = new Medicine({
      medicineId,
      name,
      manufacturer,
      expiryDate,
      stock,
      price
    });

    await newMedicine.save();

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: newMedicine
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error adding medicine",
      error: error.message
    });
  }
});

// ==================== READ ====================

// GET /api/medicines/all - Get all medicines
router.get("/all", async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching medicines",
      error: error.message
    });
  }
});

// GET /api/medicines/search?name=Paracetamol - Search by name
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a medicine name to search"
      });
    }

    // Case-insensitive search using regex
    const medicines = await Medicine.find({
      name: { $regex: name, $options: "i" }
    });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching medicines",
      error: error.message
    });
  }
});

// GET /api/medicines/:id - Get medicine by MongoDB ID
router.get("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching medicine",
      error: error.message
    });
  }
});

// GET /api/medicines/expired - Get all expired medicines
router.get("/expired/list", async (req, res) => {
  try {
    const expiredMedicines = await Medicine.findExpired();

    res.status(200).json({
      success: true,
      count: expiredMedicines.length,
      data: expiredMedicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching expired medicines",
      error: error.message
    });
  }
});

// Alias endpoint: GET /api/medicines/expired
router.get("/expired", async (req, res) => {
  try {
    const expiredMedicines = await Medicine.findExpired();
    res.status(200).json({ success: true, count: expiredMedicines.length, data: expiredMedicines });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching expired medicines", error: error.message });
  }
});

// GET /api/medicines/lowstock?threshold=50 - Get medicines with low stock
router.get("/lowstock/list", async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 50;
    const lowStockMedicines = await Medicine.findLowStock(threshold);

    res.status(200).json({
      success: true,
      count: lowStockMedicines.length,
      threshold: threshold,
      data: lowStockMedicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching low stock medicines",
      error: error.message
    });
  }
});

// Alias endpoint: GET /api/medicines/lowstock
router.get("/lowstock", async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 50;
    const lowStockMedicines = await Medicine.findLowStock(threshold);
    res.status(200).json({ success: true, count: lowStockMedicines.length, threshold, data: lowStockMedicines });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching low stock medicines", error: error.message });
  }
});

// ==================== UPDATE ====================

// PUT /api/medicines/update/:id - Update medicine by ID
router.put("/update/:id", async (req, res) => {
  try {
    const { stock, price, name, manufacturer, expiryDate } = req.body;

    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    // Validate fields if provided
    if (expiryDate) {
      const exp = new Date(expiryDate);
      if (isNaN(exp.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid expiry date" });
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (exp < today) {
        return res.status(400).json({ success: false, message: "Cannot update medicine with expired date" });
      }
    }
    if (price !== undefined) {
      if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ success: false, message: "Price must be greater than 0" });
      }
    }

    // Update fields if provided
    if (stock !== undefined) medicine.stock = stock;
    if (price !== undefined) medicine.price = price;
    if (name) medicine.name = name;
    if (manufacturer) medicine.manufacturer = manufacturer;
    if (expiryDate) medicine.expiryDate = expiryDate;

    await medicine.save();

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating medicine",
      error: error.message
    });
  }
});

// PATCH /api/medicines/stock/:id - Update only stock (for sales/restocking)
router.patch("/stock/:id", async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

    if (!quantity || !operation) {
      return res.status(400).json({
        success: false,
        message: "Please provide quantity and operation (add/subtract)"
      });
    }

    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    if (operation === "add") {
      medicine.stock += quantity;
    } else if (operation === "subtract") {
      if (medicine.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock"
        });
      }
      medicine.stock -= quantity;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid operation. Use 'add' or 'subtract'"
      });
    }

    await medicine.save();

    res.status(200).json({
      success: true,
      message: `Stock ${operation === "add" ? "increased" : "decreased"} successfully`,
      data: medicine
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating stock",
      error: error.message
    });
  }
});

// ==================== DELETE ====================

// DELETE /api/medicines/deleteExpired - Delete all expired medicines
router.delete("/deleteExpired", async (req, res) => {
  try {
    const result = await Medicine.deleteMany({
      expiryDate: { $lt: new Date() }
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} expired medicine(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting expired medicines",
      error: error.message
    });
  }
});

// DELETE /api/medicines/:id - Delete medicine by ID
router.delete("/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
      data: medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting medicine",
      error: error.message
    });
  }
});

module.exports = router;

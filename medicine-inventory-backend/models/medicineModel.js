// Medicine Model - Mongoose Schema
const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  medicineId: {
    type: String,
    required: [true, "Medicine ID is required"],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, "Medicine name is required"],
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, "Manufacturer name is required"],
    trim: true
  },
  expiryDate: {
    type: Date,
    required: [true, "Expiry date is required"],
    validate: {
      validator: function(value) {
        return value instanceof Date && !isNaN(value);
      },
      message: "Invalid expiry date"
    }
  },
  stock: {
    type: Number,
    required: [true, "Stock is required"],
    min: [0, "Stock cannot be negative"],
    validate: {
      validator: Number.isInteger,
      message: "Stock must be an integer"
    }
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update 'updatedAt' before saving
medicineSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to update 'updatedAt' before updating
medicineSchema.pre("findOneAndUpdate", function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Instance method to check if medicine is expired
medicineSchema.methods.isExpired = function() {
  return this.expiryDate < new Date();
};

// Static method to find expired medicines
medicineSchema.statics.findExpired = function() {
  return this.find({ expiryDate: { $lt: new Date() } });
};

// Static method to find medicines with low stock
medicineSchema.statics.findLowStock = function(threshold = 50) {
  return this.find({ stock: { $lt: threshold } });
};

module.exports = mongoose.model("Medicine", medicineSchema);

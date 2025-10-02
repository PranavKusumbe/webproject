// Medicine Inventory Management System - MongoDB Setup
// Database: medical_inventory
// Collection: medicines

// Switch to the database
use medical_inventory;

// Drop the collection if it exists (for clean setup)
db.medicines.drop();

// Create collection with JSON Schema validation
db.createCollection("medicines", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["medicineId", "name", "manufacturer", "expiryDate", "stock", "price"],
      properties: {
        medicineId: {
          bsonType: "string",
          description: "Unique medicine identifier - required"
        },
        name: {
          bsonType: "string",
          description: "Medicine name - required"
        },
        manufacturer: {
          bsonType: "string",
          description: "Company/Manufacturer name - required"
        },
        expiryDate: {
          bsonType: "date",
          description: "Expiry date of medicine - required"
        },
        stock: {
          bsonType: "int",
          minimum: 0,
          description: "Available stock - must be an integer >= 0"
        },
        price: {
          bsonType: "int",
          minimum: 0,
          description: "Price per unit - must be an integer >= 0"
        },
        createdAt: {
          bsonType: "date",
          description: "Record creation date"
        },
        updatedAt: {
          bsonType: "date",
          description: "Last update date"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

print("✓ Collection 'medicines' created with schema validation");

// Insert sample data
db.medicines.insertMany([
  {
    medicineId: "M001",
    name: "Paracetamol",
    manufacturer: "Cipla",
    expiryDate: new Date("2026-05-01"),
    stock: NumberInt(50),
    price: NumberInt(15),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    medicineId: "M002",
    name: "Amoxicillin",
    manufacturer: "Sun Pharma",
    expiryDate: new Date("2025-09-10"),
    stock: NumberInt(100),
    price: NumberInt(25),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✓ Sample data inserted successfully");

// Create indexes
db.medicines.createIndex({ name: 1 }, { name: "idx_name" });
print("✓ Index created on 'name' field");

db.medicines.createIndex({ manufacturer: 1 }, { name: "idx_manufacturer" });
print("✓ Index created on 'manufacturer' field");

// Create unique index on medicineId for data integrity
db.medicines.createIndex({ medicineId: 1 }, { unique: true, name: "idx_medicineId_unique" });
print("✓ Unique index created on 'medicineId' field");

// Create index on expiryDate for efficient expiry queries
db.medicines.createIndex({ expiryDate: 1 }, { name: "idx_expiryDate" });
print("✓ Index created on 'expiryDate' field");

print("\n==========================================");
print("Setup completed successfully!");
print("==========================================\n");

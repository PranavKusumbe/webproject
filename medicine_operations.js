// Medicine Inventory Management System - CRUD Operations
// Database: medical_inventory
// Collection: medicines

use medical_inventory;

print("\n==========================================");
print("CRUD OPERATIONS FOR MEDICINE INVENTORY");
print("==========================================\n");

// ========== UPDATE OPERATIONS ==========

// 1. Update stock of a medicine (Paracetamol - increase by 20 units)
print("1. Update stock of Paracetamol (increase by 20 units):");
var updateResult1 = db.medicines.updateOne(
  { medicineId: "M001" },
  { 
    $inc: { stock: 20 },
    $set: { updatedAt: new Date() }
  }
);
print("Matched: " + updateResult1.matchedCount + ", Modified: " + updateResult1.modifiedCount);

// 2. Update price of a medicine
print("\n2. Update price of Amoxicillin to 30:");
var updateResult2 = db.medicines.updateOne(
  { medicineId: "M002" },
  { 
    $set: { 
      price: NumberInt(30),
      updatedAt: new Date()
    }
  }
);
print("Matched: " + updateResult2.matchedCount + ", Modified: " + updateResult2.modifiedCount);

// 3. Decrease stock when medicine is sold
print("\n3. Decrease stock of Paracetamol by 10 units (sale):");
var updateResult3 = db.medicines.updateOne(
  { medicineId: "M001", stock: { $gte: 10 } },
  { 
    $inc: { stock: -10 },
    $set: { updatedAt: new Date() }
  }
);
print("Matched: " + updateResult3.matchedCount + ", Modified: " + updateResult3.modifiedCount);

// 4. Update multiple fields at once
print("\n4. Update multiple fields for a medicine:");
var updateResult4 = db.medicines.updateOne(
  { medicineId: "M001" },
  { 
    $set: { 
      manufacturer: "Cipla Ltd.",
      updatedAt: new Date()
    }
  }
);
print("Matched: " + updateResult4.matchedCount + ", Modified: " + updateResult4.modifiedCount);

// ========== INSERT OPERATIONS ==========

// 5. Insert a new medicine
print("\n5. Insert a new medicine (Ibuprofen):");
try {
  var insertResult = db.medicines.insertOne({
    medicineId: "M003",
    name: "Ibuprofen",
    manufacturer: "Dr. Reddy's",
    expiryDate: new Date("2026-12-31"),
    stock: NumberInt(75),
    price: NumberInt(20),
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print("Inserted ID: " + insertResult.insertedId);
} catch (e) {
  print("Error: " + e.message);
}

// ========== DELETE OPERATIONS ==========

// 6. Delete expired medicines
print("\n6. Delete expired medicines:");
var currentDate = new Date();
var deleteResult = db.medicines.deleteMany({ 
  expiryDate: { $lt: currentDate } 
});
print("Deleted count: " + deleteResult.deletedCount);

// 7. Delete a specific medicine by ID
print("\n7. Example: Delete medicine by ID (commented out for safety):");
print("// db.medicines.deleteOne({ medicineId: 'M003' });");

// ========== FIND OPERATIONS ==========

// 8. View all medicines after updates
print("\n8. View all medicines after operations:");
var allMedicines = db.medicines.find().sort({ medicineId: 1 }).pretty();
printjson(allMedicines.toArray());

// ========== BULK OPERATIONS ==========

// 9. Bulk update - increase all prices by 10%
print("\n9. Bulk update - increase all prices by 10%:");
var bulkUpdateResult = db.medicines.updateMany(
  {},
  [
    {
      $set: {
        price: { $toInt: { $multiply: ["$price", 1.1] } },
        updatedAt: new Date()
      }
    }
  ]
);
print("Matched: " + bulkUpdateResult.matchedCount + ", Modified: " + bulkUpdateResult.modifiedCount);

// 10. Find and update operation (useful for atomic operations)
print("\n10. Find and update (get old value while updating):");
var findAndUpdateResult = db.medicines.findOneAndUpdate(
  { medicineId: "M001" },
  { 
    $set: { updatedAt: new Date() }
  },
  { 
    returnNewDocument: false  // return the document before update
  }
);
print("Old document:");
printjson(findAndUpdateResult);

print("\n==========================================");
print("All operations completed successfully!");
print("==========================================\n");

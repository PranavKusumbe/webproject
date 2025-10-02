// Medicine Inventory Management System - Query Operations
// Database: medical_inventory
// Collection: medicines

use medical_inventory;

print("\n==========================================");
print("USEFUL QUERIES FOR MEDICINE INVENTORY");
print("==========================================\n");

// 1. Find medicine by name
print("1. Find medicine by name (Paracetamol):");
var result1 = db.medicines.find({ name: "Paracetamol" }).pretty();
printjson(result1.toArray());

// 2. Find expired medicines (expiryDate < current date)
print("\n2. Find expired medicines:");
var currentDate = new Date();
var expiredMedicines = db.medicines.find({ 
  expiryDate: { $lt: currentDate } 
}).pretty();
printjson(expiredMedicines.toArray());

// 3. Find medicines by manufacturer
print("\n3. Find medicines by manufacturer (Cipla):");
var result3 = db.medicines.find({ manufacturer: "Cipla" }).pretty();
printjson(result3.toArray());

// 4. Find medicines with low stock (less than 75 units)
print("\n4. Find medicines with low stock (<75 units):");
var lowStock = db.medicines.find({ stock: { $lt: 75 } }).pretty();
printjson(lowStock.toArray());

// 5. Find all medicines sorted by expiry date
print("\n5. All medicines sorted by expiry date:");
var sortedByExpiry = db.medicines.find().sort({ expiryDate: 1 }).pretty();
printjson(sortedByExpiry.toArray());

// 6. Count total medicines in inventory
print("\n6. Total medicines count:");
var totalCount = db.medicines.countDocuments();
print("Total medicines: " + totalCount);

// 7. Get medicines expiring within next 6 months
print("\n7. Medicines expiring within next 6 months:");
var sixMonthsFromNow = new Date();
sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
var expiringSoon = db.medicines.find({
  expiryDate: {
    $gte: currentDate,
    $lte: sixMonthsFromNow
  }
}).pretty();
printjson(expiringSoon.toArray());

// 8. Calculate total inventory value
print("\n8. Calculate total inventory value:");
var totalValue = db.medicines.aggregate([
  {
    $group: {
      _id: null,
      totalValue: {
        $sum: { $multiply: ["$stock", "$price"] }
      }
    }
  }
]);
printjson(totalValue.toArray());

print("\n==========================================");
print("All queries executed successfully!");
print("==========================================\n");

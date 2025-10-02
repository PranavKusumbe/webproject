# Medicine Inventory Management System - MongoDB

A comprehensive MongoDB database schema for managing medicine inventory with validation, indexes, and useful queries.

## Database Information

- **Database Name**: `medical_inventory`
- **Collection Name**: `medicines`

## Document Schema

```javascript
{
  medicineId: String,      // Unique medicine identifier (e.g., M001)
  name: String,            // Medicine name (e.g., Paracetamol)
  manufacturer: String,    // Company/Manufacturer (e.g., Cipla)
  expiryDate: Date,        // Expiry date of medicine
  stock: Number (Int),     // Available stock (integer >= 0)
  price: Number (Int),     // Price per unit (integer >= 0)
  createdAt: Date,         // Record creation date
  updatedAt: Date          // Last update date
}
```

## Validation Rules

- **Required Fields**: medicineId, name, manufacturer, expiryDate, stock, price
- **Stock**: Must be an integer >= 0
- **Price**: Must be an integer >= 0
- **ExpiryDate**: Must be a valid date
- **Validation Level**: Strict
- **Validation Action**: Error (rejects invalid documents)

## Indexes

1. **name** (idx_name): For fast medicine name searches
2. **manufacturer** (idx_manufacturer): For filtering by manufacturer
3. **medicineId** (idx_medicineId_unique): Unique index for data integrity
4. **expiryDate** (idx_expiryDate): For efficient expiry date queries

## Setup Instructions

### Prerequisites
- MongoDB installed and running
- MongoDB Shell (mongosh) or MongoDB Compass

### Installation Steps

1. **Run the setup script** to create the collection with validation and sample data:
   ```bash
   mongosh < medicine_inventory_setup.js
   ```
   Or connect to MongoDB and run:
   ```bash
   mongosh
   load('medicine_inventory_setup.js')
   ```

2. **Test queries** using the queries script:
   ```bash
   mongosh < medicine_queries.js
   ```

3. **Perform CRUD operations** using the operations script:
   ```bash
   mongosh < medicine_operations.js
   ```

## Sample Data

The setup script includes two sample medicines:

1. **Paracetamol** (M001)
   - Manufacturer: Cipla
   - Expiry: 2026-05-01
   - Stock: 50 units
   - Price: ₹15

2. **Amoxicillin** (M002)
   - Manufacturer: Sun Pharma
   - Expiry: 2025-09-10
   - Stock: 100 units
   - Price: ₹25

## Common Queries

### Find Medicine by Name
```javascript
db.medicines.find({ name: "Paracetamol" })
```

### Find Expired Medicines
```javascript
db.medicines.find({ expiryDate: { $lt: new Date() } })
```

### Find Medicines Expiring Soon (next 6 months)
```javascript
var sixMonthsFromNow = new Date();
sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
db.medicines.find({
  expiryDate: {
    $gte: new Date(),
    $lte: sixMonthsFromNow
  }
})
```

### Find by Manufacturer
```javascript
db.medicines.find({ manufacturer: "Cipla" })
```

### Find Low Stock Items
```javascript
db.medicines.find({ stock: { $lt: 50 } })
```

## CRUD Operations

### Create (Insert)
```javascript
db.medicines.insertOne({
  medicineId: "M003",
  name: "Ibuprofen",
  manufacturer: "Dr. Reddy's",
  expiryDate: new Date("2026-12-31"),
  stock: NumberInt(75),
  price: NumberInt(20),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Read (Find)
```javascript
// Find all
db.medicines.find()

// Find with filter
db.medicines.find({ manufacturer: "Cipla" })

// Find one
db.medicines.findOne({ medicineId: "M001" })
```

### Update Stock
```javascript
// Increase stock
db.medicines.updateOne(
  { medicineId: "M001" },
  { 
    $inc: { stock: 20 },
    $set: { updatedAt: new Date() }
  }
)

// Decrease stock (sale)
db.medicines.updateOne(
  { medicineId: "M001", stock: { $gte: 10 } },
  { 
    $inc: { stock: -10 },
    $set: { updatedAt: new Date() }
  }
)
```

### Update Price
```javascript
db.medicines.updateOne(
  { medicineId: "M001" },
  { 
    $set: { 
      price: NumberInt(18),
      updatedAt: new Date()
    }
  }
)
```

### Delete Expired Medicines
```javascript
db.medicines.deleteMany({ 
  expiryDate: { $lt: new Date() } 
})
```

### Delete Specific Medicine
```javascript
db.medicines.deleteOne({ medicineId: "M003" })
```

## Advanced Operations

### Calculate Total Inventory Value
```javascript
db.medicines.aggregate([
  {
    $group: {
      _id: null,
      totalValue: {
        $sum: { $multiply: ["$stock", "$price"] }
      },
      totalItems: { $sum: "$stock" }
    }
  }
])
```

### Group by Manufacturer
```javascript
db.medicines.aggregate([
  {
    $group: {
      _id: "$manufacturer",
      count: { $sum: 1 },
      totalStock: { $sum: "$stock" }
    }
  }
])
```

### Bulk Price Update (10% increase)
```javascript
db.medicines.updateMany(
  {},
  [
    {
      $set: {
        price: { $toInt: { $multiply: ["$price", 1.1] } },
        updatedAt: new Date()
      }
    }
  ]
)
```

## File Structure

```
webproject/
├── medicine_inventory_setup.js    # Setup script with schema and sample data
├── medicine_queries.js            # Useful query examples
├── medicine_operations.js         # CRUD operation examples
└── README.md                      # This documentation file
```

## Features

✅ JSON Schema validation for data integrity  
✅ Optimized indexes for fast searches  
✅ Sample data for testing  
✅ Comprehensive query examples  
✅ CRUD operation templates  
✅ Stock management operations  
✅ Expiry tracking and alerts  
✅ Inventory value calculations  

## Best Practices

1. Always use `NumberInt()` for integer fields (stock, price)
2. Update `updatedAt` field whenever a document is modified
3. Check stock availability before decreasing stock
4. Regularly run queries to identify expired medicines
5. Use bulk operations for efficiency when updating multiple documents
6. Backup database regularly
7. Monitor medicines expiring within 6 months

## Troubleshooting

### Validation Error
If you get a validation error, ensure:
- All required fields are present
- Stock and price are integers >= 0
- Dates are valid Date objects
- Use `NumberInt()` for integer values

### Duplicate Key Error
If you get a duplicate key error on `medicineId`:
- Each medicine must have a unique medicineId
- Check if the medicine already exists before inserting

## License

This is a sample project for educational purposes.

## Support

For questions or issues, please refer to the MongoDB documentation:
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [JSON Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/)

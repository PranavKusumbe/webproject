# API Testing Guide

This guide provides step-by-step instructions to test all API endpoints.

## Prerequisites
- Server running on `http://localhost:5000`
- Thunder Client, Postman, or PowerShell

---

## 📝 Test Sequence

### Step 1: Start Server
```bash
cd medicine-inventory-backend
npm start
```

Expected output:
```
✅ Connected to MongoDB successfully!
📊 Database: medical_inventory
🚀 Server is running on port 5000
📡 API endpoint: http://localhost:5000
```

---

### Step 2: Add First Medicine (Paracetamol)

**Request:**
```http
POST http://localhost:5000/api/medicines/add
Content-Type: application/json

{
  "medicineId": "M001",
  "name": "Paracetamol",
  "manufacturer": "Cipla",
  "expiryDate": "2026-05-01",
  "stock": 50,
  "price": 15
}
```

**PowerShell Command:**
```powershell
$body = @{
    medicineId = "M001"
    name = "Paracetamol"
    manufacturer = "Cipla"
    expiryDate = "2026-05-01"
    stock = 50
    price = 15
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/add" -Method POST -ContentType "application/json" -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Medicine added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "medicineId": "M001",
    "name": "Paracetamol",
    "manufacturer": "Cipla",
    "expiryDate": "2026-05-01T00:00:00.000Z",
    "stock": 50,
    "price": 15,
    "createdAt": "2025-10-02T10:30:00.000Z",
    "updatedAt": "2025-10-02T10:30:00.000Z"
  }
}
```

---

### Step 3: Add Second Medicine (Amoxicillin)

**PowerShell Command:**
```powershell
$body = @{
    medicineId = "M002"
    name = "Amoxicillin"
    manufacturer = "Sun Pharma"
    expiryDate = "2025-09-10"
    stock = 100
    price = 25
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/add" -Method POST -ContentType "application/json" -Body $body
```

---

### Step 4: Add Third Medicine (Expired - for testing)

**PowerShell Command:**
```powershell
$body = @{
    medicineId = "M003"
    name = "Aspirin"
    manufacturer = "Bayer"
    expiryDate = "2024-01-01"
    stock = 30
    price = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/add" -Method POST -ContentType "application/json" -Body $body
```

---

### Step 5: Get All Medicines

**PowerShell Command:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/all" -Method GET
```

**Expected Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

### Step 6: Search Medicine by Name

**PowerShell Command:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/search?name=Paracetamol" -Method GET
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "medicineId": "M001",
      "name": "Paracetamol",
      ...
    }
  ]
}
```

---

### Step 7: Get Expired Medicines

**PowerShell Command:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/expired/list" -Method GET
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "medicineId": "M003",
      "name": "Aspirin",
      "expiryDate": "2024-01-01T00:00:00.000Z",
      ...
    }
  ]
}
```

---

### Step 8: Get Low Stock Medicines

**PowerShell Command:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/lowstock/list?threshold=60" -Method GET
```

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "threshold": 60,
  "data": [...]
}
```

---

### Step 9: Update Medicine Stock

First, get the MongoDB ID from Step 5, then:

**PowerShell Command:**
```powershell
$id = "YOUR_MONGODB_ID_HERE"
$body = @{
    stock = 75
    price = 20
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/update/$id" -Method PUT -ContentType "application/json" -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Medicine updated successfully",
  "data": {
    "stock": 75,
    "price": 20,
    ...
  }
}
```

---

### Step 10: Update Stock Only (Add/Subtract)

**Add Stock:**
```powershell
$id = "YOUR_MONGODB_ID_HERE"
$body = @{
    quantity = 20
    operation = "add"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/stock/$id" -Method PATCH -ContentType "application/json" -Body $body
```

**Subtract Stock (Sale):**
```powershell
$id = "YOUR_MONGODB_ID_HERE"
$body = @{
    quantity = 10
    operation = "subtract"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/stock/$id" -Method PATCH -ContentType "application/json" -Body $body
```

---

### Step 11: Delete Expired Medicines

**PowerShell Command:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/deleteExpired" -Method DELETE
```

**Expected Response:**
```json
{
  "success": true,
  "message": "1 expired medicine(s) deleted successfully",
  "deletedCount": 1
}
```

---

### Step 12: Delete Specific Medicine

**PowerShell Command:**
```powershell
$id = "YOUR_MONGODB_ID_HERE"
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/$id" -Method DELETE
```

---

## 🧪 Complete PowerShell Test Script

Save this as `test-api.ps1`:

```powershell
# Medicine Inventory API Test Script

$baseUrl = "http://localhost:5000/api/medicines"

Write-Host "`n========== Testing Medicine Inventory API ==========" -ForegroundColor Cyan

# Test 1: Add Paracetamol
Write-Host "`n1. Adding Paracetamol..." -ForegroundColor Yellow
$body1 = @{
    medicineId = "M001"
    name = "Paracetamol"
    manufacturer = "Cipla"
    expiryDate = "2026-05-01"
    stock = 50
    price = 15
} | ConvertTo-Json
$result1 = Invoke-RestMethod -Uri "$baseUrl/add" -Method POST -ContentType "application/json" -Body $body1
Write-Host "✅ Success: $($result1.message)" -ForegroundColor Green

# Test 2: Add Amoxicillin
Write-Host "`n2. Adding Amoxicillin..." -ForegroundColor Yellow
$body2 = @{
    medicineId = "M002"
    name = "Amoxicillin"
    manufacturer = "Sun Pharma"
    expiryDate = "2025-09-10"
    stock = 100
    price = 25
} | ConvertTo-Json
$result2 = Invoke-RestMethod -Uri "$baseUrl/add" -Method POST -ContentType "application/json" -Body $body2
Write-Host "✅ Success: $($result2.message)" -ForegroundColor Green

# Test 3: Get All Medicines
Write-Host "`n3. Fetching all medicines..." -ForegroundColor Yellow
$result3 = Invoke-RestMethod -Uri "$baseUrl/all" -Method GET
Write-Host "✅ Success: Found $($result3.count) medicines" -ForegroundColor Green
$result3.data | Format-Table medicineId, name, manufacturer, stock, price

# Test 4: Search by Name
Write-Host "`n4. Searching for Paracetamol..." -ForegroundColor Yellow
$result4 = Invoke-RestMethod -Uri "$baseUrl/search?name=Paracetamol" -Method GET
Write-Host "✅ Success: Found $($result4.count) match(es)" -ForegroundColor Green

# Test 5: Update Stock
Write-Host "`n5. Updating stock..." -ForegroundColor Yellow
$medicineId = $result1.data._id
$updateBody = @{
    stock = 75
    price = 20
} | ConvertTo-Json
$result5 = Invoke-RestMethod -Uri "$baseUrl/update/$medicineId" -Method PUT -ContentType "application/json" -Body $updateBody
Write-Host "✅ Success: $($result5.message)" -ForegroundColor Green

# Test 6: Get Low Stock
Write-Host "`n6. Checking low stock medicines..." -ForegroundColor Yellow
$result6 = Invoke-RestMethod -Uri "$baseUrl/lowstock/list?threshold=80" -Method GET
Write-Host "✅ Success: Found $($result6.count) low stock items" -ForegroundColor Green

Write-Host "`n========== All Tests Completed ==========" -ForegroundColor Cyan
```

Run with:
```powershell
.\test-api.ps1
```

---

## 🐛 Troubleshooting

### Error: Cannot connect to server
**Solution:** Make sure the server is running on port 5000

### Error: Medicine already exists
**Solution:** Each medicineId must be unique. Use a different ID or delete the existing one first.

### Error: Validation failed
**Solution:** Check that all required fields are provided:
- medicineId (String)
- name (String)
- manufacturer (String)
- expiryDate (Date in YYYY-MM-DD format)
- stock (Number >= 0)
- price (Number >= 0)

---

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] Can add new medicine
- [ ] Can fetch all medicines
- [ ] Can search by name
- [ ] Can update medicine
- [ ] Can get expired medicines
- [ ] Can get low stock medicines
- [ ] Can delete expired medicines
- [ ] All responses follow consistent format

---

**Happy Testing! 🚀**

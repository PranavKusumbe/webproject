# Medicine Inventory API - Complete Test Script
# Run this script to test all API endpoints

$baseUrl = "http://localhost:5000/api/medicines"
$ErrorActionPreference = "Continue"

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Medicine Inventory Management System - API Tests    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Test 1: Add Paracetamol
Write-Host "`n[Test 1] Adding Paracetamol M001..." -ForegroundColor Yellow
try {
    $body1 = @{
        medicineId = "M001"
        name = "Paracetamol"
        manufacturer = "Cipla"
        expiryDate = "2026-05-01"
        stock = 50
        price = 15
    } | ConvertTo-Json
    
    $result1 = Invoke-RestMethod -Uri "$baseUrl/add" -Method POST -ContentType "application/json" -Body $body1
    Write-Host "✅ SUCCESS: $($result1.message)" -ForegroundColor Green
    Write-Host "   Medicine ID: $($result1.data.medicineId)" -ForegroundColor Gray
    Write-Host "   Database ID: $($result1.data._id)" -ForegroundColor Gray
    $medicineId1 = $result1.data._id
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 2: Add Amoxicillin
Write-Host "`n[Test 2] Adding Amoxicillin M002..." -ForegroundColor Yellow
try {
    $body2 = @{
        medicineId = "M002"
        name = "Amoxicillin"
        manufacturer = "Sun Pharma"
        expiryDate = "2025-09-10"
        stock = 100
        price = 25
    } | ConvertTo-Json
    
    $result2 = Invoke-RestMethod -Uri "$baseUrl/add" -Method POST -ContentType "application/json" -Body $body2
    Write-Host "✅ SUCCESS: $($result2.message)" -ForegroundColor Green
    Write-Host "   Medicine ID: $($result2.data.medicineId)" -ForegroundColor Gray
    $medicineId2 = $result2.data._id
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 3: Add Expired Medicine - Aspirin
Write-Host "`n[Test 3] Adding Aspirin M003 - EXPIRED for testing..." -ForegroundColor Yellow
try {
    $body3 = @{
        medicineId = "M003"
        name = "Aspirin"
        manufacturer = "Bayer"
        expiryDate = "2024-01-01"
        stock = 30
        price = 10
    } | ConvertTo-Json
    
    $result3 = Invoke-RestMethod -Uri "$baseUrl/add" -Method POST -ContentType "application/json" -Body $body3
    Write-Host "✅ SUCCESS: $($result3.message)" -ForegroundColor Green
    Write-Host "   Medicine ID: $($result3.data.medicineId)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 4: Get All Medicines
Write-Host "`n[Test 4] Fetching all medicines..." -ForegroundColor Yellow
try {
    $result4 = Invoke-RestMethod -Uri "$baseUrl/all" -Method GET
    Write-Host "✅ SUCCESS: Found $($result4.count) medicine(s)" -ForegroundColor Green
    Write-Host "`n   Medicine List:" -ForegroundColor Cyan
    $result4.data | ForEach-Object {
        Write-Host "   • $($_.medicineId) - $($_.name) | Stock: $($_.stock) | Price: ₹$($_.price)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 5: Search by Name
Write-Host "`n[Test 5] Searching for 'Paracetamol'..." -ForegroundColor Yellow
try {
    $result5 = Invoke-RestMethod -Uri "$baseUrl/search?name=Paracetamol" -Method GET
    Write-Host "✅ SUCCESS: Found $($result5.count) match(es)" -ForegroundColor Green
    if ($result5.count -gt 0) {
        Write-Host "   Found: $($result5.data[0].name) by $($result5.data[0].manufacturer)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 6: Get Expired Medicines
Write-Host "`n[Test 6] Checking expired medicines..." -ForegroundColor Yellow
try {
    $result6 = Invoke-RestMethod -Uri "$baseUrl/expired/list" -Method GET
    Write-Host "✅ SUCCESS: Found $($result6.count) expired medicine(s)" -ForegroundColor Green
    if ($result6.count -gt 0) {
        $result6.data | ForEach-Object {
            Write-Host "   ⚠ EXPIRED: $($_.name) (Expired: $($_.expiryDate))" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 7: Get Low Stock Medicines
Write-Host "`n[Test 7] Checking low stock medicines with threshold 60..." -ForegroundColor Yellow
try {
    $result7 = Invoke-RestMethod -Uri "$baseUrl/lowstock/list?threshold=60" -Method GET
    Write-Host "✅ SUCCESS: Found $($result7.count) low stock item(s)" -ForegroundColor Green
    if ($result7.count -gt 0) {
        $result7.data | ForEach-Object {
            Write-Host "   ⚠ LOW STOCK: $($_.name) - Only $($_.stock) units left" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 8: Update Medicine
Write-Host "`n[Test 8] Updating Paracetamol stock to 75 and price to 20..." -ForegroundColor Yellow
try {
    if ($medicineId1) {
        $updateBody = @{
            stock = 75
            price = 20
        } | ConvertTo-Json
        
        $result8 = Invoke-RestMethod -Uri "$baseUrl/update/$medicineId1" -Method PUT -ContentType "application/json" -Body $updateBody
        Write-Host "✅ SUCCESS: $($result8.message)" -ForegroundColor Green
        Write-Host "   New Stock: $($result8.data.stock) | New Price: ₹$($result8.data.price)" -ForegroundColor Gray
    } else {
        Write-Host "⚠ SKIPPED: No medicine ID available from Test 1" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 9: Update Stock Only (Add)
Write-Host "`n[Test 9] Adding 20 units to Amoxicillin stock..." -ForegroundColor Yellow
try {
    if ($medicineId2) {
        $stockBody = @{
            quantity = 20
            operation = "add"
        } | ConvertTo-Json
        
        $result9 = Invoke-RestMethod -Uri "$baseUrl/stock/$medicineId2" -Method PATCH -ContentType "application/json" -Body $stockBody
        Write-Host "✅ SUCCESS: $($result9.message)" -ForegroundColor Green
        Write-Host "   New Stock: $($result9.data.stock) units" -ForegroundColor Gray
    } else {
        Write-Host "⚠ SKIPPED: No medicine ID available from Test 2" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 10: Update Stock Only (Subtract - Sale)
Write-Host "`n[Test 10] Selling 10 units of Amoxicillin..." -ForegroundColor Yellow
try {
    if ($medicineId2) {
        $saleBody = @{
            quantity = 10
            operation = "subtract"
        } | ConvertTo-Json
        
        $result10 = Invoke-RestMethod -Uri "$baseUrl/stock/$medicineId2" -Method PATCH -ContentType "application/json" -Body $saleBody
        Write-Host "✅ SUCCESS: $($result10.message)" -ForegroundColor Green
        Write-Host "   Remaining Stock: $($result10.data.stock) units" -ForegroundColor Gray
    } else {
        Write-Host "⚠ SKIPPED: No medicine ID available from Test 2" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 11: Get Medicine by ID
Write-Host "`n[Test 11] Fetching Paracetamol by ID..." -ForegroundColor Yellow
try {
    if ($medicineId1) {
        $result11 = Invoke-RestMethod -Uri "$baseUrl/$medicineId1" -Method GET
        Write-Host "✅ SUCCESS: Retrieved $($result11.data.name)" -ForegroundColor Green
        Write-Host "   Stock: $($result11.data.stock) | Price: ₹$($result11.data.price)" -ForegroundColor Gray
    } else {
        Write-Host "⚠ SKIPPED: No medicine ID available" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 12: Delete Expired Medicines
Write-Host "`n[Test 12] Deleting expired medicines..." -ForegroundColor Yellow
try {
    $result12 = Invoke-RestMethod -Uri "$baseUrl/deleteExpired" -Method DELETE
    Write-Host "✅ SUCCESS: $($result12.message)" -ForegroundColor Green
    Write-Host "   Deleted: $($result12.deletedCount) expired medicine(s)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Final Summary
Write-Host "`n[Final Check] Fetching final medicine list..." -ForegroundColor Yellow
try {
    $finalResult = Invoke-RestMethod -Uri "$baseUrl/all" -Method GET
    Write-Host "✅ SUCCESS: Final count = $($finalResult.count) medicine(s)" -ForegroundColor Green
    Write-Host "`n   Final Medicine Inventory:" -ForegroundColor Cyan
    Write-Host "   ═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    $finalResult.data | ForEach-Object {
        $expiryStatus = if ([DateTime]$_.expiryDate -lt (Get-Date)) { "⚠ EXPIRED" } else { "✓ Valid" }
        Write-Host "   ID: $($_.medicineId) | $($_.name)" -ForegroundColor White
        Write-Host "      Manufacturer: $($_.manufacturer)" -ForegroundColor Gray
        Write-Host "      Stock: $($_.stock) units | Price: ₹$($_.price)" -ForegroundColor Gray
        Write-Host "      Expiry: $($_.expiryDate) - $expiryStatus" -ForegroundColor Gray
        Write-Host ""
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              All API Tests Completed! ✅              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

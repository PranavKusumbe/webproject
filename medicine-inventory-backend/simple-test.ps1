# Simple API Test Script
$baseUrl = "http://localhost:5000/api/medicines"

Write-Host "`nMedicine Inventory API Tests`n" -ForegroundColor Cyan

# Test 1: Add Paracetamol
Write-Host "[Test 1] Adding Paracetamol..." -ForegroundColor Yellow
$body1 = '{"medicineId":"M001","name":"Paracetamol","manufacturer":"Cipla","expiryDate":"2026-05-01","stock":50,"price":15}'
try {
    $result1 = Invoke-RestMethod -Uri "$baseUrl/add" -Method POST -ContentType "application/json" -Body $body1
    Write-Host "SUCCESS: Medicine added - $($result1.data.name)" -ForegroundColor Green
    $id1 = $result1.data._id
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 2: Add Amoxicillin
Write-Host "`n[Test 2] Adding Amoxicillin..." -ForegroundColor Yellow
$body2 = '{"medicineId":"M002","name":"Amoxicillin","manufacturer":"Sun Pharma","expiryDate":"2025-09-10","stock":100,"price":25}'
try {
    $result2 = Invoke-RestMethod -Uri "$baseUrl/add" -Method POST -ContentType "application/json" -Body $body2
    Write-Host "SUCCESS: Medicine added - $($result2.data.name)" -ForegroundColor Green
    $id2 = $result2.data._id
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 3: Add Expired Medicine
Write-Host "`n[Test 3] Adding Aspirin (Expired)..." -ForegroundColor Yellow
$body3 = '{"medicineId":"M003","name":"Aspirin","manufacturer":"Bayer","expiryDate":"2024-01-01","stock":30,"price":10}'
try {
    $result3 = Invoke-RestMethod -Uri "$baseUrl/add" -Method POST -ContentType "application/json" -Body $body3
    Write-Host "SUCCESS: Medicine added - $($result3.data.name)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 4: Get All Medicines
Write-Host "`n[Test 4] Getting all medicines..." -ForegroundColor Yellow
try {
    $result4 = Invoke-RestMethod -Uri "$baseUrl/all" -Method GET
    Write-Host "SUCCESS: Found $($result4.count) medicines" -ForegroundColor Green
    $result4.data | ForEach-Object {
        Write-Host "  - $($_.medicineId): $($_.name) | Stock: $($_.stock) | Price: $($_.price)" -ForegroundColor White
    }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 5: Search by Name
Write-Host "`n[Test 5] Searching for Paracetamol..." -ForegroundColor Yellow
try {
    $result5 = Invoke-RestMethod -Uri "$baseUrl/search?name=Paracetamol" -Method GET
    Write-Host "SUCCESS: Found $($result5.count) match(es)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 6: Get Expired Medicines
Write-Host "`n[Test 6] Getting expired medicines..." -ForegroundColor Yellow
try {
    $result6 = Invoke-RestMethod -Uri "$baseUrl/expired/list" -Method GET
    Write-Host "SUCCESS: Found $($result6.count) expired medicine(s)" -ForegroundColor Green
    $result6.data | ForEach-Object {
        Write-Host "  EXPIRED: $($_.name)" -ForegroundColor Red
    }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Test 7: Update Medicine
Write-Host "`n[Test 7] Updating Paracetamol stock to 75..." -ForegroundColor Yellow
if ($id1) {
    $updateBody = '{"stock":75,"price":20}'
    try {
        $result7 = Invoke-RestMethod -Uri "$baseUrl/update/$id1" -Method PUT -ContentType "application/json" -Body $updateBody
        Write-Host "SUCCESS: Updated - Stock: $($result7.data.stock), Price: $($result7.data.price)" -ForegroundColor Green
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIPPED: No ID available" -ForegroundColor Yellow
}

Start-Sleep -Seconds 1

# Test 8: Stock Operation - Add
Write-Host "`n[Test 8] Adding 20 units to Amoxicillin..." -ForegroundColor Yellow
if ($id2) {
    $stockBody = '{"quantity":20,"operation":"add"}'
    try {
        $result8 = Invoke-RestMethod -Uri "$baseUrl/stock/$id2" -Method PATCH -ContentType "application/json" -Body $stockBody
        Write-Host "SUCCESS: New stock: $($result8.data.stock)" -ForegroundColor Green
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIPPED: No ID available" -ForegroundColor Yellow
}

Start-Sleep -Seconds 1

# Test 9: Stock Operation - Subtract
Write-Host "`n[Test 9] Selling 10 units of Amoxicillin..." -ForegroundColor Yellow
if ($id2) {
    $saleBody = '{"quantity":10,"operation":"subtract"}'
    try {
        $result9 = Invoke-RestMethod -Uri "$baseUrl/stock/$id2" -Method PATCH -ContentType "application/json" -Body $saleBody
        Write-Host "SUCCESS: Remaining stock: $($result9.data.stock)" -ForegroundColor Green
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "SKIPPED: No ID available" -ForegroundColor Yellow
}

Start-Sleep -Seconds 1

# Test 10: Delete Expired
Write-Host "`n[Test 10] Deleting expired medicines..." -ForegroundColor Yellow
try {
    $result10 = Invoke-RestMethod -Uri "$baseUrl/deleteExpired" -Method DELETE
    Write-Host "SUCCESS: Deleted $($result10.deletedCount) expired medicine(s)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 1

# Final Check
Write-Host "`n[Final] Getting final medicine list..." -ForegroundColor Yellow
try {
    $final = Invoke-RestMethod -Uri "$baseUrl/all" -Method GET
    Write-Host "SUCCESS: Final count = $($final.count) medicine(s)" -ForegroundColor Green
    Write-Host "`nFinal Inventory:" -ForegroundColor Cyan
    $final.data | ForEach-Object {
        Write-Host "  ID: $($_.medicineId) | Name: $($_.name) | Stock: $($_.stock) | Price: $($_.price)" -ForegroundColor White
    }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAll Tests Completed!`n" -ForegroundColor Cyan

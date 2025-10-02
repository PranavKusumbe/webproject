# ✅ Phase 5 Testing Checklist

## 🎯 Quick Start Testing Guide

### Prerequisites
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] MongoDB running on port 27017
- [ ] Browser console open (F12) for logs

---

## 📋 Test Cases

### ✅ Test 1: Add Valid Medicine (Happy Path)
**Steps:**
1. Go to http://localhost:3000/add-medicine
2. Fill in:
   - Medicine ID: `M003`
   - Name: `Aspirin`
   - Manufacturer: `Bayer`
   - Expiry Date: `2025-12-31`
   - Stock: `50`
   - Price: `12.50`
3. Click "Add Medicine"

**Expected Result:**
- [ ] ✅ Green success message appears
- [ ] Success shows: Medicine ID, Name, Stock
- [ ] Redirects to dashboard after 2 seconds
- [ ] Medicine appears in dashboard

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ⚠️ Test 2: Expired Date Prevention (Critical)
**Steps:**
1. Go to http://localhost:3000/add-medicine
2. Fill in all fields
3. For Expiry Date, try to select a past date (e.g., 2023-01-01)

**Expected Result:**
- [ ] 🚫 Date picker blocks selecting past dates (HTML5 min attribute)
- [ ] ⚠️ Red warning appears: "Cannot add medicine with expired date!"
- [ ] Submission is blocked if attempted

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ⚠️ Test 3: Low Stock Warning
**Steps:**
1. Go to http://localhost:3000/add-medicine
2. Fill in all fields
3. Enter Stock: `5` (less than 10)

**Expected Result:**
- [ ] ⚠️ Yellow warning appears below stock field
- [ ] Warning text: "Low Stock Warning: Below 10 units"
- [ ] Medicine can still be added
- [ ] Success message includes low stock warning
- [ ] Console shows: `⚠️ Warning: Aspirin added with low stock (5 units)`

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ⚠️ Test 4: Expiring Soon Warning
**Steps:**
1. Go to http://localhost:3000/add-medicine
2. Fill in all fields
3. Select Expiry Date within 30 days from today

**Expected Result:**
- [ ] ⚠️ Yellow warning appears: "Medicine expires within 30 days"
- [ ] Medicine can still be added
- [ ] Warning is informational only

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ❌ Test 5: Network Error Handling
**Steps:**
1. **Stop the backend server** (Ctrl+C in backend terminal)
2. Go to http://localhost:3000/add-medicine
3. Fill form with valid data
4. Click "Add Medicine"

**Expected Result:**
- [ ] ❌ Red error message appears
- [ ] Error text: "Network Error: Cannot connect to server..."
- [ ] Troubleshooting section shows:
  - "Check if backend server is running on port 5000"
  - "Verify all required fields are filled correctly"
  - "Ensure expiry date is not in the past"
  - "Check that stock and price are positive numbers"
- [ ] Form data is preserved (not cleared)

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ❌ Test 6: Missing Required Fields
**Steps:**
1. Go to http://localhost:3000/add-medicine
2. Leave "Name" field empty
3. Fill other fields
4. Click "Add Medicine"

**Expected Result:**
- [ ] 🚫 HTML5 validation blocks submission
- [ ] Browser shows: "Please fill out this field" tooltip
- [ ] Form is not submitted

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ❌ Test 7: Invalid Stock (Negative Number)
**Steps:**
1. Go to http://localhost:3000/add-medicine
2. Fill all fields
3. Enter Stock: `-5`
4. Try to submit

**Expected Result:**
- [ ] 🚫 HTML5 validation blocks submission (min="0")
- [ ] Browser shows: "Value must be greater than or equal to 0"

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ❌ Test 8: Invalid Price (Zero or Negative)
**Steps:**
1. Go to http://localhost:3000/add-medicine
2. Fill all fields
3. Enter Price: `0` or `-10`
4. Click "Add Medicine"

**Expected Result:**
- [ ] ❌ Validation error: "Price must be greater than 0"
- [ ] Form is not submitted
- [ ] Error message displayed

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 9: API Validation Logging
**Steps:**
1. Open Browser Console (F12 → Console tab)
2. Go to http://localhost:3000/add-medicine
3. Fill form with valid data
4. Click "Add Medicine"

**Expected Result in Console:**
- [ ] Request log: `[API Request] POST /api/medicines`
- [ ] Response log (success or error)
- [ ] If low stock: `⚠️ Warning: Stock is below recommended threshold`

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### ✅ Test 10: Success Message Details
**Steps:**
1. Add a medicine successfully
2. Observe the success message

**Expected Result:**
- [ ] ✅ Large checkmark icon (text-5xl)
- [ ] "Medicine Added Successfully!" heading
- [ ] Details show:
  - ✓ Medicine ID
  - ✓ Name
  - ✓ Stock (with units)
- [ ] If stock < 10, yellow warning box shows
- [ ] "Redirecting to dashboard..." message
- [ ] Auto-redirect happens after 2 seconds

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## 🔍 Backend API Testing (Optional)

### Test Backend Directly with Thunder Client / Postman

#### Test: Add Medicine
**Request:**
```
POST http://localhost:5000/api/medicines
Content-Type: application/json

{
  "medicineId": "M010",
  "name": "Ibuprofen",
  "manufacturer": "Pfizer",
  "expiryDate": "2025-12-31",
  "stock": 100,
  "price": 18.50
}
```

**Expected Response (200):**
```json
{
  "message": "Medicine added successfully",
  "medicine": { ... }
}
```

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

#### Test: Add Expired Medicine (Should Fail)
**Request:**
```
POST http://localhost:5000/api/medicines
Content-Type: application/json

{
  "medicineId": "M011",
  "name": "OldMed",
  "manufacturer": "TestCo",
  "expiryDate": "2020-01-01",
  "stock": 10,
  "price": 15.00
}
```

**Expected Response (400):**
```json
{
  "message": "Cannot add/update medicine with expired date"
}
```

**Status:** ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## 📊 Test Summary

**Total Tests:** 10
**Passed:** ___
**Failed:** ___
**Not Tested:** ___

**Pass Rate:** ____%

---

## 🐛 Bugs Found

| Test # | Issue | Severity | Status |
|--------|-------|----------|--------|
| | | High/Medium/Low | Open/Fixed |

---

## 📝 Notes

**Date Tested:** _______________
**Tested By:** _______________
**Environment:** Windows / Mac / Linux
**Browser:** Chrome / Firefox / Edge
**Backend Version:** _______________
**Frontend Version:** _______________

---

## ✅ Sign-Off

- [ ] All critical tests passed
- [ ] All validation features working
- [ ] Error handling verified
- [ ] Ready for next phase

**Signed:** _______________  
**Date:** _______________

# Medicine Inventory Management System - Backend API

A RESTful API built with Node.js, Express, and MongoDB for managing medicine inventory.

## 🚀 Features

- ✅ Complete CRUD operations for medicines
- ✅ MongoDB integration with Mongoose
- ✅ Schema validation
- ✅ Search functionality
- ✅ Expired medicine tracking
- ✅ Low stock alerts
- ✅ Stock management (add/subtract)
- ✅ CORS enabled
- ✅ Error handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

1. **Navigate to the backend directory:**
   ```bash
   cd medicine-inventory-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Edit `.env` file with your settings:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/medical_inventory
   ```

4. **Start MongoDB:**
   ```bash
   # For Windows
   net start MongoDB

   # For Mac/Linux
   sudo systemctl start mongod
   ```

5. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Base URL: `http://localhost:5000`

### 1️⃣ **Create Medicine**
```http
POST /api/medicines/add
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

**Response:**
```json
{
  "success": true,
  "message": "Medicine added successfully",
  "data": {
    "_id": "...",
    "medicineId": "M001",
    "name": "Paracetamol",
    "manufacturer": "Cipla",
    "expiryDate": "2026-05-01T00:00:00.000Z",
    "stock": 50,
    "price": 15,
    "createdAt": "2025-10-02T...",
    "updatedAt": "2025-10-02T..."
  }
}
```

### 2️⃣ **Get All Medicines**
```http
GET /api/medicines/all
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

### 3️⃣ **Search Medicine by Name**
```http
GET /api/medicines/search?name=Paracetamol
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

### 4️⃣ **Get Medicine by ID**
```http
GET /api/medicines/:id
```

### 5️⃣ **Update Medicine**
```http
PUT /api/medicines/update/:id
Content-Type: application/json

{
  "stock": 75,
  "price": 20
}
```

**Response:**
```json
{
  "success": true,
  "message": "Medicine updated successfully",
  "data": {...}
}
```

### 6️⃣ **Update Stock Only**
```http
PATCH /api/medicines/stock/:id
Content-Type: application/json

{
  "quantity": 10,
  "operation": "add"  // or "subtract"
}
```

### 7️⃣ **Get Expired Medicines**
```http
GET /api/medicines/expired/list
```

### 8️⃣ **Get Low Stock Medicines**
```http
GET /api/medicines/lowstock/list?threshold=50
```

### 9️⃣ **Delete Expired Medicines**
```http
DELETE /api/medicines/deleteExpired
```

**Response:**
```json
{
  "success": true,
  "message": "2 expired medicine(s) deleted successfully",
  "deletedCount": 2
}
```

### 🔟 **Delete Medicine by ID**
```http
DELETE /api/medicines/:id
```

## 🧪 Testing APIs

### Using cURL (PowerShell)

**1. Add Medicine:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/add" -Method POST -ContentType "application/json" -Body '{"medicineId":"M001","name":"Paracetamol","manufacturer":"Cipla","expiryDate":"2026-05-01","stock":50,"price":15}'
```

**2. Get All Medicines:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/all" -Method GET
```

**3. Search by Name:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/search?name=Paracetamol" -Method GET
```

**4. Update Medicine:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/update/YOUR_ID_HERE" -Method PUT -ContentType "application/json" -Body '{"stock":75,"price":20}'
```

**5. Delete Expired:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/medicines/deleteExpired" -Method DELETE
```

### Using Thunder Client / Postman

1. Install Thunder Client extension in VS Code
2. Import the API collection
3. Test each endpoint

## 📁 Project Structure

```
medicine-inventory-backend/
├── models/
│   └── medicineModel.js      # Mongoose schema
├── routes/
│   └── medicineRoutes.js     # API routes
├── .env                       # Environment variables
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
├── server.js                 # Main server file
└── README.md                 # Documentation
```

## 🔍 Testing Workflow

1. **Start the server**
2. **Add sample medicines:**
   ```json
   POST /api/medicines/add
   {
     "medicineId": "M001",
     "name": "Paracetamol",
     "manufacturer": "Cipla",
     "expiryDate": "2026-05-01",
     "stock": 50,
     "price": 15
   }
   ```

3. **Fetch all medicines:**
   ```
   GET /api/medicines/all
   ```

4. **Search by name:**
   ```
   GET /api/medicines/search?name=Paracetamol
   ```

5. **Update stock:**
   ```json
   PUT /api/medicines/update/:id
   {
     "stock": 75
   }
   ```

6. **Check expired medicines:**
   ```
   GET /api/medicines/expired/list
   ```

7. **Delete expired:**
   ```
   DELETE /api/medicines/deleteExpired
   ```

## 🛠️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/medical_inventory |

## 📊 Database Schema

```javascript
{
  medicineId: String (unique, required),
  name: String (required),
  manufacturer: String (required),
  expiryDate: Date (required),
  stock: Number (required, min: 0),
  price: Number (required, min: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔒 Validation Rules

- `medicineId`: Unique identifier, required
- `name`: Required, trimmed
- `manufacturer`: Required, trimmed
- `expiryDate`: Must be a valid date
- `stock`: Integer, cannot be negative
- `price`: Number, cannot be negative

## ⚠️ Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🎯 Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 🚧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
net start MongoDB  # Windows
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill the process using port 5000

### Validation Error
```
Error: Medicine validation failed
```
**Solution:** Check that all required fields are provided with correct data types

## 📝 Next Steps

- [ ] Add authentication (JWT)
- [ ] Add pagination for large datasets
- [ ] Add unit tests
- [ ] Add API documentation (Swagger)
- [ ] Add logging (Winston/Morgan)
- [ ] Deploy to cloud (Heroku/Railway)

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Medicine Inventory Management System - Backend API

---

**Happy Coding! 🚀**

# 🏗️ System Architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  (Postman / Thunder Client / PowerShell / Frontend App)          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                              │
│                    (server.js - Port 5000)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Middleware                            │  │
│  │  • express.json() - Parse JSON requests                 │  │
│  │  • cors() - Handle cross-origin requests                │  │
│  │  • Error Handler - Catch and format errors              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Routes Layer                          │  │
│  │              /api/medicines/*                            │  │
│  │  (routes/medicineRoutes.js)                              │  │
│  │                                                            │  │
│  │  POST   /add                → Create medicine            │  │
│  │  GET    /all                → Get all medicines          │  │
│  │  GET    /search?name=X      → Search by name             │  │
│  │  GET    /:id                → Get by ID                  │  │
│  │  GET    /expired/list       → Get expired                │  │
│  │  GET    /lowstock/list      → Get low stock              │  │
│  │  PUT    /update/:id         → Update medicine            │  │
│  │  PATCH  /stock/:id          → Update stock               │  │
│  │  DELETE /deleteExpired      → Delete expired             │  │
│  │  DELETE /:id                → Delete by ID               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Mongoose ODM
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MODEL LAYER                                 │
│                 (models/medicineModel.js)                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             Medicine Schema                              │  │
│  │                                                            │  │
│  │  • medicineId: String (unique, required)                 │  │
│  │  • name: String (required)                               │  │
│  │  • manufacturer: String (required)                       │  │
│  │  • expiryDate: Date (required)                           │  │
│  │  • stock: Number (min: 0, integer, required)             │  │
│  │  • price: Number (min: 0, required)                      │  │
│  │  • createdAt: Date (auto)                                │  │
│  │  • updatedAt: Date (auto)                                │  │
│  │                                                            │  │
│  │  Methods:                                                 │  │
│  │  • isExpired() - Check if expired                        │  │
│  │  • findExpired() - Find all expired                      │  │
│  │  • findLowStock() - Find low stock items                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ MongoDB Driver
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                      MongoDB Server                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database: medical_inventory                             │  │
│  │                                                            │  │
│  │  Collection: medicines                                    │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Document 1: {                                     │  │  │
│  │  │    _id: ObjectId("..."),                           │  │  │
│  │  │    medicineId: "M001",                             │  │  │
│  │  │    name: "Paracetamol",                            │  │  │
│  │  │    manufacturer: "Cipla",                          │  │  │
│  │  │    expiryDate: ISODate("2026-05-01"),              │  │  │
│  │  │    stock: 50,                                      │  │  │
│  │  │    price: 15,                                      │  │  │
│  │  │    createdAt: ISODate("..."),                      │  │  │
│  │  │    updatedAt: ISODate("...")                       │  │  │
│  │  │  }                                                  │  │  │
│  │  │                                                      │  │  │
│  │  │  Document 2: { ... }                                │  │  │
│  │  │  Document 3: { ... }                                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### Example: Add Medicine

```
1. CLIENT
   └─► HTTP POST http://localhost:5000/api/medicines/add
       Body: { medicineId: "M001", name: "Paracetamol", ... }

2. EXPRESS SERVER
   └─► Receives request
   └─► Parses JSON body (express.json middleware)
   └─► Routes to medicineRoutes.js

3. ROUTE HANDLER (POST /add)
   └─► Validates request data
   └─► Checks for duplicate medicineId
   └─► Creates new Medicine instance
   └─► Calls medicine.save()

4. MONGOOSE MODEL
   └─► Validates against schema
   └─► Checks required fields
   └─► Validates data types
   └─► Sets default values (timestamps)
   └─► Converts to MongoDB document

5. MONGODB
   └─► Receives document
   └─► Stores in 'medicines' collection
   └─► Returns saved document with _id

6. RESPONSE
   └─► Success response sent to client
   └─► Status: 201 Created
   └─► Body: { success: true, data: {...} }
```

---

## Data Flow Diagram

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│          │         │          │         │          │         │          │
│  Client  │────────►│ Express  │────────►│ Mongoose │────────►│ MongoDB  │
│          │         │  Server  │         │   Model  │         │ Database │
│          │         │          │         │          │         │          │
└──────────┘         └──────────┘         └──────────┘         └──────────┘
     ▲                    │                     │                     │
     │                    │                     │                     │
     │                    ▼                     ▼                     ▼
     │               Validation            Schema Check          Document
     │               CORS                  Type Check            Storage
     │               JSON Parse            Required Check
     │                    │                     │                     │
     │                    │                     │                     │
     └────────────────────┴─────────────────────┴─────────────────────┘
                              Response Flow
```

---

## Technology Stack

```
┌─────────────────────────────────────────────┐
│            FRONTEND (Future)                │
│    React / Vue.js / Angular                 │
└─────────────────┬───────────────────────────┘
                  │
                  │ REST API
                  │
┌─────────────────▼───────────────────────────┐
│           BACKEND (Current)                 │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │       Node.js Runtime               │   │
│  │  • JavaScript Engine                │   │
│  │  • Async I/O                        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │       Express.js Framework          │   │
│  │  • Routing                          │   │
│  │  • Middleware                       │   │
│  │  • HTTP handling                    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │       Mongoose ODM                  │   │
│  │  • Schema definition                │   │
│  │  • Validation                       │   │
│  │  • Queries                          │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │
                  │ MongoDB Protocol
                  │
┌─────────────────▼───────────────────────────┐
│            DATABASE                         │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │       MongoDB Server                │   │
│  │  • NoSQL Database                   │   │
│  │  • Document Storage                 │   │
│  │  • BSON Format                      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Database: medical_inventory                │
│  Collection: medicines                      │
└─────────────────────────────────────────────┘
```

---

## API Endpoint Structure

```
http://localhost:5000
│
├─ / (Root)
│  └─► GET → API Documentation
│
└─ /api/medicines
   │
   ├─ /add
   │  └─► POST → Create new medicine
   │
   ├─ /all
   │  └─► GET → Get all medicines
   │
   ├─ /search
   │  └─► GET → Search by name (?name=X)
   │
   ├─ /:id
   │  ├─► GET → Get medicine by ID
   │  └─► DELETE → Delete medicine by ID
   │
   ├─ /update/:id
   │  └─► PUT → Update medicine
   │
   ├─ /stock/:id
   │  └─► PATCH → Update stock only
   │
   ├─ /expired/list
   │  └─► GET → Get expired medicines
   │
   ├─ /lowstock/list
   │  └─► GET → Get low stock items
   │
   └─ /deleteExpired
      └─► DELETE → Delete all expired
```

---

## File Dependencies

```
server.js
├── express
├── mongoose
├── cors
├── dotenv
└── routes/medicineRoutes.js
    └── models/medicineModel.js
        └── mongoose

.env
└── Configuration variables

package.json
├── Dependencies
└── Scripts
```

---

## Error Handling Flow

```
Request
   │
   ▼
Try Block
   │
   ├─► Success ──► Send 200/201 Response
   │
   └─► Error
       │
       ├─► Validation Error (400)
       │   └─► Missing/invalid fields
       │
       ├─► Duplicate Key Error (400)
       │   └─► medicineId already exists
       │
       ├─► Not Found (404)
       │   └─► Medicine ID doesn't exist
       │
       └─► Server Error (500)
           └─► Unexpected errors
```

---

## Testing Architecture

```
┌─────────────────────────────────────────┐
│         Test Scripts                    │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  simple-test.ps1                 │  │
│  │  • 10 test cases                 │  │
│  │  • Automated execution           │  │
│  │  • Result verification           │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  test-api.ps1                    │  │
│  │  • Detailed testing              │  │
│  │  • Visual output                 │  │
│  │  • Error handling                │  │
│  └──────────────────────────────────┘  │
└─────────────┬───────────────────────────┘
              │
              │ HTTP Requests
              │
              ▼
┌─────────────────────────────────────────┐
│         API Server                      │
│         (localhost:5000)                │
└─────────────────────────────────────────┘
```

---

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────┐
│         Production Setup                │
│                                         │
│  Frontend (Vercel/Netlify)              │
│     │                                   │
│     │ HTTPS                             │
│     ▼                                   │
│  Backend (Heroku/Railway)               │
│     │                                   │
│     │ MongoDB URI                       │
│     ▼                                   │
│  Database (MongoDB Atlas)               │
│                                         │
│  + Environment Variables                │
│  + SSL Certificates                     │
│  + API Keys                             │
│  + Monitoring                           │
└─────────────────────────────────────────┘
```

---

## Security Layers (Future Enhancement)

```
Request
   │
   ▼
┌─────────────────────┐
│  CORS Check         │
│  (Allowed origins)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Authentication     │
│  (JWT Token)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Authorization      │
│  (User roles)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Validation         │
│  (Input sanitize)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Business Logic     │
│  (API handlers)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Database           │
│  (MongoDB)          │
└─────────────────────┘
```

---

## Performance Optimization

```
┌─────────────────────────────────────────┐
│         Current Setup                   │
│                                         │
│  • Direct MongoDB connection            │
│  • No caching                           │
│  • Synchronous operations               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Future Enhancements             │
│                                         │
│  • Redis caching layer                  │
│  • Connection pooling                   │
│  • Database indexing                    │
│  • Query optimization                   │
│  • Response compression                 │
│  • Rate limiting                        │
└─────────────────────────────────────────┘
```

---

## Monitoring & Logging (Future)

```
Application
   │
   ├─► Winston Logger
   │   ├─► Console logs
   │   ├─► File logs
   │   └─► Error logs
   │
   ├─► Morgan HTTP Logger
   │   └─► Request logs
   │
   └─► APM Tools
       ├─► Performance metrics
       ├─► Error tracking
       └─► Uptime monitoring
```

---

This architecture provides a solid foundation for a scalable, maintainable Medicine Inventory Management System! 🚀

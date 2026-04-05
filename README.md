# Finance Data Processing and Access Control Backend
 
A RESTful backend API for a Finance Dashboard system. The system supports financial record management, role-based access control, and dashboard-level analytics — built to serve data to a finance dashboard frontend.
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB via Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcrypt |
| Environment Config | dotenv |
| Dev Server | nodemon |
 
---
 
## Features
 
- **JWT Authentication** — Register and login with hashed passwords. Tokens expire in 15 minutes for security.
- **Role-Based Access Control (RBAC)** — Three roles (viewer, analyst, admin) with clearly enforced permissions per route.
- **User Management** — Admin can create, update, activate/deactivate, and delete users.
- **Financial Records CRUD** — Create, read, update, and soft-delete financial records.
- **Soft Delete** — Records are never permanently removed. Deletion sets `isDeleted: true` so data is always recoverable.
- **Filtering + Pagination** — Records can be filtered by type, category, and date range. All list endpoints support pagination.
- **Dashboard Analytics** — Aggregation-powered endpoints for summary totals, monthly trends, category breakdowns, and recent activity.
- **Inactive User Protection** — Users with inactive status are blocked at the middleware level even with a valid token.
- **Global Error Handling** — All unhandled errors and unregistered routes return clean, consistent JSON responses.
 
---
 
## Project Structure
 
```
Backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js      # Register and login logic
│   │   ├── user.controller.js      # User CRUD (admin only)
│   │   ├── record.controller.js    # Financial record CRUD + filters
│   │   └── dashboard.controller.js # Aggregation-based analytics
│   ├── middlewares/
│   │   ├── authenticate.js         # JWT verification + inactive user check
│   │   └── authorize.js            # Role-based route protection
│   ├── models/
│   │   ├── user.js                 # User schema
│   │   └── financialRecord.js      # Financial record schema with soft delete
│   ├── routes/
│   │   ├── auth.route.js           # /auth/register, /auth/login
│   │   ├── user.route.js           # /api/users
│   │   ├── record.route.js         # /api/records
│   │   └── dashboard.routes.js     # /api/dashboard
│   ├── utils/
│   │   ├── mongodb.js              # Mongoose instance + connectDB export
│   │   └── error.js                # Global error handler middleware
│   ├── app.js                      # Express app setup and route registration
│   └── datainjection.js            # Seed script to populate initial data
├── index.js                        # Entry point — connects DB and starts server
├── .env                            # Your local environment variables (not committed)
├── .env.example                    # Template for environment variables
├── .gitignore
└── package.json
```
 
---
 
## Setup and Run Locally
 
### 1. Clone the repository
 
```bash
git clone https://github.com/naveen924611/Zorvyn-Backend.git
cd Zorvyn-Backend
```
 
### 2. Install dependencies
 
```bash
npm install
```
 
### 3. Create your `.env` file
 
```bash
cp .env.example .env
```
 
Then open `.env` and fill in your values (see Environment Variables section below).
 
### 4. Seed initial data (optional but recommended for testing)
 
```bash
node src/datainjection.js
```
 
This will create sample users (one per role) and financial records in your database so you can test all endpoints immediately.
 
### 5. Start the development server
 
```bash
npm run dev
```
 
Server runs at `http://localhost:5000` by default.
 
---
 
## Environment Variables
 
Create a `.env` file in the root directory with the following keys:
 
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-dashboard
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=15m
```
 
| Variable | Description |
|---|---|
| `PORT` | Port the server runs on |
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry duration — set to `15m` for security, extend to `1h` or `7d` for development convenience |
 
> **Note for reviewers:** If testing manually via Postman, consider setting `JWT_EXPIRES_IN=1h` in your `.env` to avoid frequent re-logins during testing. The default is `15m` as a deliberate security choice.
 
---
 
## Roles and Permissions
 
| Action | Viewer | Analyst | Admin |
|---|---|---|---|
| Login / Register | ✅ | ✅ | ✅ |
| View financial records | ✅ | ✅ | ✅ |
| Filter records | ✅ | ✅ | ✅ |
| View dashboard summary | ✅ | ✅ | ✅ |
| View recent activity | ✅ | ✅ | ✅ |
| View trends (monthly) | ❌ | ✅ | ✅ |
| View category breakdown | ❌ | ✅ | ✅ |
| Create / update / delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
 
---
 
## API Documentation
 
All protected routes require the following header:
 
```
Authorization: Bearer <your_jwt_token>
```
 
All responses follow this consistent format:
 
```json
// Success
{ "success": true, "message": "...", "data": { ... } }
 
// Error
{ "success": false, "message": "..." }
```
 
---
 
### Auth Routes
 
#### `POST /auth/register`
Register a new user. Role defaults to `viewer`. Role cannot be set from this endpoint — only admins can assign roles.
 
**Request Body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```
 
**Success Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "<jwt_token>",
    "user": {
      "_id": "...",
      "username": "john",
      "email": "john@example.com",
      "role": "viewer",
      "status": "active"
    }
  }
}
```
 
---
 
#### `POST /auth/login`
Login with email and password.
 
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
 
**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt_token>",
    "user": {
      "_id": "...",
      "username": "john",
      "email": "john@example.com",
      "role": "viewer",
      "status": "active"
    }
  }
}
```
 
**Error Responses:**
- `400` — Invalid email or password
- `403` — Account is inactive
 
---
 
### User Routes
 
> All user routes require `Authorization` header and admin role.
 
#### `GET /api/users`
Get all users.
 
**Success Response `200`:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "...",
      "username": "john",
      "email": "john@example.com",
      "role": "viewer",
      "status": "active"
    }
  ]
}
```
 
---
 
#### `GET /api/users/:id`
Get a single user by ID.
 
**Error Responses:**
- `404` — User not found
 
---
 
#### `POST /api/users`
Admin creates a user with any role.
 
**Request Body:**
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123",
  "role": "analyst"
}
```
 
---
 
#### `PUT /api/users/:id`
Update user details (username, email, role).
 
**Request Body:** (all fields optional)
```json
{
  "username": "alice_updated",
  "role": "admin"
}
```
 
---
 
#### `PATCH /api/users/:id/status`
Toggle user status between active and inactive.
 
**Request Body:**
```json
{
  "status": "inactive"
}
```
 
---
 
#### `DELETE /api/users/:id`
Delete a user. An admin cannot delete their own account.
 
**Error Responses:**
- `400` — Cannot delete your own account
- `404` — User not found
 
---
 
### Record Routes
 
#### `GET /api/records`
Get all financial records. Supports filtering and pagination.
 
> Accessible by: viewer, analyst, admin
 
**Query Parameters:**
 
| Param | Type | Example |
|---|---|---|
| `type` | string | `?type=income` |
| `category` | string | `?category=salary` |
| `startDate` | date | `?startDate=2024-01-01` |
| `endDate` | date | `?endDate=2024-12-31` |
| `page` | number | `?page=1` |
| `limit` | number | `?limit=10` |
 
**Success Response `200`:**
```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": {
    "records": [ ... ],
    "pagination": {
      "totalRecords": 45,
      "totalPages": 5,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```
 
---
 
#### `GET /api/records/:id`
Get a single record by ID.
 
> Accessible by: viewer, analyst, admin
 
---
 
#### `POST /api/records`
Create a new financial record.
 
> Accessible by: admin only
 
**Request Body:**
```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2024-03-01",
  "notes": "Monthly salary"
}
```
 
---
 
#### `PUT /api/records/:id`
Update a financial record.
 
> Accessible by: admin only
 
---
 
#### `DELETE /api/records/:id`
Soft delete a record. Sets `isDeleted: true`. Record is never permanently removed.
 
> Accessible by: admin only
 
---
 
### Dashboard Routes
 
#### `GET /api/dashboard/summary`
Returns total income, total expenses, and net balance.
 
> Accessible by: viewer, analyst, admin
 
**Success Response `200`:**
```json
{
  "success": true,
  "message": "Summary fetched successfully",
  "data": {
    "totalIncome": 50000,
    "totalExpenses": 32000,
    "netBalance": 18000
  }
}
```
 
---
 
#### `GET /api/dashboard/recent`
Returns the 10 most recent financial records.
 
> Accessible by: viewer, analyst, admin
 
---
 
#### `GET /api/dashboard/trends`
Returns monthly income vs expense breakdown for the last 6 months.
 
> Accessible by: analyst, admin
 
**Success Response `200`:**
```json
{
  "success": true,
  "message": "Trends fetched successfully",
  "data": [
    { "year": 2024, "month": 3, "totalIncome": 10000, "totalExpenses": 6000 },
    { "year": 2024, "month": 2, "totalIncome": 9500, "totalExpenses": 5800 }
  ]
}
```
 
---
 
#### `GET /api/dashboard/category-breakdown`
Returns total amounts grouped by category.
 
> Accessible by: analyst, admin
 
**Success Response `200`:**
```json
{
  "success": true,
  "message": "Category breakdown fetched successfully",
  "data": [
    { "category": "salary", "total": 30000 },
    { "category": "rent", "total": 12000 }
  ]
}
```
 
---
 
## Data Models
 
### User
```
username    String, required
email       String, required, unique
password    String, hashed with bcrypt (never returned in responses)
role        Enum: viewer | analyst | admin  (default: viewer)
status      Enum: active | inactive         (default: active)
timestamps  createdAt, updatedAt (auto-managed)
```
 
### FinancialRecord
```
amount      Number, required, min 0
type        Enum: income | expense, required
category    String, required, indexed
date        Date, required
notes       String, optional
createdBy   ObjectId ref → User, required
isDeleted   Boolean, default false  (soft delete flag)
timestamps  createdAt, updatedAt (auto-managed)
 
Compound Index: { createdBy, isDeleted, date } for optimized queries
```
 
---
 
## Assumptions Made
 
1. **Public registration always creates a viewer.** Role assignment is an admin-only action done through `POST /api/users` or `PUT /api/users/:id`.
 
2. **Soft delete is used for records only.** User deletion is a hard delete. Records are business-critical data and should never be permanently removed.
 
3. **`createdBy` is automatically attached** from the authenticated user's token — it is not accepted from the request body to prevent spoofing.
 
4. **Inactive users are blocked at the middleware level.** Even if a user holds a valid unexpired token, they cannot access any protected route if their status is `inactive`.
 
5. **JWT expiry is 15 minutes** as a deliberate security decision. For local development and testing convenience, this can be changed to `1h` in the `.env` file.
 
6. **No soft delete on users.** Deactivating a user (via the status field) is the preferred approach instead of deletion, as it preserves audit trails via `createdBy` references on financial records.
 
7. **Dashboard aggregations always exclude soft-deleted records.** All `isDeleted: true` records are filtered out before any calculation.
 
---
 

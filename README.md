# Fuel Management System - Petrol Pump Dispensing Log Application

## 🎯 Project Overview

The Fuel Management System is a web application designed to streamline the process of logging fuel dispensing records at petrol pumps. It provides:

- **Secure Authentication**: JWT-based token authentication
- **Record Management**: Create, view, and manage dispensing records
- **Advanced Filtering**: Filter records by dispenser, payment mode, and date range
- **File Management**: Upload and download payment proofs (images, PDFs)
- **User-Friendly Interface**: Responsive design with React Bootstrap

## 🛠 Tech Stack

### Backend
- **Framework**: ASP.NET Core 6
- **Language**: C#
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: ADO.NET with MySqlConnector
- **Password Hashing**: BCrypt.Net-Next

### Frontend
- **Library**: React 18
- **UI Framework**: React Bootstrap 5
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6
- **JWT Validation**: jwt-decode
- **Styling**: CSS with Bootstrap utilities

### Database
- **Engine**: MySQL
- **Driver**: MySqlConnector

## ✨ Features

### 1. Authentication & Routing
- Simple username/password login
- JWT-based token generation
- Secure token storage with expiration validation
- **Protected Routes**: JWT token verification before accessing any protected pages
- **Route Guards**: ProtectedRoute component validates token expiration
- Auto-logout and redirect to login on token expiration
- Error handling for invalid credentials
- React Router-based navigation

### 2. Entry Page (Create Dispensing Record)
- Dropdown selection for dispenser number (D-01, D-02, D-03, D-04)
- Numeric input for fuel quantity in liters
- Vehicle registration number input
- Payment mode selection (Cash, Credit Card, UPI)
- File upload for payment proof (JPG, PNG, PDF)
- File size validation (max 5 MB)
- Form validation before submission
- Success/error notifications

### 3. Listing Page (View Records)
- Display all dispensing records in a responsive table
- Record details: Dispenser No, Quantity, Vehicle Number, Payment Mode, Timestamp
- Download payment proof functionality
- Advanced filtering options:
  - Filter by Dispenser No
  - Filter by Payment Mode
  - Filter by Date Range (start and end date)
- Dynamic filtering without page reload
- Record count display

## 📁 Project Structure

```
FuelManagementSystem/
├── BackEnd/
│   └── FuelManagementAPI/
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   └── DispensingRecordsController.cs
│       ├── Models/
│       │   ├── User.cs
│       │   └── DispensingRecord.cs
│       ├── DTOs/
│       │   ├── AuthDtos.cs
│       │   └── DispensingRecordDtos.cs
│       ├── Repositories/
│       │   ├── AuthRepository.cs
│       │   └── DispensingRecordRepository.cs
│       ├── Services/
│       │   ├── DbService.cs
│       │   └── TokenService.cs
│       ├── Database/
│       │   └── schema.sql
│       ├── Uploads/ (created at runtime)
│       ├── Program.cs
│       ├── appsettings.json
│       └── FuelManagementAPI.csproj
├── FrontEnd/
│   └── fuel-management-ui/
│       ├── public/
│       │   └── index.html
│       ├── src/
│       │   ├── api/
│       │   │   └── axiosConfig.js
│       │   ├── components/
│       │   │   ├── Login.js
│       │   │   ├── EntryPage.js
│       │   │   ├── ListingPage.js
│       │   │   ├── MainLayout.js (Navbar + Layout wrapper for authenticated routes)
│       │   │   └── ProtectedRoute.js (JWT token validation & route guard)
│       │   ├── styles/
│       │   │   ├── Login.css
│       │   │   ├── Entry.css
│       │   │   ├── Listing.css
│       │   │   └── App.css
│       │   ├── App.js (React Router setup with BrowserRouter)
│       │   ├── index.js
│       │   └── App.css
│       └── package.json
└── README.md
```

## 📦 Prerequisites

- **Node.js** (v16 or higher)
- **.NET SDK 6.0** or higher
- **MySQL Server** (v5.7 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### Backend Setup

1. **Clone or navigate to the backend directory**:
   ```bash
   cd BackEnd/FuelManagementAPI
   ```

2. **Restore NuGet packages**:
   ```bash
   dotnet restore
   ```

3. **Configure Database Connection**:
   - Open `appsettings.json`
   - Update the connection string if needed:
     ```json
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;User=root;Password=pass@123;Database=fuel_management;Pooling=true;"
     }
     ```

4. **Create the database and tables** (see Database Setup section)

5. **Build the project**:
   ```bash
   dotnet build
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd FrontEnd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Update API base URL** (if needed):
   - Open `src/api/axiosConfig.js`
   - Update `API_BASE_URL` to match your backend URL:
     ```javascript
     const API_BASE_URL = 'https://localhost:7178/api';
     ```

## � Routing & JWT Token Validation

The frontend uses **React Router v6** with protected routes to ensure only authenticated users can access certain pages.

### Route Structure

```javascript
/login              → Public route (Login page)
/records            → Protected route (Listing page)
/add-record         → Protected route (Entry page)
/                   → Redirects to /records (protected)
```

### JWT Token Validation Flow

1. **ProtectedRoute Component**: 
   - Checks if JWT token exists in localStorage
   - Validates token expiration using `jwt-decode` library
   - If token is valid → Renders protected page with MainLayout
   - If token is expired or missing → Redirects to `/login`

2. **MainLayout Component**:
   - Wraps all protected pages with navbar and footer
   - Provides logout functionality with token cleanup
   - Uses React Router Outlet to render child routes

3. **Axios Request Interceptor** (axiosConfig.js):
   - Automatically attaches JWT token to all API requests
   - Token sent via `Authorization: Bearer <token>` header
   - Handles multipart/form-data for file uploads


## �🗄️ Database Setup

### 1. Create Database and Tables

1. **Connect to MySQL**:
   ```bash
   mysql -u root -p
   ```

2. **Run the schema script**:
   ```sql
   Note: refer to QUICKSTART.md for DB setup
   SOURCE BackEnd/FuelManagementAPI/Database/schema.sql;
   ```

Or manually execute the SQL commands in `Database/schema.sql`.

### 2. Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

The password is already hashed in the database using bcrypt.

## ▶️ Running the Application

### Backend

1. **Start the backend server**:
   ```bash
   cd BackEnd/FuelManagementAPI
   dotnet run
   ```

   The API will be available at `https://localhost:7178`

2. **API Health Check**:
   - Visit `https://localhost:7178/swagger` for Swagger documentation

### Frontend

1. **In a new terminal, start the React app**:
   ```bash
   cd FrontEnd
   npm start
   ```

   The application will open at `http://localhost:3000`

### Usage

1. **Login**:
   - Username: `admin`
   - Password: `admin123`

2. **Create a Record**:
   - Click "Add Record" in the navigation
   - Fill in all required fields
   - Upload a payment proof file (JPG, PNG, or PDF)
   - Click "Create Record"

3. **View & Filter Records**:
   - Click "Records" to view all dispensing records
   - Use the filter panel to narrow down results
   - Download payment proofs using the "Download" button

## 🔌 API Endpoints

### Authentication
- **POST** `/api/auth/login`
  - Request: `{ username: string, password: string }`
  - Response: `{ success: bool, message: string, token: string }`

### Dispensing Records
- **POST** `/api/dispensingrecords/create` (Requires Authentication)
  - Body: `FormData` with fields: dispenserNo, quantity, vehicleNumber, paymentMode, paymentProof
  - Response: Created record details

- **POST** `/api/dispensingrecords/list` (Requires Authentication)
  - Body: `{ dispenserNo?: string, paymentMode?: string, startDate?: DateTime, endDate?: DateTime }`
  - Response: Array of filtered records

- **GET** `/api/dispensingrecords/download/{filename}` (Requires Authentication)
  - Response: File (JPG, PNG, or PDF)

## 👤 User Guide

### Login
1. Enter username: `admin`
2. Enter password: `admin123`
3. Click "Login"

### Create a Record
1. Click "Add Record" in the navigation bar
2. Select a dispenser from the dropdown
3. Enter the quantity in liters
4. Enter the vehicle registration number
5. Select the payment mode
6. Upload a payment proof file
7. Click "Create Record"
8. You'll be redirected to the records page after successful creation

### View and Filter Records
1. Click "Records" in the navigation bar
2. Use the filter panel to:
   - Select a specific dispenser
   - Filter by payment mode
   - Set date range
3. Click "Apply" to filter records
4. Click "Reset" to clear all filters
5. Click "Download" to download the payment proof for any record

### Logout
- Click "Logout" button in the top-right corner

## 📝 Assumptions

1. **Single User Scope**: The application is designed for use by individual users (one admin user). Each authenticated user can only view their own dispensing records.

2. **Database Pre-population**: The admin user is pre-inserted into the database via the schema script. No user registration feature is required.

3. **File Upload Location**: Payment proof files are stored in the `Uploads/` folder relative to the application root. This folder is created automatically at runtime.

4. **Password Reset**: No password recovery or reset functionality is implemented, as specified in the requirements.

5. **Token Expiration**: JWT tokens are valid for 24 hours. Users must log in again after expiration.

6. **Route Protection**: All routes except `/login` are protected by the `ProtectedRoute` component. Unauthenticated users attempting to access protected routes are automatically redirected to the login page.

7. **JWT Token Validation**: The frontend validates JWT token expiration using the `jwt-decode` library before rendering protected routes. Expired tokens are automatically removed and users are redirected to login.

8. **File Size Limit**: Maximum file size for payment proof is 5 MB.

9. **Supported File Types**: Only JPG, PNG, and PDF files are accepted for payment proof.

10. **Date Range Filtering**: End date is inclusive (includes the entire end date).

11. **CORS**: CORS is enabled for all origins during development. Update this in `Program.cs` for production.

12. **HTTPS**: The backend is configured to use HTTPS. Update the API URL in the frontend if using HTTP locally.

13. **React Router**: The frontend uses React Router v6 for client-side routing. All navigation between pages is handled by React Router without full page reloads.

## 🔧 Troubleshooting

### HTTPS Certificate Error

**Error Message**:
```
System.InvalidOperationException: Unable to configure HTTPS endpoint. No server certificate was specified, and the default developer certificate could not be found or is out of date.
```

**Solution**:
1. **Clean existing certificates**:
   ```bash
   dotnet dev-certs https --clean
   ```

2. **Generate and trust a new certificate**:
   ```bash
   dotnet dev-certs https --trust
   ```

3. **Try running the application again**:
   ```bash
   cd BackEnd/FuelManagementAPI
   dotnet run
   ```

**Why this happens**: ASP.NET Core requires a valid HTTPS certificate for development. The developer certificate may be missing, expired, or untrusted on your machine. The commands above generate a new certificate and register it with Windows as trusted.

---




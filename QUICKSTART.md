# Quick Start Guide - Fuel Management System

## ⚡ Quick Setup (5 minutes)

### Step 1: Setup MySQL Database

1. Open MySQL command line or MySQL Workbench
2. Execute the SQL script located at:
   ```
   BackEnd/FuelManagementAPI/Database/schema.sql
   ```
   This will create:
   - Database: `fuel_management`
   - Tables: `users`, `dispensing_records`
   - Default user: username=`admin`, password=`admin123`

### Step 2: Start Backend Server

```bash
cd BackEnd/FuelManagementAPI
dotnet restore
dotnet run
```

Backend will start at: `https://localhost:7178`

### Step 3: Start Frontend Application

In a new terminal:

```bash
cd FrontEnd
npm install
npm start
```

Frontend will open at: `http://localhost:3000`

## 🔑 Demo Credentials

- **Username**: `admin`
- **Password**: `admin123`


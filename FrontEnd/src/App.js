import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import EntryPage from './components/EntryPage';
import ListingPage from './components/ListingPage';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Authenticated Pages */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/records" element={<ListingPage />} />
          <Route path="/add-record" element={<EntryPage />} />
          <Route index element={<Navigate to="/records" replace />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/records" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

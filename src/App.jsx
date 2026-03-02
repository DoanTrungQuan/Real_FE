import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';

// Components
import Navbar from './components/Common/Navbar';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Admin
import AdminDashboard from './components/Admin/AdminDashboard';
import PropertyManagement from './components/Admin/PropertyManagement';
import SellerManagement from './components/Admin/SellerManagement';

// User
import PropertyList from './components/User/PropertyList';
import PropertyDetail from './components/User/PropertyDetail';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route 
                path="/properties" 
                element={
                  <ProtectedRoute>
                    <PropertyList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/properties/:id" 
                element={
                  <ProtectedRoute>
                    <PropertyDetail />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/properties" 
                element={
                  <ProtectedRoute adminOnly>
                    <PropertyManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/sellers" 
                element={
                  <ProtectedRoute adminOnly>
                    <SellerManagement />
                  </ProtectedRoute>
                } 
              />

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/properties" replace />} />
              <Route path="*" element={<Navigate to="/properties" replace />} />
            </Routes>
          </main>
        </div>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
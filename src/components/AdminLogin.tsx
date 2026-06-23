import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginForm from './admin/AdminLoginForm';
import AdminLayout from './admin/AdminLayout';
import AdminManagementModular from './admin/AdminManagementModular';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

// Login Route Component  
const LoginRoute: React.FC = () => {
  const token = localStorage.getItem('admin_token');
  
  // If already has token, redirect to dashboard
  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return (
    <AdminLayout
      footer={<>© {new Date().getFullYear()} University Library • Admin Access</>}
    >
      <AdminLoginForm />
    </AdminLayout>
  );
};

export default function AdminLogin() {
  return (
    <Routes>
      <Route path="/" element={<LoginRoute />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AdminManagementModular />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

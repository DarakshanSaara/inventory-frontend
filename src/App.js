// src/App.js - Updated
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Suppliers from './components/Suppliers';
import StockManagement from './components/StockManagement';
import Reports from './components/Reports';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Toaster position="top-right" />
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/suppliers" 
            element={
              <PrivateRoute>
                <Suppliers />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/stock" 
            element={
              <PrivateRoute>
                <StockManagement />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
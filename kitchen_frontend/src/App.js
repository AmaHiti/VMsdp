import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

import AddProduct from './components/AddProduct';
import AdminQuotations from './components/AdminQuotations';
import Dashboard from './components/Chart';
import LoginSignup from './components/loginsingup';
import OrderManagement from './components/OrdersManagement';
import ProductList from './components/ProductList';
import React from 'react';
import Sidebar from './components/Sidebar';
import UserList from './components/UserProfileComponent';

// Components




const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/login';
  const token = localStorage.getItem('token');

  // Redirect to login if not authenticated and not on auth page
  if (!token && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if authenticated and on auth page
  if (token && isAuthPage) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container-fluid app-container">
      <div className="row">
        {/* Conditionally render Sidebar */}
        {!isAuthPage && (
          <div className="col-md-2 sidebar-col">
            <Sidebar />
          </div>
        )}
        
        {/* Main content area */}
        <div className={`main-content ${!isAuthPage ? 'col-md-10' : 'col-md-12'}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginSignup />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
         
           
            <Route path="/Add-products" element={<AddProduct />} />
            <Route path="/list-products" element={<ProductList />} />
           
            <Route path="/job-list" element={<AdminQuotations />} />
            <Route path="/n-orders" element={<OrderManagement />} />
            <Route path="/all-users" element={<UserList />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
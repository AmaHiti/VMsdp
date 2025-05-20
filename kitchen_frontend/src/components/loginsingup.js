import './loginsingup.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

const KitchenStaffLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Hardcoded kitchen staff credentials
    const STAFF_USERNAME = 'kitchen';
    const STAFF_PASSWORD = 'staff123';
    
    if (formData.username === STAFF_USERNAME && formData.password === STAFF_PASSWORD) {
      // Simulate token storage
      localStorage.setItem('token', 'kitchen-staff-token');
      navigate('/Add-products'); // Redirect to kitchen dashboard
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div style={{marginTop:'200px'}} className="container-fluid login-page">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card login-card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h3>Kitchen Staff Login</h3>
            </div>
            <div className="card-body">
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenStaffLogin;
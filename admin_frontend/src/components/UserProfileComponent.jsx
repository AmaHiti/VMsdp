import './UserProfileComponent.css';

import React, { useEffect, useState } from 'react';

import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('customer_name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/user/get_users', {
          headers: { token }
        });
        if (response.data.success) {
          setUsers(response.data.users);
          setFilteredUsers(response.data.users);
        } else {
          setError('No users found');
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Apply filters whenever filter conditions change
  useEffect(() => {
    filterAndSortUsers();
  }, [searchTerm, sortBy, sortOrder, users]);

  // Filter and sort users based on current criteria
  const filterAndSortUsers = () => {
    let result = [...users];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.customer_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.tel_num?.toString().includes(term) ||
        user.CustomerID?.toString().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      
      // For string comparisons
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      // For numeric comparisons
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
    
    setFilteredUsers(result);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('customer_name');
    setSortOrder('asc');
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      
      <div className="filter-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select" 
            value={sortBy} 
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="customer_name">Name</option>
            <option value="email">Email</option>
            <option value="CustomerID">Customer ID</option>
          </select>
          
          <button 
            onClick={toggleSortOrder} 
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
          
          <button 
            onClick={clearFilters} 
            className="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      <div className="filter-status">
        {filteredUsers.length === 0 ? (
          <p>No users match your search criteria</p>
        ) : (
          <p>Showing {filteredUsers.length} of {users.length} users</p>
        )}
      </div>
      
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.CustomerID} className="user-card">
            <div className="user-detail">
              <span className="label">Name:</span>
              <span>{user.customer_name}</span>
            </div>
            <div className="user-detail">
              <span className="label">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="user-detail">
              <span className="label">Phone:</span>
              <span>{user.tel_num}</span>
            </div>
            <div className="user-detail">
              <span className="label">Customer ID:</span>
              <span>{user.CustomerID}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
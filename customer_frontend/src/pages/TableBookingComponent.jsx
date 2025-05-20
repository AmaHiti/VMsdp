import './TableBooking.css'; // Import custom CSS file

import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TableBookingComponent = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    table_id: '',
    customer_name: '',
    phone: '',
    email: '',
    reservation_date: '',
    reservation_time: '',
    guests: 1,
    special_requests: ''
  });
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  // Fetch tables from API
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/get_tables');
        setTables(response.data.tables);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Handle input change for booking form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle table selection
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setBookingData(prev => ({
      ...prev,
      table_id: table.table_id,
      guests: table.capacity > 1 ? 2 : 1 // Default to 2 guests if table capacity allows
    }));
  };

  // Handle booking submission
  const handleBookTable = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(localStorage.getItem('user'));
      
      const bookingPayload = {
        table_id: selectedTable.table_id,
        userId: userData?.id,
        customer_name: bookingData.customer_name,
        phone: bookingData.phone,
        email: bookingData.email,
        reservation_date: bookingData.reservation_date,
        reservation_time: bookingData.reservation_time,
        guests: bookingData.guests,
        special_requests: bookingData.special_requests
      };

      const response = await axios.post(
        'http://localhost:4000/api/book',
        bookingPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        }
      );

      if (response.data.success) {
        alert('Table booked successfully!');
        // Reset form
        setSelectedTable(null);
        setBookingData({
          table_id: '',
          customer_name: '',
          phone: '',
          email: '',
          reservation_date: '',
          reservation_time: '',
          guests: 1,
          special_requests: ''
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to book table');
    }
  };

  if (loading) return <div className="loading-state">Loading tables...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="booking-container">
      <h1 className="page-title">Reserve Your Table</h1>
      
      {/* Tables List */}
      <div className="tables-grid">
        {tables.map(table => (
          <div 
            key={table.table_id} 
            className={`table-card ${selectedTable?.table_id === table.table_id ? 'selected' : ''}`}
            onClick={() => handleTableSelect(table)}
          >
            <div className="table-card-header">
              <div className="table-info">
                <h3 className="table-title">Table {table.table_number}</h3>
                <p className="table-type">{table.table_type}</p>
                <p className="table-capacity">Capacity: {table.capacity} people</p>
              </div>
              {table.primary_image_name && (
                <img 
                  src={`http://localhost:4000/images/${table.primary_image_name.replace(/\\/g, '/')}`} 
                  alt={`Table ${table.table_number}`}
                  className="table-image"
                  onError={(e) => {
                    e.target.style.display = 'none'; // Hide broken images
                  }}
                />
              )}
            </div>
            <p className="table-description">{table.description}</p>
          </div>
        ))}
      </div>

      {/* Booking Form */}
      {selectedTable && (
        <div className="booking-form-container">
          <h2 className="booking-form-title">Book Table {selectedTable.table_number}</h2>
          
          <form onSubmit={handleBookTable} className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  name="customer_name"
                  value={bookingData.customer_name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={bookingData.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Reservation Date</label>
                <input
                  type="date"
                  name="reservation_date"
                  value={bookingData.reservation_date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Reservation Time</label>
                <input
                  type="time"
                  name="reservation_time"
                  value={bookingData.reservation_time}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Number of Guests</label>
                <input
                  type="number"
                  name="guests"
                  value={bookingData.guests}
                  onChange={handleInputChange}
                  min="1"
                  max={selectedTable.capacity}
                  required
                  className="form-input"
                />
                <p className="form-hint">Max capacity: {selectedTable.capacity}</p>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Special Requests</label>
              <textarea
                name="special_requests"
                value={bookingData.special_requests}
                onChange={handleInputChange}
                rows="3"
                className="form-textarea"
              />
            </div>

            <button
              type="submit"
              className="submit-button"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TableBookingComponent;
import './ReservationDetails.css';

import React, { useEffect, useState } from 'react';

import axios from 'axios';

const ReservationDetails = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const response = await axios.get('http://localhost:4000/api/reservation_id', {
          headers: {
            token,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setReservations(response.data.reservations);
        } else {
          throw new Error('Failed to fetch reservations');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loading-container">Loading reservations...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (reservations.length === 0) return <div className="no-data-message">No reservations found</div>;

  return (
    <div className="reservation-details-container">
      <div className="details-header">
        <h1>All Reservations</h1>
        <button className="print-button" onClick={handlePrint}>Print Reservations</button>
      </div>

      <div className="reservations-list">
        {reservations.map(reservation => (
          <div key={reservation.reservation_id} className="reservation-card">
            <div className="details-grid">
              <div className="info-column">
                <div className="section-header">
                  <h2>Reservation #{reservation.reservation_id}</h2>
                </div>
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${reservation.status}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(reservation.reservation_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{reservation.reservation_time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Guests:</span>
                    <span className="detail-value">{reservation.guests}</span>
                  </div>
                </div>
              </div>

              <div className="info-column">
                <div className="section-header">
                  <h2>Table Information</h2>
                </div>
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-label">Table Number:</span>
                    <span className="detail-value">{reservation.table_number}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value capitalize">{reservation.table_type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">{reservation.capacity}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="customer-details-section">
              <div className="section-header">
                <h3>Customer Information</h3>
              </div>
              <div className="customer-details-grid">
                <div className="customer-info-column">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{reservation.customer_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{reservation.phone}</span>
                  </div>
                </div>
                <div className="customer-info-column">
                  {reservation.email && (
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{reservation.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {reservation.special_requests && (
              <div className="special-requests-box">
                <span className="detail-label">Special Requests:</span>
                <p className="special-requests-text">{reservation.special_requests}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationDetails;

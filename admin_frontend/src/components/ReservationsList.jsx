import './ReservationsList.css'; // Import custom CSS file

import React, { useEffect, useState } from 'react';

import axios from 'axios';

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMap, setStatusMap] = useState({});

  // Fetch all reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/reservations');
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

  // Handle status update
  const handleStatusUpdate = async (reservationId) => {
    const status = statusMap[reservationId];
    if (!status) return;

    try {
      setUpdatingId(reservationId);
      const response = await axios.put(
        'http://localhost:4000/api/table-update',
        {
          reservation_id: reservationId,
          status: status
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setReservations(prev => prev.map(res =>
          res.reservation_id === reservationId
            ? { ...res, status: status }
            : res
        ));
        setStatusMap(prev => ({ ...prev, [reservationId]: '' }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="loading-container">Loading reservations...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h1>Reservation Management</h1>
      </div>

      {reservations.length === 0 ? (
        <div className="no-data-message">No reservations found</div>
      ) : (
        <div className="reservations-list">
          {reservations.map(reservation => (
            <div key={reservation.reservation_id} className="reservation-card">
              <div className="reservation-grid">

                {/* Reservation Info */}
                <div className="info-section">
                  <h2 className="info-title">
                    Reservation #{reservation.reservation_id}
                  </h2>
                  <div className="info-item">
                    <span className="info-label">Date:</span>
                    <span>{new Date(reservation.reservation_date).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Time:</span>
                    <span>{reservation.reservation_time}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Guests:</span>
                    <span>{reservation.guests}</span>
                  </div>
                </div>

                {/* Table Info */}
                <div className="info-section">
                  <h2 className="info-title">Table #{reservation.table_number}</h2>
                  <div className="info-item">
                    <span className="info-label">Type:</span>
                    <span className="capitalize">{reservation.table_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Capacity:</span>
                    <span>{reservation.capacity}</span>
                  </div>
                </div>

                {/* Status Management */}
                <div className="info-section">
                  <div className="status-display">
                    <span className="info-label">Current Status:</span>
                    <span className={`status-badge ${reservation.status}`}>
                      {reservation.status}
                    </span>
                  </div>

                  <div className="status-update">
                    <select
                      value={statusMap[reservation.reservation_id] || ''}
                      onChange={(e) =>
                        setStatusMap(prev => ({
                          ...prev,
                          [reservation.reservation_id]: e.target.value
                        }))
                      }
                      className="status-select"
                    >
                      <option value="">Select status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => handleStatusUpdate(reservation.reservation_id)}
                      disabled={
                        !statusMap[reservation.reservation_id] ||
                        updatingId === reservation.reservation_id
                      }
                      className={`update-button ${
                        (!statusMap[reservation.reservation_id] || updatingId === reservation.reservation_id)
                          ? 'disabled'
                          : ''
                      }`}
                    >
                      {updatingId === reservation.reservation_id ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="customer-section">
                <h3 className="customer-name">Customer: {reservation.customer_name}</h3>
                <div className="customer-details">
                  <div className="customer-info">Phone: {reservation.phone}</div>
                  {reservation.email && <div className="customer-info">Email: {reservation.email}</div>}
                </div>
                {reservation.special_requests && (
                  <div className="special-requests">
                    <span className="info-label">Special Requests:</span> {reservation.special_requests}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsList;

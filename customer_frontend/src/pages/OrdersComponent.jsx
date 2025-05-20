import './OrdersComponent.css';

import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';

const OrdersComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/order/order', {
          headers: { token }
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Status display components
  const OrderStatusBadge = ({ status }) => {
    const statusMap = {
      ready: { class: 'status-ready', text: 'Ready', icon: '✓' },
      '20min': { class: 'status-20min', text: '20 Min', icon: '⏱' },
      '30min': { class: 'status-30min', text: '30 Min', icon: '⏱' },
      '45min': { class: 'status-45min', text: '45 Min', icon: '⏱' },
      '60min': { class: 'status-60min', text: '60 Min', icon: '⏱' }
    };
    
    return (
      <span className={`status-badge ${statusMap[status]?.class || 'status-default'}`}>
        {statusMap[status]?.icon} {statusMap[status]?.text || status}
      </span>
    );
  };

  const CurrentStatusBadge = ({ status }) => {
    const statusMap = {
      processing: { class: 'status-processing', text: 'Processing', icon: '🔄' },
      completed: { class: 'status-completed', text: 'Completed', icon: '✓' },
      pending: { class: 'status-pending', text: 'Pending', icon: '⏳' },
      'ready to pickup': { class: 'status-ready-pickup', text: 'Ready for Pickup', icon: '🚀' },
      cancelled: { class: 'status-cancelled', text: 'Cancelled', icon: '✕' }
    };
    
    return (
      <span className={`status-badge ${statusMap[status]?.class || 'status-default'}`}>
        {statusMap[status]?.icon} {statusMap[status]?.text || status}
      </span>
    );
  };

  const OrderCard = ({ order }) => {
    const { toPDF, targetRef } = usePDF({filename: `order-${order.order_id}.pdf`});

    return (
      <div className="order-card" ref={targetRef}>
        <div className="order-header">
          <h3>Order #{order.order_id}</h3>
          <div className="order-meta">
            <span>Date: {new Date(order.order_date).toLocaleString()}</span>
            <div className="status-container">
              <CurrentStatusBadge status={order.current_status} />
              <OrderStatusBadge status={order.order_status} />
            </div>
            <span>Total: ${order.total_amount}</span>
          </div>
        </div>
        
        <div className="order-details">
          <div className="payment-info">
            <p>
              <span className="info-label">Payment:</span> 
              <span className={`payment-method ${order.payment_method}`}>
                {order.payment_method} 
              </span>
              <span className={`payment-status ${order.payment_status}`}>
                ({order.payment_status})
              </span>
            </p>
            <p>
              <span className="info-label">Amount Paid:</span> 
              ${order.amount_paid}
            </p>
          </div>
          
          {order.shipping_address && (
            <div className="shipping-info">
              <p className="info-label">Shipping Address:</p>
              <p>{order.shipping_address}</p>
            </div>
          )}
        </div>

        <div className="order-items">
          <h4>Items:</h4>
          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.order_item_id}>
                    <td>{item.product_id}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unit_price}</td>
                    <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="order-actions">
          <button 
            className="action-button download-button"
            onClick={() => toPDF()}
          >
            Download Bill
          </button>
          
          {order.current_status === 'ready to pickup' && (
            <button className="action-button pickup-button">
              Confirm Pickup
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="orders-container">
      <div className="header-with-button">
        <h2>Your Orders</h2>
        <button className="home-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/products')}>Browse Products</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersComponent;
import './OrderManagement.css'; // Add this import for custom styles

import { Alert, Badge, Button, Form, Modal, Spinner, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [newOrderStatus, setNewOrderStatus] = useState('');
    const [newCurrentStatus, setNewCurrentStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    // Fetch orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/order/all_orders');
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    // Update status handler
    const handleStatusUpdate = async () => {
        if (!currentOrder || (!newOrderStatus && !newCurrentStatus)) return;

        try {
            setUpdating(true);
            const response = await fetch('http://localhost:4000/api/order/all_order_update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: currentOrder.order_id,
                    order_status: newOrderStatus || currentOrder.order_status,
                    current_status: newCurrentStatus || currentOrder.current_status
                })
            });

            if (!response.ok) throw new Error('Failed to update order status');
            
            // Update local state
            setOrders(orders.map(order => 
                order.order_id === currentOrder.order_id ? { 
                    ...order, 
                    order_status: newOrderStatus || order.order_status,
                    current_status: newCurrentStatus || order.current_status
                } : order
            ));

            setShowModal(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    // Status badges
    const OrderStatusBadge = ({ status }) => {
        const statusMap = {
            ready: { bg: 'success', text: 'Ready' },
            '20min': { bg: 'primary', text: '20 Min' },
            '30min': { bg: 'info', text: '30 Min' },
            '45min': { bg: 'warning', text: '45 Min' },
            '60min': { bg: 'danger', text: '60 Min' }
        };
        return <Badge bg={statusMap[status]?.bg || 'secondary'} className="custom-badge">{statusMap[status]?.text || status}</Badge>;
    };

    const CurrentStatusBadge = ({ status }) => {
        const statusMap = {
            processing: { bg: 'warning', text: 'Processing' },
            completed: { bg: 'success', text: 'Completed' },
            pending: { bg: 'secondary', text: 'Pending' },
            'ready to pickup': { bg: 'primary', text: 'Ready to Pickup' },
            cancelled: { bg: 'danger', text: 'Cancelled' }
        };
        return <Badge bg={statusMap[status]?.bg || 'secondary'} className="custom-badge">{statusMap[status]?.text || status}</Badge>;
    };

    if (loading) return <div className="text-center my-5 loading-spinner"><Spinner animation="border" className="orange-spinner" /> Loading orders...</div>;
    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <div className="order-management-container p-4">
            <h2 className="mb-4 page-title">Order Management</h2>
            
            <Table striped bordered hover responsive className="custom-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Order Status</th>
                        <th>Current Status</th>
                        <th>Items</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.order_id}>
                            <td>{order.order_id}</td>
                            <td>{order.customer_id}</td>
                            <td>{new Date(order.order_date).toLocaleString()}</td>
                            <td>LKR{order.total_amount}</td>
                            <td><OrderStatusBadge status={order.order_status} /></td>
                            <td><CurrentStatusBadge status={order.current_status} /></td>
                            <td>
                                <ul className="list-unstyled mb-0">
                                    {order.items.map(item => (
                                        <li key={item.order_item_id}>
                                            {item.product_id} (Qty: {item.quantity}) @ LKR{item.unit_price}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    className="custom-btn"
                                    onClick={() => {
                                        setCurrentOrder(order);
                                        setNewOrderStatus(order.order_status);
                                        setNewCurrentStatus(order.current_status);
                                        setShowModal(true);
                                    }}
                                >
                                    Update Status
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Status Update Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal">
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title>Update Order #{currentOrder?.order_id}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Order Status</Form.Label>
                            <Form.Select 
                                value={newOrderStatus} 
                                onChange={(e) => setNewOrderStatus(e.target.value)}
                                className="custom-select"
                            >
                                <option value="ready">Ready</option>
                                <option value="20min">20 Minutes</option>
                                <option value="30min">30 Minutes</option>
                                <option value="45min">45 Minutes</option>
                                <option value="60min">60 Minutes</option>
                            </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Current Status</Form.Label>
                            <Form.Select 
                                value={newCurrentStatus} 
                                onChange={(e) => setNewCurrentStatus(e.target.value)}
                                className="custom-select"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="ready to pickup">Ready to Pickup</option>
                                <option value="cancelled">Cancelled</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="cancel-btn">
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleStatusUpdate}
                        className="update-btn"
                        disabled={updating || (
                            newOrderStatus === currentOrder?.order_status && 
                            newCurrentStatus === currentOrder?.current_status
                        )}
                    >
                        {updating ? <><Spinner size="sm" className="orange-spinner" /> Updating...</> : 'Update Status'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderManagement;
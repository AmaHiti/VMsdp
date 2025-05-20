import { Alert, Badge, Button, Form, Modal, Spinner, Tab, Table, Tabs } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [newCurrentStatus, setNewCurrentStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('order');

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/order/all_order');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateOrderStatus = async () => {
    if (!currentOrder) return;
    if (!newOrderStatus && !newCurrentStatus) return;

    try {
      setUpdating(true);
      const response = await fetch('http://localhost:4000/api/order/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: currentOrder.order_id,
          order_status: newOrderStatus || undefined,
          current_status: newCurrentStatus || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const result = await response.json();
      
      // Update local state
      setOrders(orders.map(order => 
        order.order_id === currentOrder.order_id 
          ? { 
              ...order, 
              order_status: newOrderStatus || order.order_status,
              current_status: newCurrentStatus || order.current_status
            } 
          : order
      ));

      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Order Status Badge component
  const OrderStatusBadge = ({ status }) => {
    switch (status) {
      case 'ready':
        return <Badge bg="success">Ready</Badge>;
      case '20min':
        return <Badge bg="primary">20 Min</Badge>;
      case '30min':
        return <Badge bg="info">30 Min</Badge>;
      case '45min':
        return <Badge bg="warning">45 Min</Badge>;
      case '60min':
        return <Badge bg="danger">60 Min</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Current Status Badge component
  const CurrentStatusBadge = ({ status }) => {
    switch (status) {
      case 'processing':
        return <Badge bg="warning">Processing</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'pending':
        return <Badge bg="secondary">Pending</Badge>;
      case 'ready to pickup':
        return <Badge bg="primary">Ready to Pickup</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Payment status badge
  const PaymentBadge = ({ status }) => {
    switch (status) {
      case 'paid':
        return <Badge bg="success">Paid</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'failed':
        return <Badge bg="danger">Failed</Badge>;
      case 'refunded':
        return <Badge bg="info">Refunded</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Payment method badge
  const PaymentMethodBadge = ({ method }) => {
    switch (method) {
      case 'full':
        return <Badge bg="primary">Full Payment</Badge>;
      case 'advance':
        return <Badge bg="info">Advance Payment</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        Error: {error}
      </Alert>
    );
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Order Management</h2>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
            <th>Payment Method</th>
            <th>Amount Paid</th>
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
              <td><PaymentBadge status={order.payment_status} /></td>
              <td><PaymentMethodBadge method={order.payment_method} /></td>
              <td>LKR{order.amount_paid}</td>
              <td><OrderStatusBadge status={order.order_status} /></td>
              <td><CurrentStatusBadge status={order.current_status} /></td>
              <td>
                <ul className="list-unstyled">
                  {order.items && order.items.map(item => (
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
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="order" title="Order Status">
              <Form.Group className="mb-3 mt-3">
                <Form.Label>Current Order Status</Form.Label>
                <Form.Control 
                  plaintext 
                  readOnly 
                  value={currentOrder?.order_status} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Order Status</Form.Label>
                <Form.Select 
                  value={newOrderStatus} 
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                >
                  <option value="">-- No Change --</option>
                  <option value="ready">Ready</option>
                  <option value="20min">20 Minutes</option>
                  <option value="30min">30 Minutes</option>
                  <option value="45min">45 Minutes</option>
                  <option value="60min">60 Minutes</option>
                </Form.Select>
              </Form.Group>
            </Tab>
            <Tab eventKey="current" title="Current Status">
              <Form.Group className="mb-3 mt-3">
                <Form.Label>Current Status</Form.Label>
                <Form.Control 
                  plaintext 
                  readOnly 
                  value={currentOrder?.current_status} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Current Status</Form.Label>
                <Form.Select 
                  value={newCurrentStatus} 
                  onChange={(e) => setNewCurrentStatus(e.target.value)}
                >
                  <option value="">-- No Change --</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="ready to pickup">Ready to Pickup</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={updateOrderStatus}
            disabled={updating || (!newOrderStatus && !newCurrentStatus)}
          >
            {updating ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" />
                {' Updating...'}
              </>
            ) : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
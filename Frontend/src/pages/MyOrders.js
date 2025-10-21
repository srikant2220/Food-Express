import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Accordion } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useFirebaseAuth } from '../context/FirebaseAuthContext';
import { orderService } from '../services/orderService.js';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderService.getUserOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'out-for-delivery': return 'info';
      case 'preparing': return 'warning';
      case 'confirmed': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Orders</h1>
        <Button variant="outline-primary" onClick={() => navigate('/restaurants')}>
          Order Again
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
          </div>
          <h3>No orders yet</h3>
          <p className="text-muted mb-4">You haven't placed any orders yet.</p>
          <Button variant="primary" onClick={() => navigate('/restaurants')}>
            Browse Restaurants
          </Button>
        </div>
      ) : (
        <Accordion defaultActiveKey="0" className="orders-accordion">
          {orders.map((order, index) => (
            <Accordion.Item key={order._id} eventKey={index.toString()}>
              <Accordion.Header>
                <div className="d-flex justify-content-between align-items-center w-100 me-3">
                  <div>
                    <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                    <small className="text-muted d-block">
                      {formatDate(order.createdAt)}
                    </small>
                  </div>
                  <div className="text-end">
                    <Badge bg={getStatusVariant(order.status)} className="me-2">
                      {order.status.replace(/-/g, ' ').toUpperCase()}
                    </Badge>
                    <div className="text-primary fw-bold">₹{order.totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={8}>
                    <div className="mb-3">
                      <h6>Items Ordered</h6>
                      {order.items.map((item) => (
                        <div key={item.foodItem._id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <div className="d-flex align-items-center">
                            <img
                              src={item.foodItem.image || 'https://via.placeholder.com/50x50?text=Food'}
                              alt={item.foodItem.name}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50x50?text=Food';
                              }}
                            />
                            <div>
                              <div className="fw-medium">{item.foodItem.name}</div>
                              <small className="text-muted">₹{item.price} × {item.quantity}</small>
                            </div>
                          </div>
                          <div className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <h6>Order Details</h6>
                      <div className="row small">
                        <div className="col-6">
                          <strong>Order ID:</strong> {order._id.slice(-8).toUpperCase()}
                        </div>
                        <div className="col-6">
                          <strong>Order Date:</strong> {formatDate(order.createdAt)}
                        </div>
                        <div className="col-6">
                          <strong>Payment Status:</strong>
                          <Badge bg={order.paymentStatus === 'paid' ? 'success' : 'warning'} className="ms-2">
                            {order.paymentStatus.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="col-6">
                          <strong>Items:</strong> {getTotalItems(order.items)}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col md={4}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6>Order Summary</h6>
                        <div className="d-flex justify-content-between mb-1">
                          <span>Subtotal:</span>
                          <span>₹{(order.totalAmount - 40 - (order.totalAmount * 0.05)).toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span>Delivery Fee:</span>
                          <span>₹40.00</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span>Tax (5%):</span>
                          <span>₹{(order.totalAmount * 0.05).toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-3">
                          <strong>Total:</strong>
                          <strong>₹{order.totalAmount.toFixed(2)}</strong>
                        </div>

                        <div className="mb-3">
                          <h6>Delivery Address</h6>
                          <p className="text-muted small mb-0">{order.deliveryAddress}</p>
                        </div>

                        {order.specialInstructions && (
                          <div className="mb-3">
                            <h6>Special Instructions</h6>
                            <p className="text-muted small mb-0">{order.specialInstructions}</p>
                          </div>
                        )}

                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="w-100"
                          onClick={() => navigate(`/restaurant/${order.restaurant._id}`)}
                        >
                          Order Again
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default MyOrders;
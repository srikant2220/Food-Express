import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table } from 'react-bootstrap';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useFirebaseAuth } from '../context/FirebaseAuthContext.js';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService.js';
import useRazorpay from '../hooks/useRazorpay.js';
import { paymentService } from '../services/paymentService.js';
import { useToast } from '../context/ToastContext.js';

const Cart = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { initiatePayment, loading: paymentLoading } = useRazorpay();
  const { showToast } = useToast();

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, parseInt(newQuantity));
  };

  const handlePlaceOrder = async () => {
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }

  try {
    setLoading(true);
    setError('');

    // Get restaurant ID from the first item
    const restaurantId = items[0]?.restaurant?._id || items[0]?.restaurant;
    
    if (!restaurantId) {
      throw new Error('Invalid restaurant information');
    }

    // Calculate totals
    const deliveryFee = 40;
    const tax = total * 0.05;
    const finalTotal = total + deliveryFee + tax;

    // Create Razorpay order
    const orderAmount = Math.round(finalTotal*100); 
    const razorpayOrder = await paymentService.createRazorpayOrder(orderAmount);
    
    // Initiate payment
    const paymentResult = await initiatePayment({
      ...razorpayOrder.data, // Assuming the API response has data property
      name: user?.name,
      email: user?.email,
      phone: user?.phone || ''
    });
    
    console.log('Payment result:', paymentResult);
    
    if (paymentResult.success) {
      // Verify payment
      const verification = await paymentService.verifyPayment({
        order_id: paymentResult.response.razorpay_order_id,
        payment_id: paymentResult.response.razorpay_payment_id,
        signature: paymentResult.response.razorpay_signature
      });
      
      if (verification.data.success) {
        // Create order in database
        const orderData = {
          restaurant: restaurantId,
          items: items.map(item => ({
          foodItem: item._id,      // Must exist
          quantity: item.quantity, // Must exist
          price: item.price        // Must exist
        })),
          deliveryAddress: user?.address,
          specialInstructions: '',
          paymentStatus: 'paid',
          paymentId: paymentResult.response.razorpay_payment_id,
          razorpayOrderId: razorpayOrder.id,
        };


        console.log(orderData);
        
        await orderService.createOrder(orderData);
        showToast('Order placed successfully!', 'Order Confirmed', 'success');
        clearCart();
        
        // Redirect to home page after successful order
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error('Payment verification failed');
      }
    } else {
      throw new Error(paymentResult.response?.error || 'Payment failed or was cancelled');
    }
  } catch (error) {
    console.error('Order placement error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
    setError(errorMessage);
    showToast(errorMessage, 'Payment Failed', 'danger');
  } finally {
    setLoading(false);
  }
};

  if (items.length === 0) {
    return (
      <Container className="text-center py-5">
        <h2>Your Cart is Empty</h2>
        <p className="text-muted mb-4">Add some delicious food to get started!</p>
        <Button onClick={() => navigate('/restaurants')} variant="primary">
          Browse Restaurants
        </Button>
      </Container>
    );
  }

  // Calculate totals
  const deliveryFee = 40;
  const tax = total * 0.05;
  const finalTotal = total + deliveryFee + tax;

  return (
    <Container>
      <h1 className="text-center mb-4">Your Cart</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image || 'https://via.placeholder.com/50x50?text=Food'}
                            alt={item.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50x50?text=Food';
                            }}
                          />
                          <div>
                            <h6 className="mb-0">{item.name}</h6>
                            <small className="text-muted">{item.description}</small>
                          </div>
                        </div>
                      </td>
                      <td>₹{item.price}</td>
                      <td>
                        <Form.Select
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                          style={{ width: '80px' }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>₹{item.price * item.quantity}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <div className="text-end mt-3">
            <Button variant="outline-secondary" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>₹{finalTotal.toFixed(2)}</strong>
              </div>

              {finalTotal > 500 && (
                <Alert variant="success" className="small">
                  🎉 You qualify for <strong>free delivery</strong>!
                </Alert>
              )}

              <Button 
                variant="primary" 
                size="lg" 
                className="w-100" 
                onClick={handlePlaceOrder}
                disabled={loading || paymentLoading}
              >
                {loading || paymentLoading ? (
                  <>
                    <span 
                      className="spinner-border spinner-border-sm me-2" 
                      role="status" 
                      aria-hidden="true"
                    ></span>
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>

              {!isAuthenticated && (
                <Alert variant="warning" className="mt-3">
                  Please <a href="/login" onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}>login</a> to place your order.
                </Alert>
              )}

              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/restaurants')}
                >
                  ← Continue Shopping
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
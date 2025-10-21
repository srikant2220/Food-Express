import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="hero-section">
        <Container>
          <h1 className="display-4 fw-bold">Delicious Food Delivered</h1>
          <p className="lead mb-4">Order from your favorite restaurants with just a few clicks</p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/restaurants')}
          >
            Order Now
          </Button>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <h3>🚀 Fast Delivery</h3>
            <p>Get your food delivered in under 30 minutes</p>
          </Col>
          <Col md={4} className="mb-4">
            <h3>🍕 Wide Variety</h3>
            <p>Choose from hundreds of restaurants and cuisines</p>
          </Col>
          <Col md={4} className="mb-4">
            <h3>⭐ Best Quality</h3>
            <p>Fresh ingredients and authentic flavors guaranteed</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
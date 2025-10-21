import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>🍕 FoodExpress</h5>
            <p>Delivering happiness to your doorstep</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>© 2024 FoodExpress. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
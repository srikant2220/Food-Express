import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext.js';

const Navbar = () => {
  const { getCartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return window.location.pathname === path;
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <BootstrapNavbar.Brand 
          as={Link} 
          to="/"
          className="text-decoration-none"
        >
          🍕 FoodExpress
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/"
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/restaurants"
              className={isActive('/restaurants') ? 'active' : ''}
            >
              Restaurants
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/my-orders"
              className={isActive('/my-orders') ? 'active' : ''}
            >
              My Orders
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link 
              as={Link} 
              to="/cart"
              className={isActive('/cart') ? 'active' : ''}
            >
              🛒 Cart <Badge bg="primary">{getCartCount()}</Badge>
            </Nav.Link>
            
            {isAuthenticated ? (
              <>
                <Nav.Link className="text-light">
                  Welcome, {user?.name}
                </Nav.Link>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login"
                  className={isActive('/login') ? 'active' : ''}
                >
                  Login
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register"
                  className={isActive('/register') ? 'active' : ''}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useFirebaseAuth } from '../context/FirebaseAuthContext.js';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // useEffect(() => {
  //   // Clear any previous errors when component mounts
  //   clearError();
  //   setValidationErrors({});
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    // setValidationErrors({});
    // clearError();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/');
      }
      // Error is handled by auth context
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className="p-4">
        <h2 className="text-center mb-4">Login</h2>
        
        {/* Server error from auth context */}
        {error && (
          <Alert 
            variant="danger" 
            dismissible 
            onClose={clearError}
            className="mb-3"
          >
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              isInvalid={!!getFieldError('email')}
            />
            <Form.Control.Feedback type="invalid">
              {getFieldError('email')}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              isInvalid={!!getFieldError('password')}
            />
            <Form.Control.Feedback type="invalid">
              {getFieldError('password')}
            </Form.Control.Feedback>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mb-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
          
          <div className="text-center">
            <span>Don't have an account? </span>
            <Link 
              to="/register" 
              onClick={() => {
                setValidationErrors({});
                clearError();
              }}
            >
              Register here
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
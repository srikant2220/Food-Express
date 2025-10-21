import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import RestaurantCard from '../components/restaurant/RestaurantCard.js';
import { restaurantService } from '../services/restaurantService.js';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getAllRestaurants();
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load restaurants. Please try again later.');
        setLoading(false);
        console.error('Error fetching restaurants:', err);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchTerm, selectedCuisine, restaurants]);

  // Extract unique cuisines from restaurants
  const cuisines = ['all', ...new Set(restaurants.map(r => r.cuisine))];

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading restaurants...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-4">
        <h1 className="text-center mb-4">Our Restaurants</h1>
        
        <Row className="g-3">
          <Col md={8}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine === 'all' ? 'All Cuisines' : cuisine}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-5">
          <h4>No restaurants found</h4>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      ) : (
        <Row>
          {filteredRestaurants.map(restaurant => (
            <Col key={restaurant._id} lg={4} md={6} className="mb-4">
              <RestaurantCard restaurant={restaurant} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default RestaurantList;
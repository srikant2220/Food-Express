import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Alert, Spinner, Breadcrumb } from 'react-bootstrap';
import FoodItemCard from '../components/restaurant/FoodItemCard.js';
import { restaurantService } from '../services/restaurantService.js';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const [restaurantResponse, menuResponse] = await Promise.all([
          restaurantService.getRestaurantById(id),
          restaurantService.getRestaurantMenu(id)
        ]);
        
        setRestaurant(restaurantResponse.data);
        setMenuItems(menuResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load restaurant menu. Please try again later.');
        setLoading(false);
        console.error('Error fetching restaurant data:', err);
      }
    };

    fetchRestaurantData();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading menu...</p>
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

  if (!restaurant) {
    return (
      <Container>
        <Alert variant="warning">Restaurant not found</Alert>
      </Container>
    );
  }

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <Container>
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/" className="text-decoration-none">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/restaurants" className="text-decoration-none">Restaurants</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{restaurant.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center mb-5">
        <h1>{restaurant.name}</h1>
        <p className="lead text-muted">{restaurant.description}</p>
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <span>⭐ {restaurant.rating} ({restaurant.reviews} reviews)</span>
          <span>• 🕒 {restaurant.deliveryTime} min delivery</span>
          <span>• 🍽️ {restaurant.cuisine}</span>
        </div>
      </div>

      {categories.map(category => (
        <div key={category} className="mb-5">
          <h3 className="mb-4 border-bottom pb-2">{category}</h3>
          <Row>
            {menuItems
              .filter(item => item.category === category)
              .map(item => (
                <Col key={item._id} lg={4} md={6} className="mb-4">
                  <FoodItemCard foodItem={item} />
                </Col>
              ))}
          </Row>
        </div>
      ))}

      {menuItems.length === 0 && (
        <div className="text-center py-5">
          <h4>No menu items available</h4>
          <p className="text-muted">Please check back later</p>
        </div>
      )}
    </Container>
  );
};

export default RestaurantMenu;
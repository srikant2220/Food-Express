import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const handleViewMenu = () => {
    navigate(`/restaurant/${restaurant._id}`);
  };

  return (
    <Card className="food-card h-100">
      <Card.Img 
        variant="top" 
        src={restaurant.image || 'https://via.placeholder.com/300x200?text=Restaurant'} 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary" className="mb-2">
            {restaurant.cuisine || 'Multi-cuisine'}
          </Badge>
        </div>
        
        <Card.Title className="flex-grow-0">{restaurant.name}</Card.Title>
        
        <Card.Text className="text-muted flex-grow-1">
          {restaurant.description || 'Delicious food served with love'}
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="text-warning">⭐ {restaurant.rating || '4.2'}</span>
            <span className="text-muted ms-2">({restaurant.reviews || 120} reviews)</span>
          </div>
          <span className="text-muted">• {restaurant.deliveryTime || '30'} min</span>
        </div>
        
        <Button variant="primary" onClick={handleViewMenu} className="mt-auto">
          View Menu
        </Button>
      </Card.Body>
    </Card>
  );
};

export default RestaurantCard;
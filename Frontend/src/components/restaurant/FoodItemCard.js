import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useCart } from '../../context/CartContext.js';

const FoodItemCard = ({ foodItem }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(foodItem);
  };

  return (
    <Card className="food-card h-100">
      <Card.Img 
        variant="top" 
        src={foodItem.image || 'https://via.placeholder.com/300x200?text=Food+Item'} 
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=Food+Item';
        }}
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="h6 mb-0">{foodItem.name}</Card.Title>
          <Badge bg="success" className="ms-2">
            ₹{foodItem.price}
          </Badge>
        </div>
        
        <Card.Text className="text-muted small flex-grow-1">
          {foodItem.description || 'Delicious food item'}
        </Card.Text>
        
        {foodItem.category && (
          <Badge bg="outline-secondary" className="mb-2 align-self-start">
            {foodItem.category}
          </Badge>
        )}
        
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={handleAddToCart}
          className="mt-auto"
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FoodItemCard;
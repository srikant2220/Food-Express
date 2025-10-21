import React, { createContext, useContext, useReducer } from 'react';
import useToast from '../hooks/useToast';
import ToastNotification from '../components/common/ToastNotification.js'; // Add this import

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };

    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item._id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.items.reduce((total, item) => {
          if (item._id === action.payload.id) {
            return total + (item.price * action.payload.quantity);
          }
          return total + (item.price * item.quantity);
        }, 0)
      };

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0 
  });
  
  const { toast, showToast, hideToast } = useToast();

  const addToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    
    // Show success toast
    showToast(`${item.name} added to cart!`, 'Cart Updated', 'success');
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    
    // Show info toast
    const item = cartState.items.find(i => i._id === itemId);
    if (item) {
      showToast(`${item.name} removed from cart`, 'Cart Updated', 'info');
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    showToast('Cart cleared successfully', 'Cart Cleared', 'info');
  };

  const getCartCount = () => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: cartState.items,
    total: cartState.total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <ToastNotification
        show={toast.show}
        onClose={hideToast}
        message={toast.message}
        title={toast.title}
        variant={toast.variant}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
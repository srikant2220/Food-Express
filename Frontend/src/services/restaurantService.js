import api from './api';

export const restaurantService = {
  getAllRestaurants: () => api.get('/restaurants'),
  getRestaurantById: (id) => api.get(`/restaurants/${id}`),
  getRestaurantMenu: (id) => api.get(`/restaurants/${id}/menu`),
  searchRestaurants: (query) => api.get(`/restaurants?search=${query}`),
};

export const foodService = {
  getFoodItem: (id) => api.get(`/food/${id}`),
};
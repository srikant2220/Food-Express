import api from './api';

export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};
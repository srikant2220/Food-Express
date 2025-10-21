import api from './api.js';

const realCreateRazorpayOrder = async (amount) => {
  console.log('🟢 Production Mode: Creating real Razorpay order');
  return api.post('/payment/create-order', { amount,  currency : 'INR'});
};

const realVerifyPayment = async (paymentData) => {
  console.log('🟢 Production Mode: Verifying real payment');
  return api.post('/payment/verify-payment', paymentData);
};

export const paymentService = {
  createRazorpayOrder: (amount) => {
    return realCreateRazorpayOrder(amount);
  },
  
  verifyPayment: (paymentData) => {
    return realVerifyPayment(paymentData);
  }
};

export default paymentService;
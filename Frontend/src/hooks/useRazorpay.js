import { useState, useCallback } from 'react';
import { loadRazorpay } from '../utils/razorpayUtils.js';

const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = useCallback(async (orderData) => {
    setLoading(true);
    try {
      await loadRazorpay();
      
      return new Promise((resolve) => {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'FoodExpress',
          description: 'Food Order Payment',
          order_id: orderData.id,
          prefill: {
            name: orderData.name,
            email: orderData.email,
            contact: orderData.phone || ''
          },
          theme: {
            color: '#3399cc'
          },
          handler: function (response) {
            resolve({ success: true, response });
          },
          modal: {
            ondismiss: function() {
              resolve({ success: false, response: { error: 'Payment cancelled' } });
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        
        // Fallback timeout in case Razorpay doesn't call handler
        setTimeout(() => {
          resolve({ success: false, response: { error: 'Payment timeout' } });
        }, 300000); // 5 minutes timeout
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { initiatePayment, loading };
};

export default useRazorpay;
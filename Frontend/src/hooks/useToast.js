import { useState, useCallback } from 'react';

const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    title: 'Success',
    variant: 'success'
  });

  const showToast = useCallback((message, title = 'Success', variant = 'success') => {
    setToast({
      show: true,
      message,
      title,
      variant
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast
  };
};

export default useToast;
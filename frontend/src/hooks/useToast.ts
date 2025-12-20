import { useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../components/ui/Toast';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, title: string, description?: string, duration?: number) => {
    const id = Date.now().toString();
    const toast: ToastMessage = {
      id,
      type,
      title,
      description,
      duration,
    };

    setToasts((prev) => [...prev, toast]);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string) => {
    return addToast('success', title, description);
  }, [addToast]);

  const error = useCallback((title: string, description?: string) => {
    return addToast('error', title, description, 7000);
  }, [addToast]);

  const warning = useCallback((title: string, description?: string) => {
    return addToast('warning', title, description);
  }, [addToast]);

  const info = useCallback((title: string, description?: string) => {
    return addToast('info', title, description);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};
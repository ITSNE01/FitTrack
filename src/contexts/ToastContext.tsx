import React, { createContext, useContext, useState } from 'react';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
}

interface ToastContextType {
  toast: Toast;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast>({
    message: '',
    type: 'info',
    show: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

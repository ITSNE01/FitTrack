import React from 'react';
import { useToast } from '../contexts/ToastContext';

const Toast: React.FC = () => {
  const { toast, hideToast } = useToast();

  if (!toast.show) return null;

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
      <div className={`toast show`}>
        <div className={`toast-header bg-${toast.type === 'error' ? 'danger' : toast.type} text-white`}>
          <strong className="me-auto">
            {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
          </strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={hideToast}
          ></button>
        </div>
        <div className="toast-body">
          {toast.message}
        </div>
      </div>
    </div>
  );
};

export default Toast;

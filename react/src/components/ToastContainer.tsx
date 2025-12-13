import React, { useState, useCallback } from "react";
import Toast, { type ToastType } from "./Toast";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  className?: string;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "top-right",
  className = "",
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info", duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastItem = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const getPositionStyles = () => {
    const baseStyles = "fixed z-50 pointer-events-none";

    switch (position) {
      case "top-right":
        return `${baseStyles} top-18 right-3`;
      case "top-left":
        return `${baseStyles} top-18 left-3`;
      case "bottom-right":
        return `${baseStyles} bottom-4 right-4`;
      case "bottom-left":
        return `${baseStyles} bottom-4 left-4`;
      case "top-center":
        return `${baseStyles} top-8 left-1/2 transform -translate-x-1/2`;
      case "bottom-center":
        return `${baseStyles} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseStyles} top-8 right-4`;
    }
  };

  // Expose addToast function globally for easy access
  React.useEffect(() => {
    (window as any).showToast = addToast;
    return () => {
      delete (window as any).showToast;
    };
  }, [addToast]);

  return (
    <div className={`${getPositionStyles()} ${className}`}>
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Hook to use toast functionality
export const useToast = () => {
  const addToast = (message: string, type: ToastType = "info", duration = 5000) => {
    if ((window as any).showToast) {
      (window as any).showToast(message, type, duration);
    }
  };

  return {
    success: (message: string, duration?: number) => addToast(message, "success", duration),
    error: (message: string, duration?: number) => addToast(message, "error", duration),
    warning: (message: string, duration?: number) => addToast(message, "warning", duration),
    info: (message: string, duration?: number) => addToast(message, "info", duration),
  };
};

export default ToastContainer;
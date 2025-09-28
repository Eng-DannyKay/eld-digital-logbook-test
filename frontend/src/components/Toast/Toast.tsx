
import React, { useEffect } from "react";
import { useToastStore } from "../../store/toastStore";

const toastColors = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
};


const Toast: React.FC = () => {
  const { message, type, visible, duration, hideToast } = useToastStore();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      hideToast();
    }, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, hideToast]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg transition-all ${toastColors[type]}`}
      role="alert"
    >
      <span>{message}</span>
      <button
        className="ml-4 text-white font-bold focus:outline-none"
        onClick={hideToast}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

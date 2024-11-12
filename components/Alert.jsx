import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const Alert = ({
  message,
  type = "success",
  duration = 5000,
  onClose,
  isVisible = false,
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    setIsShowing(isVisible);

    if (isVisible && duration) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const baseStyles =
    "fixed left-1/2 top-24 p-4 rounded-lg shadow-lg transform -translate-x-1/2 transition-all duration-300 ease-in-out flex items-center gap-2 max-w-md z-50";

  const variants = {
    success: "bg-green-50 text-green-800 border border-green-200",
    error: "bg-red-50 text-red-800 border border-red-200",
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
  };

  const translateStyle = isShowing
    ? "translate-y-0 opacity-100"
    : "-translate-y-full opacity-0 pointer-events-none";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`${baseStyles} ${variants[type]} ${translateStyle}`}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          setIsShowing(false);
          if (onClose) onClose();
        }}
        className="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Alert;

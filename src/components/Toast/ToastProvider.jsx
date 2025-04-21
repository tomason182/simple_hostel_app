import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Toast from "./Toast";
import styles from "./ToastProvider.module.css";
import ToastContext from "../../hooks/useToast";

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState([]);

  const addToast = useCallback(
    ({ message, type = "info", duration = 3000 }) => {
      const id = Date.now();
      setToast(prev => [...prev, { id, message, type, duration }]);
      const timeout = setTimeout(() => removeToast(id), duration);
      return () => clearTimeout(timeout);
    },
    []
  );

  const removeToast = useCallback(id => {
    setToast(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className={styles.toastContainer}>
        {toast.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

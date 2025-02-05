import { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.css";

export default function Modal({
  isOpen,
  onClose,
  width = "500px",
  height = "auto",
  header,
  children,
  footer,
  closeOnOverlayClick = true,
}) {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={closeOnOverlayClick ? onClose : null}
    >
      <div
        className={styles.modalContainer}
        style={{ width, height }}
        onClick={e => e.stopPropagation()}
      >
        {header && <div className={styles.modalHeader}>{header}</div>}
        <div className={styles.modalBody}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
        <button className={styles.modalCloseBtn} onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  header: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  closeOnOverlayClick: PropTypes.bool,
};

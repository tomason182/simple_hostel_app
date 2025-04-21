import PropTypes from "prop-types";
import styles from "./Toast.module.css";

export default function Toast({ message, type = "info", onClose }) {
  return (
    <div className={`${styles.toast} ${styles[type]}`} onClick={onClose}>
      {message}
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["info", "success", "error", "warning"]),
  onClose: PropTypes.func.isRequired,
};

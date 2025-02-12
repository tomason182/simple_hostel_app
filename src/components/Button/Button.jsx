import styles from "./Button.module.css";
import PropTypes from "prop-types";

export default function Button({ title, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span>{title}</span>
    </button>
  );
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

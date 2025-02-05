import styles from "./Spinner.module.css";
import PropTypes from "prop-types";

export default function Spinner({ size = 40, thickness = 4 }) {
  return (
    <div
      className={styles.spinner}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${thickness}`,
      }}
    ></div>
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
  thickness: PropTypes.number,
};

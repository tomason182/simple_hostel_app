import styles from "./defaultFormStyle.module.css";
import Spinner from "../components/Spinner/Spinner";
import PropTypes from "prop-types";

export default function ReservationConfirmation({
  setIsOpen,
  setIndex,
  error,
  loading,
}) {
  if (loading) return <Spinner size={50} />;

  if (error)
    return (
      <div>
        <br />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="116"
          height="116"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#eb4034"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <h4 className={styles.subtitle} style={{ textAlign: "center" }}>
          An error occurred trying to create the reservation
        </h4>
        <p className={styles.paragraph}>Error description</p>
        <button className={styles.submitButton}>Close</button>
      </div>
    );

  return (
    <div>
      <br />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="116"
        height="116"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#32a852"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <h4 className={styles.subtitle} style={{ textAlign: "center" }}>
        Reservation created successfully
      </h4>
      <p className={styles.paragraph}>Reservation ID:</p>
      <p className={styles.paragraph}>
        An email was sent to email, with the reservation confirmation
      </p>
      <button
        className={styles.submitButton}
        onClick={() => {
          setIsOpen(false);
          setIndex(0);
        }}
      >
        Close
      </button>
    </div>
  );
}

ReservationConfirmation.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  setIndex: PropTypes.func.isRequired,
};

import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function ChangeReservationsDatesForm({ setIndex }) {
  return (
    <form className={styles.form}>
      <h5 className={styles.subtitle}>Change Reservation Dates</h5>
      <div className={styles.formGroup}>
        <label>
          Check-in
          <input type="date" name="check_in" required aria-required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Check-out
          <input type="date" name="check_out" required aria-required />
        </label>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton} onClick={() => setIndex(1)}>
          Cancel
        </button>
        <button className={styles.submitButton}>Submit</button>
      </div>
    </form>
  );
}

ChangeReservationsDatesForm.propTypes = {
  setIndex: PropTypes.func.isRequired,
};

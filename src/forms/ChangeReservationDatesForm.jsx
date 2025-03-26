import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function ChangeReservationsDatesForm({ setIsOpen }) {
  return (
    <form className={styles.form}>
      <div className={styles.groupContainer}>
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
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
        <button className={styles.submitButton}>Submit</button>
      </div>
    </form>
  );
}

ChangeReservationsDatesForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

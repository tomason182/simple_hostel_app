import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function ReservationPoliciesForm({ closeModal }) {
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Minimum Advance Booking (in days):
          <input
            className={styles.inputSmall}
            type="number"
            name="min_advance_booking"
            min={0}
            required
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Minimum length of stay (in nights):
          <input
            className={styles.inputSmall}
            type="number"
            name="min_length_stay"
            min={1}
            required
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Maximum length of stay (in nights):
          <input
            className={styles.inputSmall}
            type="number"
            name="max_length_stay"
            min={1}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Allow same-day reservations?
          <select name="same_day_reservation" className={styles.inputSmall}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Check-in time window</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            From:
            <input
              className={styles.inputSmall}
              type="time"
              name="check_in_from"
              required
            />
          </label>
          <label className={styles.labelFlex}>
            To:
            <input
              className={styles.inputSmall}
              type="time"
              name="check_out_from"
              required
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Check-out time</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Until:
            <input
              className={styles.inputSmall}
              type="time"
              name="check_out_time"
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Payment methods accepted</legend>
        <div className={styles.groupContainer}>
          <div className={styles.checkbox}>
            <label>
              Cash
              <input type="checkbox" name="cash" />
            </label>
          </div>
          <div className={styles.checkbox}>
            <label>
              Debit card
              <input type="checkbox" name="debit" />
            </label>
          </div>
          <div className={styles.checkbox}>
            <label>
              Credit card
              <input type="checkbox" name="credit" />
            </label>
          </div>
          <div className={styles.checkbox}>
            <label>
              Bank transfer
              <input type="checkbox" name="transfer" />
            </label>
          </div>
          <div className={styles.checkbox}>
            <label>
              Paypal
              <input type="checkbox" name="paypal" />
            </label>
          </div>
        </div>
      </fieldset>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton} onClick={closeModal}>
          Cancel
        </button>
        <button className={styles.submitButton}>Submit</button>
      </div>
    </form>
  );
}

ReservationPoliciesForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

import styles from "./defaultFormStyle.module.css";

export default function ReservationPoliciesForm() {
  return (
    <form className={styles.form}>
      <h2>Reservation Policies</h2>
      <div className={styles.formGroup}>
        <label>
          Minimum Advance Booking (in days):
          <input type="number" name="min_advance_booking" min={0} required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Minimum length of stay (in nights):
          <input type="number" name="min_length_stay" min={1} required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Maximum length of stay (in nights):
          <input type="number" name="max_length_stay" min={1} />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Allow same-day reservations?
          <select name="same_day_reservation">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Check-in time window</legend>
        <div className={styles.formGroup}>
          <label>
            from:
            <input type="time" name="check_in_from" required />
          </label>
          <label>
            to:
            <input type="time" name="check_out_from" required />
          </label>
        </div>
      </fieldset>

      <div className={styles.formGroup}>
        <label>
          Check-out time:
          <input type="time" name="check_out_time" required />
        </label>
      </div>
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
        </div>
      </fieldset>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton}>Cancel</button>
        <button className={styles.submitButton}>Submit</button>
      </div>
    </form>
  );
}

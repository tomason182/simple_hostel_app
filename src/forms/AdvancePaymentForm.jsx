import { useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function AdvancePaymentForm({ closeModal }) {
  const [requiredDeposit, setRequiredDeposit] = useState(true);

  const percent = [
    0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5,
    10,
  ];
  const amount = percent.map(i => <option key={i}>{i * 10}%</option>);

  return (
    <form className={styles.form}>
      <fieldset>
        <legend>Payment method accepted in the property</legend>
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
      <fieldset>
        <legend>Advance payment Policies</legend>
        <div className={styles.formGroup}>
          <label>
            Do you required advance payment for a reservation?
            <select
              name="advance_payment"
              onChange={() => setRequiredDeposit(!requiredDeposit)}
              value={requiredDeposit}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            Amount in percent of the deposit?
            <select name="amount" disabled={!requiredDeposit}>
              {amount}
            </select>
          </label>
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

AdvancePaymentForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

import { useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function AdvancePaymentAndCancellationForm({ closeModal }) {
  const [requiredDeposit, setRequiredDeposit] = useState(true);

  const percent = [
    0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5,
    10,
  ];
  const amount = percent.map(i => <option key={i}>{i * 10}%</option>);

  return (
    <form className={styles.form}>
      <fieldset>
        <legend>Advance Payment</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Do you required advance payment for a reservation?
            <select
              className={styles.inputSmall}
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
          <label className={styles.labelFlex}>
            Amount in percent of the deposit?
            <select
              className={styles.inputSmall}
              name="amount"
              disabled={!requiredDeposit}
            >
              {amount}
            </select>
          </label>
        </div>

        <h4 className={styles.subtitle}>
          Which payment methods do you accept for deposits?
        </h4>
        <div className={styles.groupContainer}>
          <div className={styles.checkbox}>
            <label>
              Cash
              <input type="checkbox" name="cash" />
            </label>
          </div>
          <div className={styles.checkbox}>
            <label>
              Debit | Credit card
              <input type="checkbox" name="card_payment" />
            </label>
          </div>
          <div className={styles.checkbox}>
            <label>
              Bank transfer
              <input type="checkbox" name="bank_transfer" />
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
      <fieldset>
        <legend>Cancellation Policies</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Do you allow cancellation?
            <select className={styles.inputSmall} name="cancellation">
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Cancellation Type:
            <select name="type" className={styles.inputSmall}>
              <option value="flexible">Flexible</option>
              <option value="strict">Strict</option>
            </select>
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Day before arrival for cancel
            <input
              className={styles.inputSmall}
              type="number"
              name="cancellation_notice_period"
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Amount of the deposit refunded
            <select className={styles.inputSmall} name="amount_refunded">
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

AdvancePaymentAndCancellationForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

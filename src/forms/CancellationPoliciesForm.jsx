import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function CancellationPoliciesForm({ closeModal }) {
  const percent = [
    0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5,
    10,
  ];

  const amountRefunded = percent.map(i => <option key={i}>{i * 10}%</option>);
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label>
          Do you allow cancellation?
          <select name="cancellation">
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Day before arrival for cancel
          <input type="number" />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Amount of the deposit refunded
          <select name="amount_refunded">{amountRefunded}</select>
        </label>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton} onClick={closeModal}>
          Cancel
        </button>
        <button className={styles.submitButton}>Submit</button>
      </div>
    </form>
  );
}

CancellationPoliciesForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

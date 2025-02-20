import { useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function AdvancePaymentAndCancellationForm({
  closeModal,
  advancePaymentData,
  cancellationData,
}) {
  const [formData, setFormData] = useState({
    advance_payment: {
      required: advancePaymentData?.required || false,
      amount: advancePaymentData?.amount || 0,
    },
    cancellation: {
      type: cancellationData?.type || "",
      cancellation_notice_period:
        cancellationData?.cancellation_notice_period || 0,
      amount_refunded: cancellationData?.amount_refunded || 0,
    },
  });

  console.log(formData);

  const percent = [
    0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7,
    0.75, 0.8, 0.85, 0.9, 0.95, 1,
  ];

  const amount = percent.map(i => (
    <option key={i} value={i}>
      {Math.round(i * 100)}%
    </option>
  ));

  function handleInputChange(e) {
    const { name, value } = e.target;
    if (name === "required" || name === "amount") {
      setFormData(prev => ({
        ...prev,
        advance_payment: {
          ...prev.advance_payment,
          [name]: value,
        },
      }));
    } else if (
      name === "type" ||
      name === "cancellation_notice_period" ||
      name === "amount_refunded"
    ) {
      setFormData(prev => ({
        ...prev,
        cancellation: {
          ...prev.cancellation,
          [name]: value,
        },
      }));
    }
  }

  return (
    <form className={styles.form}>
      <fieldset>
        <legend>Advance Payment</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Do you required advance payment for a reservation?
            <select
              className={styles.inputSmall}
              name="required"
              value={formData.required}
              onChange={e => handleInputChange(e)}
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
              value={formData.advance_payment.amount}
              onChange={e => handleInputChange(e)}
            >
              {amount}
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Cancellation Policies</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Cancellation Type:
            <select
              name="type"
              className={styles.inputSmall}
              value={formData.cancellation.type}
              onChange={e => handleInputChange(e)}
            >
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
              value={formData.cancellation.cancellation_notice_period}
              onChange={e => handleInputChange(e)}
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Amount of the deposit refunded
            <select
              className={styles.inputSmall}
              name="amount_refunded"
              value={formData.cancellation.amount_refunded}
              onChange={e => handleInputChange(e)}
            >
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

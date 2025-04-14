import { useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function AdvancePaymentPolicyForm({
  advancePaymentData,
  closeModal,
  refreshPropertyPolicies,
}) {
  const [formData, setFormData] = useState({
    advance_payment_required: advancePaymentData.required || false,
    deposit_amount: parseFloat(advancePaymentData.deposit_amount) || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  function handleFormChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const body = {
      advance_payment_required: formData.advance_payment_required,
      deposit_amount: parseFloat(formData.deposit_amount),
    };

    const url =
      import.meta.env.VITE_URL_BASE +
      "/properties/policies/advance-payment-policies";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    };

    setLoading(true);
    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error");
        }
      })
      .then(() => {
        closeModal();
        refreshPropertyPolicies();
        alert("Advance Payment updated successfully");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const percent = [
    0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7,
    0.75, 0.8, 0.85, 0.9, 0.95, 1,
  ];

  const amount = percent.map(i => (
    <option key={i} value={i}>
      {Math.round(i * 100)}%
    </option>
  ));
  return (
    <form className={styles.form} onSubmit={handleFormSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          {t("pay_in_advance_message")}
          <select
            name="advance_payment_required"
            id="advance_payment_required"
            className={styles.inputSmall}
            onChange={handleFormChange}
            value={formData.advance_payment_required}
          >
            <option value={false}>No</option>
            <option value={true}>{t("yes")}</option>
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          {t("deposit_amount")}
          <select
            name="deposit_amount"
            id="deposit_amount"
            className={styles.inputSmall}
            onChange={handleFormChange}
            value={formData.deposit_amount}
          >
            {amount}
          </select>
        </label>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          type="button"
          onClick={() => closeModal()}
        >
          {t("cancel")}
        </button>
        <button className={styles.submitButton} disabled={loading}>
          {t("save")}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

AdvancePaymentPolicyForm.propTypes = {
  advancePaymentData: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  refreshPropertyPolicies: PropTypes.func.isRequired,
};

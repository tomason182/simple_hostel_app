import { useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function ReservationPoliciesForm({
  closeModal,
  reservationPoliciesData,
  refreshPropertyPolicies,
}) {
  const [formData, setFormData] = useState({
    min_advance_booking: reservationPoliciesData?.min_advance_booking || 1,
    min_length_stay: reservationPoliciesData?.min_length_stay || 1,
    max_length_stay: reservationPoliciesData?.max_length_stay || 0,
    check_in_from: reservationPoliciesData?.check_in_from || "14:00",
    check_in_to: reservationPoliciesData?.check_in_to || "21:00",
    check_out_until: reservationPoliciesData?.check_out_until || "11:00",
    payment_methods_accepted:
      reservationPoliciesData?.payment_methods_accepted || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t } = useTranslation();

  const availablePaymentMethods = [
    { id: "debit_credit", label: t("debit_credit") },
    { id: "cash", label: t("cash") },
    { id: "bank_transfer", label: t("bank_transfer") },
    { id: "bitcoin", label: "Bitcoin" },
  ];

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePaymentMethodsChange(e) {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        payment_methods_accepted: [...prev.payment_methods_accepted, value],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        payment_methods_accepted: prev.payment_methods_accepted.filter(
          method => method !== value
        ),
      }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const url =
      import.meta.env.VITE_URL_BASE +
      "/properties/policies/reservations-policies";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    };

    setLoading(true);
    fetch(url, options)
      .then(async response => {
        if (response.status >= 400) {
          const error = await response.json();
          console.error(error);
          throw new Error("Server Error");
        }
        return response.json();
      })
      .then(() => {
        refreshPropertyPolicies();
        closeModal();
        alert("Reservation policies updated successfully");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          {t("min_length_of_stay")} ({t("in_nights")}):
          <input
            className={styles.inputSmall}
            type="number"
            name="min_length_stay"
            value={formData.min_length_stay}
            onChange={e => handleInputChange(e)}
            min={1}
            required
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          {t("max_length_of_stay")} ({t("in_nights")}):
          <input
            className={styles.inputSmall}
            type="number"
            name="max_length_stay"
            value={formData.max_length_stay}
            onChange={e => handleInputChange(e)}
            required
            min={0}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          {t("min_advance_booking")} ({t("in_days")}):
          <input
            className={styles.inputSmall}
            type="number"
            name="min_advance_booking"
            value={formData.min_advance_booking}
            onChange={e => handleInputChange(e)}
            min={0}
            required
          />
        </label>
      </div>
      <fieldset>
        <legend>{t("check_in")}</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            {t("from")}:
            <input
              className={styles.inputMedium}
              type="time"
              name="check_in_from"
              value={formData.check_in_from}
              onChange={e => handleInputChange(e)}
              required
            />
          </label>
          <br />
          <label className={styles.labelFlex}>
            {t("until")}:
            <input
              className={styles.inputMedium}
              type="time"
              name="check_in_to"
              value={formData.check_in_to}
              onChange={e => handleInputChange(e)}
              required
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>{t("check_out")}</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            {t("until")}:
            <input
              className={styles.inputMedium}
              type="time"
              name="check_out_until"
              value={formData.check_out_until}
              onChange={e => handleInputChange(e)}
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t("payment_methods")}</legend>
        <div className={styles.groupContainer}>
          {availablePaymentMethods.map(method => (
            <div key={method.id}>
              <label>
                {method.label}
                <input
                  type="checkbox"
                  name={method.id}
                  value={method.id}
                  checked={formData.payment_methods_accepted.includes(
                    method.id
                  )}
                  onChange={e => handlePaymentMethodsChange(e)}
                />
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton} onClick={closeModal}>
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

ReservationPoliciesForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  reservationPoliciesData: PropTypes.shape({
    min_advance_booking: PropTypes.number,
    min_length_stay: PropTypes.number,
    max_length_stay: PropTypes.number,
    check_in_from: PropTypes.string,
    check_in_to: PropTypes.string,
    check_out_until: PropTypes.string,
    payment_methods_accepted: PropTypes.arrayOf(
      PropTypes.oneOf(["cash", "debit_credit", "bank_transfer"])
    ),
  }).isRequired,
  refreshPropertyPolicies: PropTypes.func.isRequired,
};

import { useEffect, useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function ReservationPoliciesForm({
  closeModal,
  reservationPoliciesData,
}) {
  const [formData, setFormData] = useState({
    min_advance_booking: reservationPoliciesData?.min_advance_booking || "",
    min_length_stay: reservationPoliciesData?.min_length_stay || "",
    max_length_stay: reservationPoliciesData?.max_length_stay || "",
    allow_same_day_reservation:
      reservationPoliciesData?.allow_same_day_reservation || false,
    check_in_from: reservationPoliciesData?.check_in_window.from || "",
    check_in_to: reservationPoliciesData?.check_in_window.to || "",
    check_out_until: reservationPoliciesData?.check_out_time.until || "",
    payment_methods: reservationPoliciesData?.payment_methods || [],
    online_payment_methods:
      reservationPoliciesData?.online_payment_methods || [],
  });

  console.log(formData);
  const availablePaymentMethods = [
    { id: "credit_debit_card", label: "Credit or Debit Card" },
    { id: "cash", label: "cash" },
    { id: "bank_transfer", label: "Bank Transfer" },
  ];
  const availableOnlinePaymentMethods = [
    { id: "paypal", label: "paypal" },
    { id: "mercado_pago", label: "Mercado Pago" },
    { id: "bitcoin", label: "bitcoin" },
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
        payment_methods: [...prev.payment_methods, value],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        payment_methods: prev.payment_methods.filter(
          method => method !== value
        ),
      }));
    }
  }

  function handleOnlinePaymentMethodsChange(e) {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({
        ...prev,
        online_payment_methods: [...prev.online_payment_methods, value],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        online_payment_methods: prev.online_payment_methods.filter(
          method => method !== value
        ),
      }));
    }
  }

  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Minimum length of stay (in nights):
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
          Maximum length of stay (in nights):
          <input
            className={styles.inputSmall}
            type="number"
            name="max_length_stay"
            value={formData.max_length_stay}
            onChange={e => handleInputChange(e)}
            min={1}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Minimum Advance Booking (in days):
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
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Allow same-day reservations?
          <select
            name="allow_same_day_reservation"
            value={formData.allow_same_day_reservation}
            onChange={e => handleInputChange(e)}
            className={styles.inputSmall}
          >
            <option name="yes" value={true}>
              Yes
            </option>
            <option name="no" value={false}>
              No
            </option>
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Check-in time window</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            From:
            <input
              className={styles.inputMedium}
              type="time"
              name="check_in_from"
              value={formData.check_in_from}
              onChange={e => handleInputChange(e)}
              required
            />
          </label>
          <label className={styles.labelFlex}>
            To:
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
        <legend>Check-out time</legend>
        <div className={styles.formGroup}>
          <label className={styles.labelFlex}>
            Until:
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
        <legend>Payment methods accepted</legend>
        <div className={styles.groupContainer}>
          {availablePaymentMethods.map(method => (
            <div key={method.id}>
              <label>
                {method.label}
                <input
                  type="checkbox"
                  name={method.id}
                  value={method.id}
                  checked={formData.payment_methods.includes(method.id)}
                  onChange={e => handlePaymentMethodsChange(e)}
                />
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Online Payment methods accepted</legend>
        <div className={styles.groupContainer}>
          {availableOnlinePaymentMethods.map(method => (
            <div key={method.id}>
              <label>
                {method.label}
                <input
                  type="checkbox"
                  name={method.id}
                  value={method.id}
                  checked={formData.online_payment_methods.includes(method.id)}
                  onChange={e => handleOnlinePaymentMethodsChange(e)}
                />
              </label>
            </div>
          ))}
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

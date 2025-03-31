import styles from "./defaultFormStyle.module.css";
import countryCodes from "../utils/country_code.json";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function GuestInformationForm({
  setReservationFormData,
  formData,
  setIndex,
}) {
  const { t } = useTranslation();

  function handleChange(e) {
    const { name, value } = e.target;
    setReservationFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIndex(3);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4 className={styles.subtitle}>Reservation information</h4>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("booking_source")} <span className={styles.required}>*</span>
            <select
              name="bookingSource"
              id="bookingSource"
              onChange={handleChange}
              value={formData.bookingSource}
              required
              aria-required
            >
              <option value="">{t("select_one")}</option>
              <option value="direct">{t("direct_booking")}</option>
              <option value="booking.com">Booking.com</option>
              <option value="hostelWorld.com">HostelWorld.com</option>
              <option value="website">Website</option>
            </select>
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("payment_status")} <span className={styles.required}>*</span>
            <select
              name="paymentStatus"
              id="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              required
              aria-required
            >
              <option value="">{t("select_one")}</option>
              <option value="pending">{t("pending")}</option>
              <option value="canceled">{t("canceled")}</option>
              <option value="refunded">{t("refunded")}</option>
              <option value="paid">{t("paid")}</option>
              <option value="partial">{t("partial")}</option>
            </select>
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            Reservation Status <span className={styles.required}>*</span>
            <select
              name="reservationStatus"
              id="reservationStatus"
              onChange={handleChange}
              value={formData.reservationStatus}
              required
              aria-required
            >
              <option value="">{t("select_one")}</option>
              <option value="confirmed">{t("confirmed")}</option>
              <option value="provisional">{t("provisional")}</option>
              <option value="canceled">{t("canceled")}</option>
              <option value="no-show">No-show</option>
            </select>
          </label>
        </div>
      </div>
      <h4 className={styles.subtitle}>{t("guest_information")}</h4>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("first_name")} <span className={styles.required}>*</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              aria-required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("last_name")} <span className={styles.required}>*</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              aria-required
            />
          </label>
        </div>
      </div>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup} style={{ flex: "1" }}>
          <label>
            Email <span className={styles.required}>*</span>
            <input
              type="email"
              name="email"
              required
              aria-required
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>
        <div
          className={styles.formGroup}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "0.8rem",
          }}
        >
          <div className={styles.formGroup} style={{ flex: "1" }}>
            <label>
              {t("phone_code")}
              <select
                name="phoneCode"
                id="phoneCode"
                value={formData.phoneCode}
                onChange={handleChange}
              >
                {countryCodes.map(c => (
                  <option key={c.value} value={c.code}>
                    {c.code} - {c.label}{" "}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.formGroup} style={{ flex: "2" }}>
            <label>
              {t("phone_number")}
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("country")}
            <select
              name="countryCode"
              id="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
            >
              {countryCodes.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("city")}
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("postal_code")}
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.formGroup}>
          <label>
            {t("street")}
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>
          {t("special_request")}
          <textarea
            name="specialRequest"
            id="specialRequest"
            value={formData.specialRequest}
            onChange={handleChange}
          ></textarea>
        </label>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          type="button"
          onClick={() => setIndex(1)}
        >
          {t("back")}
        </button>
        <button className={styles.submitButton} type="submit">
          {t("continue")}
        </button>
      </div>
    </form>
  );
}

GuestInformationForm.propTypes = {
  setReservationFormData: PropTypes.func.isRequired,
  setIndex: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
};

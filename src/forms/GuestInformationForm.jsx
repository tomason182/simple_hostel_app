import styles from "./defaultFormStyle.module.css";
import countryCodes from "../utils/country_code.json";
import PropTypes from "prop-types";

export default function GuestInformationForm({
  setReservationFormData,
  formData,
  setIndex,
}) {
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
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h4 className={styles.subtitle}>Reservation information</h4>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              Booking Source
              <select
                name="bookingSource"
                id="bookingSource"
                onChange={handleChange}
              >
                <option value="direct">Direct booking</option>
                <option value="booking.com">Booking.com</option>
                <option value="hostelworld.com">Hostelworld.com</option>
                <option value="website">Website</option>
              </select>
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Payment status
              <select
                name="paymentStatus"
                id="paymentStatus"
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="canceled">Canceled</option>
                <option value="refunded">Refunded</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
              </select>
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Reservation Status
              <select
                name="reservationStatus"
                id="reservationStatus"
                onChange={handleChange}
              >
                <option value="confirmed">Confirmed</option>
                <option value="provisional">Provisional</option>
                <option value="canceled">Canceled</option>
                <option value="no-show">No-show</option>
              </select>
            </label>
          </div>
        </div>
        <h4 className={styles.subtitle}>Guest Information</h4>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              First name
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
              Last name
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
              Email
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
                Phone code
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
                Phone number
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
              Country
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
              City
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
              Postal code
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
              Street
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
            Special request
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
            Back
          </button>
          <button className={styles.submitButton} type="submit">
            Continue
          </button>
        </div>
      </form>
    </>
  );
}

GuestInformationForm.propTypes = {
  setReservationFormData: PropTypes.func.isRequired,
  setIndex: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
};

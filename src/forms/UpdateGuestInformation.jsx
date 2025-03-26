import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import countryCodes from "../utils/country_code.json";

export default function UpdateGuestInformation({ setIsOpen }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "",
    phoneNumber: "",
    countryCode: "",
    city: "",
    postalCode: "",
    street: "",
  });

  {
    function handleChange() {
      console.log("change");
    }
    return (
      <form>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              First name <span className={styles.required}>*</span>
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
              Last name <span className={styles.required}>*</span>
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
        <div className={styles.buttonGroup}>
          <button
            className={styles.cancelButton}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button className={styles.submitButton}>Submit</button>
        </div>
      </form>
    );
  }
}

UpdateGuestInformation.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

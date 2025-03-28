import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import countryCode from "../utils/country_code.json";

export default function ContactInfoForm({
  contactInfoData,
  setIsOpen,
  refreshPropertyData,
}) {
  const [formData, setFormData] = useState({
    email: contactInfoData?.email || "",
    countryCode: contactInfoData?.country_code || "",
    phoneNumber: contactInfoData?.phone_number || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFormChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const url =
      import.meta.env.VITE_URL_BASE + "/properties/update/contact-info";
    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error. Try again");
        }
        return response.json();
      })
      .then(() => {
        alert("Contact info updated successfully");
        refreshPropertyData();
        setIsOpen(false);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const codes = countryCode.map(code => (
    <option key={code.value} value={code.code}>
      {code.code} ({code.label})
    </option>
  ));

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            required
            aria-required
          />
        </label>
      </div>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup} style={{ flex: "1" }}>
          <label>Code</label>
          <select
            name="countryCode"
            id="countryCode"
            value={formData.countryCode}
            onChange={handleFormChange}
          >
            {codes}
          </select>
        </div>
        <div className={styles.formGroup} style={{ flex: "2" }}>
          <label>
            Phone number
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleFormChange}
              required
              aria-required
            />
          </label>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          type="button"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
        <button className={styles.submitButton} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

ContactInfoForm.propTypes = {
  contactInfoData: PropTypes.object.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  refreshPropertyData: PropTypes.func.isRequired,
};

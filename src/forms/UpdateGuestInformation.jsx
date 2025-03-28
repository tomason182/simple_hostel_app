import styles from "./defaultFormStyle.module.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import countryCodes from "../utils/country_code.json";

export default function UpdateGuestInformation({
  setIsOpen,
  guestData,
  refreshData,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    idNumber: "",
    phoneNumber: "",
    countryCode: "",
    city: "",
    postalCode: "",
    street: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(formData);

  useEffect(() => {
    setFormData({
      firstName: guestData.first_name || "",
      lastName: guestData.last_name || "",
      email: guestData.contact_info.email || "",
      idNumber: guestData.id_number || "",
      phoneNumber: guestData.contact_info.phone_number || "",
      countryCode: guestData.address.country_code || "",
      city: guestData.address.city || "",
      postalCode: guestData.address.postal_code || "",
      street: guestData.address.street || "",
    });
  }, [guestData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault(e);

    const formBody = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    if (formData.idNumber !== "") {
      formBody.idNumber = formData.idNumber;
    }

    if (formData.phoneNumber !== "") {
      formBody.phoneNumber = formData.phoneNumber;
    }

    if (formData.city !== "") {
      formBody.city = formData.city;
    }

    if (formData.street !== "") {
      formBody.street = formData.street;
    }

    if (formData.postalCode !== "") {
      formBody.postalCode = formData.postalCode;
    }

    if (formData.countryCode !== "") {
      formBody.countryCode = formData.countryCode;
    }

    setError(null);
    setLoading(true);

    const id = guestData.id;

    const url = import.meta.env.VITE_URL_BASE + "/guests/update/" + id;
    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formBody),
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Unable to update guest info. Server Error");
        }

        return response.json();
      })
      .then(data => {
        if (data.status === "error") {
          setError(data.msg);
          return;
        }
        alert("Guest updated successfully");
        setIsOpen(false);
        refreshData();
      })
      .catch(e => {
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <div className={styles.formGroup}>
        <label>
          ID or Passport number
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
          />
        </label>
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
        <div className={styles.formGroup}>
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
        <button className={styles.submitButton} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

UpdateGuestInformation.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  guestData: PropTypes.object.isRequired,
  refreshData: PropTypes.func.isRequired,
};

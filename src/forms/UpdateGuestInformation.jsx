import styles from "./defaultFormStyle.module.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import countryCodes from "../utils/country_code.json";

import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

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

  const { t } = useTranslation();
  const { addToast } = useToast();

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
          throw new Error("UNEXPECTED_ERROR");
        }

        return response.json();
      })
      .then(data => {
        if (data.status === "error") {
          setError(data.msg);
          return;
        }
        addToast({
          message: t("GUEST_UPDATE_SUCCESS", { ns: "validation" }),
          type: "success",
        });
        setIsOpen(false);
        refreshData();
      })
      .catch(e => {
        setError(t(e.message, { ns: "validation" }));
      })
      .finally(() => setLoading(false));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <div className={styles.formGroup}>
        <label>
          {t("id_passport_number")}
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
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          onClick={() => setIsOpen(false)}
        >
          {t("cancel")}
        </button>
        <button className={styles.submitButton} disabled={loading}>
          {loading ? "Loading..." : t("save")}
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

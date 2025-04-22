import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import countryCode from "../utils/country_code.json";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

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

  const { t } = useTranslation();
  const { addToast } = useToast();

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
          throw new Error("UNEXPECTED_ERROR");
        }
        return response.json();
      })
      .then(() => {
        addToast({ message: t("CONTACT_INFO_UPDATE"), type: "success" });
        refreshPropertyData();
        setIsOpen(false);
      })
      .catch(e => setError(t(e.message, { ns: "validation" })))
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
          <label>{t("phone_code")}</label>
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
            {t("phone_number")}
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

ContactInfoForm.propTypes = {
  contactInfoData: PropTypes.object.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  refreshPropertyData: PropTypes.func.isRequired,
};

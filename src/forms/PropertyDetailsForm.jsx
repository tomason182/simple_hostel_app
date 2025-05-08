import { useEffect, useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import Spinner from "../components/Spinner/Spinner";
import ToolTip from "../components/ToolTip/ToolTip";

import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

export default function ProperTyDetailsForm({
  setIsOpen,
  propertyDetailsData,
  refreshPropertyData,
}) {
  const [formData, setFormData] = useState({
    alpha_2_code: "",
    city: "",
    street: "",
    postal_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t } = useTranslation();
  const { addToast } = useToast();

  useEffect(() => {
    setFormData({
      alpha_2_code: propertyDetailsData?.alpha_2_code || "",
      city: propertyDetailsData?.city || "",
      postal_code: propertyDetailsData?.postal_code || "",
      street: propertyDetailsData?.street || "",
    });
  }, [propertyDetailsData]);

  function handleFormChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault(e);

    const url =
      import.meta.env.VITE_URL_BASE + "/properties/update/property-info";
    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    };
    setLoading(true);
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
        throw new Error(
          error.msg || t("UNEXPECTED_ERROR", { ns: "validation" })
        );
      }
      addToast({
        message: t("PROPERTY_UPDATE_SUCCESS", { ns: "validation" }),
        type: "success",
      });
      setIsOpen(false);
      refreshPropertyData();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const alpha2Codes = countries.map(country => (
    <option key={country.value} value={country.value}>
      {country.label}
    </option>
  ));

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset>
        <legend>{t("address")}</legend>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              {t("country")}
              <select
                name="alpha_2_code"
                id="alpha_2_code"
                value={formData.alpha_2_code}
                onChange={handleFormChange}
                required
                aria-required
              >
                {alpha2Codes}
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
                onChange={handleFormChange}
              />
            </label>
          </div>
        </div>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              {t("street")}
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleFormChange}
                required
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              {t("postal_code")}
              <input
                type="text"
                name="postal_code"
                required
                value={formData.postal_code}
                onChange={handleFormChange}
              />
            </label>
          </div>
        </div>
      </fieldset>
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

ProperTyDetailsForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  propertyDetailsData: PropTypes.object.isRequired,
  refreshPropertyData: PropTypes.func.isRequired,
};

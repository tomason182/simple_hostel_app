import styles from "./defaultFormStyle.module.css";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useState } from "react";
import Spinner from "../components/Spinner/Spinner";

export default function LocationForm({
  locationData,
  setLocationData,
  setIsOpen,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFormChange(e) {
    const { name, value } = e.target;

    setLocationData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const url = `${import.meta.env.VITE_URL_BASE}/properties/update/location`;
    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(locationData),
    };

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.json();
        console.error(error);
        throw new Error(error.msg || "UNEXPECTED_ERROR");
      }

      alert("Property location updated");
      setIsOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />;
  return (
    <form className={styles.form} onSubmit={handleFormSubmit}>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("latitude")}
            <input
              type="number"
              defaultValue={locationData.lat}
              disabled
              required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("longitude")}
            <input
              type="number"
              defaultValue={locationData.lon}
              disabled
              required
            />
          </label>
        </div>
      </div>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("country")}
            <input
              type="text"
              name="country"
              defaultValue={locationData.country}
              disabled
              required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("state")}
            <input
              type="text"
              name="state"
              defaultValue={locationData.state}
              disabled
              required
            />
          </label>
        </div>
      </div>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("city")}
            <input
              type="text"
              name="city"
              defaultValue={locationData.city}
              disabled
              required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("postal_code")}
            <input
              type="number"
              name="postal_code"
              value={locationData.postal_code}
              onChange={handleFormChange}
              required
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
              value={locationData.street}
              onChange={handleFormChange}
              required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("house_number")}
            <input
              type="number"
              name="house_number"
              value={locationData.house_number}
              onChange={handleFormChange}
              required
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
        <button className={styles.submitButton}>{t("save")}</button>
      </div>
      {error && (
        <p className={styles.error}>{t(error, { ns: "validation" })}</p>
      )}
    </form>
  );
}

LocationForm.propTypes = {
  locationData: PropTypes.object.isRequired,
  setLocationData: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

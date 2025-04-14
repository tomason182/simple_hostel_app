import { useEffect, useState } from "react";
import styles from "./defaultFormStyle.module.css";
import countries from "../utils/country_code.json";
import PropTypes from "prop-types";
import Spinner from "../components/Spinner/Spinner";

import { useTranslation } from "react-i18next";

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
    base_currency: "USD",
    payment_currency: "USD",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [currenciesError, setCurrenciesError] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      alpha_2_code: propertyDetailsData?.alpha_2_code || "",
      city: propertyDetailsData?.city || "",
      postal_code: propertyDetailsData?.postal_code || "",
      street: propertyDetailsData?.street || "",
      payment_currency: propertyDetailsData.payment_currency || "USD",
      base_currency: propertyDetailsData.base_currency || "USD",
    });
  }, [propertyDetailsData]);

  useEffect(() => {
    function getCurrenciesList() {
      setLoadingCurrencies(true);
      const url =
        "https://v6.exchangerate-api.com/v6/fc8cf1125e87c2bd53fd6997/codes";
      const options = {
        mode: "cors",
        method: "GET",
        header: {
          "Content-Type": "application/json",
        },
      };

      fetch(url, options)
        .then(response => {
          if (response.status >= 400) {
            throw new Error("Exchange API error");
          }

          return response.json();
        })
        .then(data => {
          setCurrencies(data.supported_codes);
        })
        .catch(e => setCurrenciesError(e.message || "Server Error"))
        .finally(() => setLoadingCurrencies(false));
    }

    getCurrenciesList();
  }, []);

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
        throw new Error(error.msg || "Server Error");
      }

      alert("Property Info updated successfully");
      setIsOpen(false);
      refreshPropertyData();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }

    console.log(formData);
  }

  const currenciesList = currencies.map(currency => (
    <option key={currency[0]} value={currency[0]}>
      {currency[0]}&nbsp;({currency[1]})
    </option>
  ));

  const alpha2Codes = countries.map(country => (
    <option key={country.value} value={country.value}>
      {country.label}
    </option>
  ));

  if (loadingCurrencies)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (currenciesError) return <div>Error Loading currencies list</div>;

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
      <fieldset>
        <legend>{t("currencies")}</legend>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              {t("base_currency")}
              <select
                name="base_currency"
                id="base_currency"
                value={formData.base_currency}
                onChange={handleFormChange}
              >
                {currenciesList}
              </select>
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              {t("payment_currency")}
              <select
                name="payment_currency"
                id="payment_currency"
                value={formData.payment_currency}
                onChange={handleFormChange}
              >
                {currenciesList}
              </select>
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

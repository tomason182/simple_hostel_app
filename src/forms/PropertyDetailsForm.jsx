import { useEffect, useState } from "react";
import styles from "./defaultFormStyle.module.css";
import countries from "../utils/country_code.json";
import PropTypes from "prop-types";
import Spinner from "../components/Spinner/Spinner";

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
  const [cities, setCities] = useState([]);
  // Insert custom city to list if not exists
  const isCityInList = cities.some(city => city.city === formData.city);
  const [isCustomCity, setIsCustomCity] = useState(!isCityInList);

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
    async function getCitiesList() {
      // Reset cities when new country is selected
      setCities([
        {
          id: "",
          city: "Select a city",
        },
      ]);

      if (formData.alpha_2_code === "") return;

      const alpha_2_code = formData.alpha_2_code;
      const url =
        import.meta.env.VITE_URL_BASE + "/data-provider/cities/" + alpha_2_code;
      const options = {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error("Network Error");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setCities([{ id: "", city: "Select a city" }, ...data]);
        }
      } catch (e) {
        console.error("Error fetching cities data", e.message);
      }
    }

    getCitiesList();
  }, [formData.alpha_2_code]);

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

  function handleCityChange(e) {
    const selectedCity = e.target.value;

    if (selectedCity === "other") {
      setIsCustomCity(true);
      setFormData(prev => ({ ...prev, city: "" }));
    } else {
      setIsCustomCity(false);
      setFormData(prev => ({ ...prev, city: selectedCity }));
    }
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
        <legend>Address</legend>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              Country
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
              City
              <select
                name="city"
                id="city"
                value={formData.city}
                onChange={handleCityChange}
              >
                {cities.map(city => (
                  <option key={city.id} value={city.city}>
                    {city.city}
                  </option>
                ))}
                <option value="other">Other...</option>
              </select>
            </label>
            {isCustomCity && (
              <input
                type="text"
                name="custom_city"
                placeholder="Enter city name"
                value={formData.city}
                onChange={e =>
                  setFormData(prev => ({ ...prev, city: e.target.value }))
                }
              />
            )}
          </div>
        </div>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              Street
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
              Postal code
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
        <legend>Currencies</legend>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              Base currency
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
              Payment currency
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

ProperTyDetailsForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  propertyDetailsData: PropTypes.object.isRequired,
  refreshPropertyData: PropTypes.func.isRequired,
};

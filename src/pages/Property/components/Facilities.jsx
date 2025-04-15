import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./Facilities.module.css";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [errorFacilities, setErrorFacilities] = useState(null);
  const { t, i18n } = useTranslation();
  const lng = i18n.resolvedLanguage;

  const [propertyFacilities, setPropertyFacilities] = useState([]);

  useEffect(() => {
    function fetchFacilities() {
      const url =
        import.meta.env.VITE_URL_BASE + "/data-provider/facilities/" + lng;
      const options = {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };
      setLoadingFacilities(true);
      setErrorFacilities(null);
      fetch(url, options)
        .then(response => {
          if (response.status >= 400) {
            throw new Error("Server Error");
          }
          return response.json();
        })
        .then(data => setFacilities(data))
        .catch(err => setErrorFacilities(err.message))
        .finally(() => setLoadingFacilities(false));
    }
    fetchFacilities();
  }, [lng]);

  function handleChange(e) {
    const { value } = e.target;

    const facilityValue = parseInt(value);

    if (propertyFacilities.includes(facilityValue)) {
      setPropertyFacilities(prev => prev.filter(f => f !== facilityValue));
    } else {
      setPropertyFacilities(prev => [...prev, facilityValue]);
    }
  }

  if (loadingFacilities) return <Spinner />;
  if (errorFacilities) return <div>{errorFacilities}</div>;

  const categories = [
    { name: "general", label: "General" },
    {
      name: "bathroom",
      label: t("bathroom"),
    },
    {
      name: "connectivity",
      label: t("connectivity"),
    },
    {
      name: "entertainment",
      label: t("entertainment"),
    },
    {
      name: "transportation",
      label: t("transportation"),
    },
    {
      name: "safety_security",
      label: t("safety_security"),
    },
    {
      name: "accessibility",
      label: t("accessibility"),
    },
    {
      name: "food_drinks",
      label: t("food_drinks"),
    },
  ];

  function renderLabels(category) {
    const filteredFacilities = facilities.filter(
      facility => facility.category === category
    );

    const facilitiesList = filteredFacilities.map(facility => (
      <label key={facility.id}>
        {facility.name}
        <input
          type="checkbox"
          name="facility"
          value={facility.facility_id}
          checked={propertyFacilities.includes(facility.facility_id)}
          onChange={handleChange}
        />
      </label>
    ));

    return facilitiesList;
  }

  return (
    <div className={styles.container}>
      <h1>{t("property_facilities")}</h1>
      <form className={styles.facilityForm}>
        <div className={styles.buttonContainer}>
          <button disabled={propertyFacilities.length === 0}>
            {t("save_changes")}
          </button>
        </div>

        {categories.map(category => (
          <fieldset key={category.name}>
            <legend>{category.label}</legend>
            {renderLabels(category.name)}
          </fieldset>
        ))}
      </form>
    </div>
  );
}

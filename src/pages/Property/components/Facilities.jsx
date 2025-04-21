import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./Facilities.module.css";

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingPropertyFacilities, setLoadingPropertyFacilities] =
    useState(true);
  const [errorFacilities, setErrorFacilities] = useState(null);
  const [errorPropertyFacilities, setErrorPropertyFacilities] = useState(null);
  const { t, i18n } = useTranslation();
  const lng = i18n.resolvedLanguage;

  const [propertyFacilities, setPropertyFacilities] = useState([]);

  const fetchPropertyFacilities = useCallback(() => {
    const url = import.meta.env.VITE_URL_BASE + "/properties/facilities";
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    setLoadingPropertyFacilities(true);
    setErrorPropertyFacilities(null);
    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Unable to fetch facilities");
        }
        return response.json();
      })
      .then(data => setPropertyFacilities(data.msg))
      .catch(e => setErrorPropertyFacilities(e.message))
      .finally(() => setLoadingPropertyFacilities(false));
  }, []);

  useEffect(() => {
    fetchPropertyFacilities();
  }, [fetchPropertyFacilities]);

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

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formBody = {
      facilities: propertyFacilities,
    };

    const url = import.meta.env.VITE_URL_BASE + "/properties/facilities";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formBody),
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Unable to save changes");
        }

        alert("Changes saved successfully");
      })
      .catch(err =>
        alert(`An error occurred, please try again. Error: ${err.message}`)
      )
      .finally(() => setLoading(false));
  }

  if (loadingFacilities || loadingPropertyFacilities) return <Spinner />;
  if (errorFacilities || errorPropertyFacilities)
    return <div>{errorFacilities}</div>;

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
        <span>{facility.name}</span>
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
      <form className={styles.facilityForm} onSubmit={handleSubmit}>
        <div className={styles.buttonContainer}>
          <button disabled={propertyFacilities.length === 0}>
            {loading ? t("loading") : t("save_changes")}
          </button>
        </div>
        <div className={styles.fieldContainer}>
          {categories.map(category => (
            <fieldset key={category.name}>
              <legend>{category.label}</legend>
              {renderLabels(category.name)}
            </fieldset>
          ))}
        </div>
      </form>
    </div>
  );
}

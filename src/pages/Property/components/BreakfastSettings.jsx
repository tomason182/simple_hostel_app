import { useEffect, useState } from "react";
import styles from "./BreakfastSettings.module.css";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/Spinner/Spinner";

export default function BreakfastSettings() {
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [errorSettings, setErrorSettings] = useState(null);
  const [currentSettings, setCurrentSettings] = useState({
    is_served: 0,
    is_included: 1,
    price: "",
  });
  const [breakfastSettings, setBreakfastSettings] = useState({
    is_served: 0,
    is_included: 1,
    price: "",
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);

  console.log(breakfastSettings);

  const { t } = useTranslation();

  useEffect(() => {
    fetchBreakfastSettings();
  }, []);

  async function fetchBreakfastSettings() {
    const url =
      import.meta.env.VITE_URL_BASE + "/breakfast-and-meals/breakfast";
    const options = {
      mode: "cors",
      method: "GET",
      credentials: "include",
    };

    try {
      setLoadingSettings(true);
      setErrorSettings(null);
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Unable to fetch breakfast settings");
      }

      const data = await response.json();
      setBreakfastSettings({
        ...data,
        is_included: data.is_included || 1,
      });
      setCurrentSettings({
        ...data,
        is_included: data.is_included || 1,
      });
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingSettings(false);
    }
  }

  async function handleBreakfastSettingsUpdate() {
    const body = {
      is_served: breakfastSettings.is_served,
      is_included: breakfastSettings.is_included,
      price: Number(breakfastSettings.price),
    };

    const url =
      import.meta.env.VITE_URL_BASE + "/breakfast-and-meals/breakfast";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    };
    try {
      setLoadingUpdate(true);
      setErrorUpdate(null);
      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Unable to update breakfast settings");
      }

      fetchBreakfastSettings();
    } catch (err) {
      console.error(err.message);
      setErrorUpdate(err.message);
    } finally {
      setLoadingUpdate(false);
    }
  }

  function handleIsServeChange(e) {
    const value = e.target.checked;
    setBreakfastSettings(prev => ({
      ...prev,
      is_served: value ? 1 : 0,
    }));
  }

  function handleIncludedChange(e) {
    const value = e.target.value === "included";
    setBreakfastSettings(prev => ({
      ...prev,
      is_included: value ? 1 : 0,
    }));
  }

  function handlePriceChange(e) {
    const value = e.target.value;
    setBreakfastSettings(prev => ({
      ...prev,
      price: parseFloat(value),
    }));
  }

  if (loadingSettings) return <Spinner />;

  if (errorSettings)
    return <p>{t("UNEXPECTED_ERROR", { ns: "validation" })}</p>;
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t("breakfast_settings")}</h3>
      <div className={styles.currentSettings}>
        <dl>
          <dt>{t("breakfast_current_settings")}</dt>
          {currentSettings?.is_served === 0 ? (
            <dd>{t("no_breakfast")}</dd>
          ) : currentSettings?.is_included === 0 ? (
            <dd>
              {t("breakfast_not_included", { value: currentSettings?.price })}
            </dd>
          ) : (
            <dd>{t("breakfast_included")}</dd>
          )}
        </dl>
      </div>
      <p className={styles.subtitle}>{t("set_up")}</p>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={breakfastSettings.is_served}
          onChange={handleIsServeChange}
        />
        {t("breakfast_is_served")}
      </label>
      {breakfastSettings.is_served === 1 && (
        <div className={styles.options}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="breakfastOption"
              value="included"
              checked={breakfastSettings.is_included}
              onChange={handleIncludedChange}
            />
            <span>{t("included_in_rate")}</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="breakfastOption"
              value="extra"
              checked={!breakfastSettings.is_included}
              onChange={handleIncludedChange}
            />
            <span>{t("extra_charge")}</span>
          </label>

          {breakfastSettings.is_included === 0 && (
            <input
              type="number"
              className={styles.input}
              placeholder={t("breakfast_price")}
              value={breakfastSettings.price}
              onChange={handlePriceChange}
            />
          )}
        </div>
      )}
      <br />
      <button
        className={styles.submitBtn}
        disabled={loadingUpdate}
        onClick={handleBreakfastSettingsUpdate}
      >
        {loadingUpdate ? "Loading..." : t("save")}
      </button>
      {errorUpdate && (
        <p style={{ color: "red" }}>
          {t("UNEXPECTED_ERROR", { ns: "validation" })}
        </p>
      )}
    </div>
  );
}

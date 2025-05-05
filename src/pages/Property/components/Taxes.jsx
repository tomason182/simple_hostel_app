import { useEffect, useState } from "react";
import styles from "./Taxes.module.css";
import { useTranslation } from "react-i18next";

const initialTax = {
  name: "",
  type: "percentage",
  value: "",
  per: "booking",
};

export default function Taxes() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState(initialTax);
  const [embedded, setEmbedded] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    fetchTaxSettings();
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const url = import.meta.env.VITE_URL_BASE + "/taxes/";
      const options = {
        mode: "cors",
        method: "GET",
        credentials: "include",
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Fail to fetch taxes");
      }

      const data = await response.json();
      setEntries(data.msg);
    } catch (err) {
      console.error("Failed to fetch taxes", err);
    }
  }

  async function fetchTaxSettings() {
    try {
      const url = import.meta.env.VITE_URL_BASE + "/taxes/settings/";
      const options = {
        mode: "cors",
        method: "GET",
        credentials: "include",
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Fail to fetch taxes settings");
      }

      const data = await response.json();

      setEmbedded(data.embedded);
    } catch (err) {
      console.error("Fail to fetch taxes setting", err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setNewEntry(prev => ({ ...prev, [name]: value }));
  }

  async function updateSettings(value) {
    try {
      // Update taxes setting in db
      const url = import.meta.env.VITE_URL_BASE + "/taxes/settings/";
      const options = {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ embedded: value }),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg);
      }

      setEmbedded(value);
    } catch (err) {
      console.error("Failed to update taxes setting", err);
    }
  }

  async function handleAdd() {
    if (!newEntry.name || !newEntry.value) return;

    try {
      const url = import.meta.env.VITE_URL_BASE + "/taxes/";
      const options = {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...newEntry,
          value: parseFloat(newEntry.value),
        }),
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to Add tax");
      }

      await fetchEntries();
      setNewEntry(initialTax);
    } catch (e) {
      console.error(e.message);
    }
  }

  async function handleDelete(id) {
    try {
      const url = import.meta.env.VITE_URL_BASE + "/taxes/" + id;
      const options = {
        mode: "cors",
        method: "DELETE",
        credentials: "include",
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to delete tax");
      }

      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.title}>{t("taxes_fees")}</h2>

      <fieldset>
        <legend>Are taxes and fees included in your rates</legend>
        <div className={styles.radioInput}>
          <label>
            <input
              type="radio"
              checked={embedded}
              onChange={() => updateSettings(true)}
            />
            <span>Taxes and fees embedded in rate</span>
          </label>
        </div>
        <div className={styles.radioInput}>
          <label>
            <input
              type="radio"
              checked={!embedded}
              onChange={() => updateSettings(false)}
            />
            <span>Taxes and fees charged additionally</span>
          </label>
        </div>
      </fieldset>
      {!embedded && (
        <>
          <div className={styles.gridContainer}>
            <input
              type="text"
              name="name"
              value={newEntry.name}
              onChange={handleChange}
              placeholder="name"
              className={styles.input}
            />
            <select
              name="type"
              value={newEntry.type}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="percentage">%</option>
              <option value="fixed">Fixed</option>
            </select>
            <input
              type="number"
              name="value"
              value={newEntry.value}
              onChange={handleChange}
              placeholder="Value"
              className={styles.input}
            />
            {newEntry.type === "fixed" && (
              <select
                name="per"
                value={newEntry.per}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="booking">Per booking</option>
                <option value="night">Per night</option>
                <option value="guest">Per guest</option>
              </select>
            )}
            <button onClick={handleAdd} className={styles.button}>
              Add
            </button>
          </div>
          <ul>
            {entries.map(entry => (
              <li key={entry.id} className={styles.listItem}>
                <span>
                  {entry.name} -{" "}
                  {entry.type === "percentage"
                    ? `${entry.value}%`
                    : `$${entry.value} ${entry.per}`}
                </span>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

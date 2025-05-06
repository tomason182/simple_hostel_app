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

  const { t } = useTranslation();

  useEffect(() => {
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

  function handleChange(e) {
    const { name, value } = e.target;

    setNewEntry(prev => ({ ...prev, [name]: value }));
  }

  async function handleAdd() {
    if (!newEntry.name || !newEntry.value) return;

    try {
      const taxBody = {
        ...newEntry,
        value: parseFloat(newEntry.value),
      };

      const url = import.meta.env.VITE_URL_BASE + "/taxes/";
      const options = {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(taxBody),
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.json();
        console.log(error);
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

      <div className={styles.gridContainer}>
        <input
          type="text"
          name="name"
          value={newEntry.name}
          onChange={handleChange}
          placeholder={t("VAT")}
          className={styles.input}
        />
        <select
          name="type"
          value={newEntry.type}
          onChange={handleChange}
          className={styles.input}
        >
          <option value="percentage">%</option>
          <option value="fixed">{t("fixed")}</option>
        </select>
        <input
          type="number"
          name="value"
          value={newEntry.value}
          onChange={handleChange}
          placeholder={t("value")}
          className={styles.input}
        />
        {newEntry.type === "fixed" && (
          <select
            name="per"
            value={newEntry.per}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="booking">{t("per_booking")}</option>
            <option value="night">{t("per_night")}</option>
            <option value="guest">{t("per_guest")}</option>
          </select>
        )}
        <button onClick={handleAdd} className={styles.button}>
          {t("add")}
        </button>
      </div>
      <ul className={styles.taxList}>
        {entries.map(entry => (
          <li key={entry.id} className={styles.listItem}>
            <span>
              {entry.name} -{" "}
              {entry.type === "percentage"
                ? `${entry.value}%`
                : `$${entry.value} ${entry.per}`}
            </span>
            <button onClick={() => handleDelete(entry.id)}>
              {t("delete")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

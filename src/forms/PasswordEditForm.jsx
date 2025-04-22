import styles from "./defaultFormStyle.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

export default function PasswordEditForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [invalidPass, setInvalidPass] = useState("");

  const { t } = useTranslation();
  const { addToast } = useToast();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setLoading(true);
    const url = import.meta.env.VITE_URL_BASE + "/users/profile/change-pass";
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
        if (response >= 400) {
          throw new Error("UNEXPECTED_ERROR");
        }

        return response.json();
      })
      .then(data => {
        if (data.status === "error") {
          setError(data.msg);
          return false;
        }
        addToast({
          message: t("PASSWORD_UPDATE_SUCCESS", { ns: "validation" }),
        });
      })
      .catch(e => setError(t(e.message, { ns: "validation" })))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    function checkPass() {
      if (formData.newPassword !== "" && formData.repeatNewPassword !== "") {
        if (formData.newPassword !== formData.repeatNewPassword) {
          setInvalidPass("PASSWORD_NOT_MATCH");
        } else {
          setInvalidPass("");
        }
      } else {
        setInvalidPass("");
      }
    }

    checkPass();
  }, [formData]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>
          {t("current_password")}
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          {t("new_password")}
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          {t("confirm_password")}
          <input
            type="password"
            name="repeatNewPassword"
            value={formData.repeatNewPassword}
            onChange={handleChange}
            required
          />
        </label>
        <span className={styles.error}>
          {t(invalidPass, { ns: "validation" })}
        </span>
      </div>
      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {t("save")}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <span
        className={styles.note}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#555"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        {t("password_requirement")}
      </span>
    </form>
  );
}

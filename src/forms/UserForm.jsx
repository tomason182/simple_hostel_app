import { useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

export default function UserForm({
  user,
  setIsOpen,
  resetState,
  refreshUsersData,
}) {
  const [userData, setUserData] = useState({
    id: user.id === "" ? -1 : user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t } = useTranslation();
  const { addToast } = useToast();

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const url = import.meta.env.VITE_URL_BASE + "/users/create";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    };

    setLoading(true);

    fetch(url, options)
      .then(async response => {
        if (response.status >= 400) {
          const error = await response.json();
          throw new Error(error.msg || "UNEXPECTED_ERROR");
        }

        return response.json();
      })
      .then(() => {
        addToast({
          message: t("USER_CREATED", { ns: "validation" }),
          type: "success",
        });
        refreshUsersData();
        setIsOpen(false);
        resetState();
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("first_name")}
            <input
              type="text"
              name="first_name"
              required
              aria-required
              value={userData.first_name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("last_name")}
            <input
              type="text"
              name="last_name"
              required
              aria-required
              value={userData.last_name}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            Email
            <input
              type="email"
              name="username"
              required
              aria-required
              disabled={userData.id > 0}
              value={userData.username}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            Role
            <select
              name="role"
              required
              aria-required
              value={userData.role}
              onChange={handleChange}
            >
              <option value="">{t("select_one")}</option>
              <option value="manager">{t("manager")}</option>
              <option value="employee">{t("employee")}</option>
            </select>
          </label>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          onClick={() => {
            resetState(), setIsOpen(false);
          }}
        >
          {t("cancel")}
        </button>
        <button className={styles.submitButton} disabled={loading}>
          {loading ? "Loading..." : t("save")}
        </button>
      </div>
      {error && (
        <div>
          <p className={styles.error}>{error}</p>
        </div>
      )}
    </form>
  );
}

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  refreshUsersData: PropTypes.func.isRequired,
  resetState: PropTypes.func.isRequired,
};

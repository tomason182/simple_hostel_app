import styles from "./defaultFormStyle.module.css";
import { UserProfileContext } from "../data_providers/UserProfileProvider";
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner";
import { useTranslation } from "react-i18next";

export default function ProfileEditForm() {
  const { userProfile, loading, error, refreshUserProfile } =
    useContext(UserProfileContext);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    role: "",
  });

  const [loadingForm, setLoadingForm] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    function handleFormInitialValues() {
      setFormData({
        first_name: userProfile?.first_name || "",
        last_name: userProfile?.last_name || "",
        username: userProfile?.username || "",
        role: userProfile?.role || "",
      });
    }

    handleFormInitialValues();
  }, [userProfile]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setLoadingForm(true);

    const formBody = {
      first_name: formData.first_name,
      last_name: formData.last_name,
    };

    const url = import.meta.env.VITE_URL_BASE + "/users/profile";
    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(formBody),
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Unable to update user profile");
        }
        return response.json();
      })
      .then(() => {
        refreshUserProfile();
        alert("User updated successfully");
      })
      .catch(e => alert(e.message))
      .finally(() => setLoadingForm(false));
  }

  if (loading) return <Spinner />;

  if (error) return <p>{t("unexpected_error_message")}</p>;

  return (
    <form className={styles.form} onSubmit={handleFormSubmit}>
      <div className={styles.formGroup}>
        <label>
          {t("first_name")}
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          {t("last_name")}
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleFormChange}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Email
          <input
            type="email"
            name="username"
            disabled
            value={formData.username}
            onChange={handleFormChange}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Role
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            disabled
          />
        </label>
      </div>
      <div className={styles.buttonGroup} style={{ justifyContent: "right" }}>
        <button
          className={styles.submitButton}
          type="submit"
          disabled={loadingForm}
        >
          {t("save")}
        </button>
      </div>
    </form>
  );
}

import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function ChildrenPoliciesForm({
  closeModal,
  childrenPoliciesData,
  refreshPropertyData,
}) {
  const [formData, setFormData] = useState({
    allow_children:
      childrenPoliciesData?.children_allowed.toString() || "false",
    children_min_age: childrenPoliciesData?.min_age || 0,
    minors_room_types: childrenPoliciesData?.allowed_room_types || "all_rooms",
    free_stay_age: childrenPoliciesData?.free_stay_age || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t } = useTranslation();

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const url =
      import.meta.env.VITE_URL_BASE + "/properties/policies/children-policies";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    };
    setError(null);
    setLoading(true);
    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Unable to update children policies. Server error");
        }
        return response.json();
      })
      .then(() => {
        closeModal();
        refreshPropertyData();
        alert("Children policy created successfully");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          {t("are_children_allowed")}
          <select
            name="allow_children"
            value={formData.allow_children}
            onChange={e => handleInputChange(e)}
            className={styles.inputSmall}
          >
            <option value="true">{t("yes")}</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          {t("minimum_age_allowed")}:
          <input
            type="number"
            className={styles.inputSmall}
            name="children_min_age"
            value={formData.children_min_age}
            onChange={e => handleInputChange(e)}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          {t("room_types_allowed_for_children")}:
          <select
            type="number"
            className={styles.inputMedium}
            name="minors_room_types"
            value={formData.minors_room_types}
            onChange={e => handleInputChange(e)}
          >
            <option value="all_rooms">{t("all")}</option>
            <option value="only_private">{t("private_rooms")}</option>
            <option value="only_dorm">{t("dormitories")}</option>
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          {t("free_stay_age")}:
          <input
            className={styles.inputSmall}
            type="number"
            name="free_stay_age"
            value={formData.free_stay_age}
            onChange={e => handleInputChange(e)}
          />
        </label>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton} onClick={closeModal}>
          {t("cancel")}
        </button>
        <button className={styles.submitButton} disabled={loading}>
          {t("save")}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

ChildrenPoliciesForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  childrenPoliciesData: PropTypes.object.isRequired,
  refreshPropertyData: PropTypes.func.isRequired,
};

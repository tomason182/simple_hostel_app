import styles from "./defaultFormStyle.module.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

export default function OtherPoliciesForm({
  otherPoliciesData,
  closeModal,
  refreshPropertyData,
}) {
  const [formData, setFormData] = useState({
    quiet_hours_from: "",
    quiet_hours_to: "",
    smoking_areas: "",
    external_guest_allowed: "",
    pets_allowed: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t } = useTranslation();
  const { addToast } = useToast();

  useEffect(() => {
    setFormData({
      quiet_hours_from: otherPoliciesData.quiet_hours_from,
      quiet_hours_to: otherPoliciesData.quiet_hours_to,
      smoking_areas: otherPoliciesData.smoking_areas.toString(),
      external_guest_allowed:
        otherPoliciesData.external_guest_allowed.toString(),
      pets_allowed: otherPoliciesData.pets_allowed.toString(),
    });
  }, [otherPoliciesData]);

  function handleFormChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const url =
      import.meta.env.VITE_URL_BASE + "/properties/policies/other-policies";
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
          throw new Error("UNEXPECTED_ERROR");
        }

        return response.json();
      })
      .then(() => {
        closeModal();
        refreshPropertyData();
        addToast({ message: t("POLICY_CREATE_SUCCESS", { ns: "validation" }) });
      })
      .catch(e => setError(t(e.message, { ns: "validate" })))
      .finally(() => setLoading(false));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset>
        <legend>{t("quite_hours")}</legend>
        <div className={styles.formGroup}>
          <label>
            {t("from")}
            <input
              type="time"
              name="quiet_hours_from"
              value={formData.quiet_hours_from}
              onChange={handleFormChange}
              required
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("until")}
            <input
              type="time"
              name="quiet_hours_to"
              value={formData.quiet_hours_to}
              onChange={handleFormChange}
              required
            />
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>{t("external_guest_policy")}</legend>
        <div className={styles.formGroup}>
          <label>
            {t("external_guest_allowed")}
            <select
              name="external_guest_allowed"
              value={formData.external_guest_allowed}
              onChange={handleFormChange}
              required
            >
              <option value="">{t("select_one")}</option>
              <option value="false">No</option>
              <option value="true">{t("yes")}</option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>{t("pet_policy")}</legend>
        <div className={styles.formGroup}>
          <label>
            {t("pets_allowed")}
            <select
              name="pets_allowed"
              onChange={handleFormChange}
              value={formData.pets_allowed}
              required
            >
              <option value="">{t("select_one")}</option>
              <option value="false">No</option>
              <option value="true">{t("yes")}</option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>{t("areas_and_services")}</legend>
        <div className={styles.formGroup}>
          <label>
            {t("smoking_areas")}?
            <select
              name="smoking_areas"
              onChange={handleFormChange}
              value={formData.smoking_areas}
              required
            >
              <option value="">{t("select_one")}</option>
              <option value="true">{t("yes")}</option>
              <option value="false">No</option>
            </select>
          </label>
        </div>
      </fieldset>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          type="button"
          onClick={closeModal}
        >
          {t("cancel")}
        </button>
        <button
          className={styles.submitButton}
          type="submit"
          disabled={loading}
        >
          {t("save")}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

OtherPoliciesForm.propTypes = {
  otherPoliciesData: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  refreshPropertyData: PropTypes.func.isRequired,
};

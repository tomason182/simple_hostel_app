import styles from "./defaultFormStyle.module.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

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

  console.log(formData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          throw new Error(
            "Server error. Unable to create or update property other policies"
          );
        }

        return response.json();
      })
      .then(() => {
        closeModal();
        refreshPropertyData();
        alert("Other policies created/updated successfully");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset>
        <legend>House roles</legend>
        <div className={styles.formGroup}>
          <label>
            From
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
            To
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
        <legend>External guest policies</legend>
        <div className={styles.formGroup}>
          <label>
            Are external guest allowed?
            <select
              name="external_guest_allowed"
              value={formData.external_guest_allowed}
              onChange={handleFormChange}
              required
            >
              <option value="">Select an option...</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Pets Policies</legend>
        <div className={styles.formGroup}>
          <label>
            Do you accept pets in your property?
            <select
              name="pets_allowed"
              onChange={handleFormChange}
              value={formData.pets_allowed}
              required
            >
              <option value="">Select an option...</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Areas and services</legend>
        <div className={styles.formGroup}>
          <label>
            Is there smoking area in your property?
            <select
              name="smoking_areas"
              onChange={handleFormChange}
              value={formData.smoking_areas}
              required
            >
              <option value="">Select an option...</option>
              <option value="true">Yes</option>
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
          Cancel
        </button>
        <button
          className={styles.submitButton}
          type="submit"
          disabled={loading}
        >
          Submit
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

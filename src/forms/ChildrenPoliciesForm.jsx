import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import PropTypes from "prop-types";

export default function ChildrenPoliciesForm({
  closeModal,
  childrenPoliciesData,
  refreshPropertyData,
}) {
  const [formData, setFormData] = useState({
    allow_children: childrenPoliciesData?.children_allowed || false,
    children_min_age: childrenPoliciesData?.min_age || 0,
    minors_room_types: childrenPoliciesData?.allowed_room_types || "all_rooms",
    free_stay_age: childrenPoliciesData?.free_stay_age || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(formData);

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
          Are children allowed in your property?
          <select
            name="allow_children"
            value={formData.allow_children}
            onChange={e => handleInputChange(e)}
            className={styles.inputSmall}
          >
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Children minimum age allowed:
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
          Children allowed room types:
          <select
            type="number"
            className={styles.inputMedium}
            name="minors_room_types"
            value={formData.minors_room_types}
            onChange={e => handleInputChange(e)}
          >
            <option value="all_rooms">All room types</option>
            <option value="only_private">Only Private Rooms</option>
            <option value="only_dorm">Only dormitories</option>
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Free stay age (leave 0 for no):
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
          Cancel
        </button>
        <button className={styles.submitButton} disabled={loading}>
          Submit
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

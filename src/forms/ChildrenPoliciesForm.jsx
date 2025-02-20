import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import PropTypes from "prop-types";

export default function ChildrenPoliciesForm({
  closeModal,
  childrenPoliciesData,
}) {
  const [formData, setFormData] = useState({
    children_allow: childrenPoliciesData?.children_allowed || false,
    min_age: childrenPoliciesData?.min_age || 0,
    allowed_room_types: childrenPoliciesData?.allowed_room_types || null,
    free_stay_age: childrenPoliciesData?.free_stay_age || 0,
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Are children allowed in your property?
          <select
            name="children_allow"
            value={formData.children_allow}
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
            name="min_age"
            value={formData.min_age}
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
            name="allowed_room_types"
            value={formData.allowed_room_types}
            onChange={e => handleInputChange(e)}
          >
            <option value="all">All room types</option>
            <option value="private_room">Only Private Rooms</option>
            <option value="dorm">Only dormitories</option>
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
        <button className={styles.submitButton}>Submit</button>
      </div>
    </form>
  );
}

ChildrenPoliciesForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  childrenPoliciesData: PropTypes.object.isRequired,
};

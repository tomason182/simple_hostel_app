import { useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function UserForm({ user }) {
  const [userData, setUserData] = useState({ ...user });

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  }
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label>
          First name
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
          Last name
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
      <div className={styles.formGroup}>
        <label>
          Email
          <input
            type="email"
            name="email"
            required
            aria-required
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
            <option value="">Select a role...</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </label>
      </div>

      <button className={styles.submitButton}>Submit</button>
    </form>
  );
}

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
};

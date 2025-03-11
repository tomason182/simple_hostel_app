import { useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function UserForm({ user, setIsOpen, refreshUsersData }) {
  const [userData, setUserData] = useState({
    id: user.id === "" ? -1 : user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(userData);

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
          console.log(error);
          throw new Error(error.msg || "Server Error");
        }

        return response.json();
      })
      .then(() => {
        refreshUsersData();
        setIsOpen(false);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }
  return (
    <>
      <h4 className={styles.title}>
        {userData.id > 0 ? "Edit User" : "Create User"}
      </h4>
      <form className={styles.form} onSubmit={handleSubmit}>
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
              <option value="">Select a role...</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </label>
        </div>

        <button className={styles.submitButton} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
        {error && (
          <div>
            <p className={styles.error}>{error}</p>
          </div>
        )}
      </form>
    </>
  );
}

UserForm.propTypes = {
  user: PropTypes.object.isRequired,
  setIsOpen: PropTypes.object.isRequired,
  refreshUsersData: PropTypes.object.isRequired,
};

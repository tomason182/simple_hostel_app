import styles from "./Header.module.css";
import PropTypes from "prop-types";

export default function Header({ user, propertyName }) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Logo */}
        <div className={styles.logo}>
          <h1>Simple Hostel.</h1>
        </div>

        {/* Search bar */}
        <div className={styles.searchBar}>
          <div className={styles.relative}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ccc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              name="mainSearch"
              id="mainSearch"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        {/* Property & User info*/}
        <div className={styles.userInfo}>
          <p className={styles.propertyName}>
            {propertyName ? propertyName : "Loading..."}
          </p>
          <p className={styles.userName}>
            Hello, {user ? user.name : "Loading..."}
          </p>
        </div>

        {/* Action Buttons */}

        <button className={styles.actionButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <button className={styles.actionButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        <button className={styles.actionButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
  propertyName: PropTypes.string.isRequired,
};

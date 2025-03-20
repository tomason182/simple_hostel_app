import styles from "./defaultFormStyle.module.css";

export default function PasswordEditForm() {
  return (
    <>
      <h3>Change your password</h3>
      <form className={styles.userEditForm}>
        <label>
          Current password
          <input type="password" name="currentPassword" />
        </label>
        <label>
          New password
          <input type="password" name="newPassword" />
        </label>
        <label>
          Confirm password
          <input type="password" name="confirmPassword" />
        </label>
        <button type="submit">Save</button>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Password should Password should contain at least 14 characters, 4
          lowercase, 2 uppercase, 2 numbers and 2 symbols
        </span>
      </form>
    </>
  );
}

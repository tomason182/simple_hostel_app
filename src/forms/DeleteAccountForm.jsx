import styles from "./defaultFormStyle.module.css";

export default function DeleteAccountForm() {
  const loading = false;
  return (
    <>
      <h3>Delete Your Account</h3>
      <p className={styles.pNormal}>
        Permanently remove your account and all associated data. These actions
        can not be undone
      </p>
      <button
        className={styles.btnDelete}
        disabled={loading}
        onClick={() => alert("account deleted")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
        Delete account
      </button>
    </>
  );
}

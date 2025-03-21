import styles from "./defaultFormStyle.module.css";

export default function DeleteAccountForm() {
  const loading = false;
  return (
    <>
      <p className={styles.subtitle}>
        Permanently remove your account and all associated data. These actions
        can not be undone
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className={styles.cancelButton}
          disabled={loading}
          onClick={() => alert("account deleted")}
        >
          Delete account
        </button>
      </div>
    </>
  );
}

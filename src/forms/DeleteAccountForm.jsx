import styles from "./defaultFormStyle.module.css";
import { useTranslation } from "react-i18next";

export default function DeleteAccountForm() {
  const loading = false;
  const { t } = useTranslation();
  return (
    <>
      <p className={styles.subtitle}>
        {t("permanently_remove_account_message")}
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className={styles.cancelButton}
          disabled={loading}
          onClick={() => alert("account deleted")}
        >
          {t("delete_account")}
        </button>
      </div>
    </>
  );
}

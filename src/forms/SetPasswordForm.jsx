import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SetPasswordForm({ token }) {
  const { t } = useTranslation();
  return (
    <form>
      <div className={styles.formGroup}>
        <label>
          {t("password")}
          <input type="password" name="password" required aria-required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          {t("confirm_password")}
          <input
            type="password"
            name="confirm_password"
            required
            aria-required
          />
        </label>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.submitButton}>{t("submit")}</button>
      </div>
    </form>
  );
}

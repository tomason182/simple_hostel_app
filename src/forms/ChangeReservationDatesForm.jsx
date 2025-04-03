import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function ChangeReservationsDatesForm({ setIsOpen }) {
  const { t } = useTranslation();
  return (
    <form className={styles.form}>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("check_in")}
            <input type="date" name="check_in" required aria-required />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("check_out")}
            <input type="date" name="check_out" required aria-required />
          </label>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          onClick={() => setIsOpen(false)}
        >
          {t("cancel")}
        </button>
        <button className={styles.submitButton}>{t("save")}</button>
      </div>
    </form>
  );
}

ChangeReservationsDatesForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

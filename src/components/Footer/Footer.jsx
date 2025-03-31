import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const changeLanguage = lng => i18n.changeLanguage(lng);

  return (
    <footer>
      <div className={styles.footer}>
        <div className={styles.language}>
          <p>{t("language")}:</p>
          <select
            value={i18n.language}
            onChange={e => changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div className={styles.info}>
          <p>&#9400; 2025 SimpleHostel</p>
          <p>
            <a href="http://google.com">{t("terms")}</a>
          </p>
          <p>
            <a href="#">{t("privacy")}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

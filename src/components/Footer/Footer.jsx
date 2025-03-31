import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n } = useTranslation();
  const changeLanguage = lng => i18n.changeLanguage(lng);

  return (
    <footer>
      <div className={styles.footer}>
        <div className={styles.language}>
          <p>Language:</p>
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
            <a href="http://google.com">Terms and Conditions</a>
          </p>
          <p>
            <a href="#">Privacy</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

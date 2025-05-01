import styles from "./NavBar.module.css";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { t } = useTranslation();

  return (
    <nav className={styles.navBar}>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/">{t("home")}</NavLink>
        </li>
        <li>
          <NavLink to="/calendar">{t("calendar")}</NavLink>
        </li>
        <li>
          <NavLink to="/rates-and-availability">
            {t("rates_availability")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/reservations">{t("reservations")}</NavLink>
        </li>
        <li>
          <NavLink to="/property">{t("property")}</NavLink>
        </li>
        <li>
          <NavLink to="/inbox">{t("inbox")}</NavLink>
        </li>
        <li>
          <NavLink to="/book-engine">{t("book_engine")}</NavLink>
        </li>
        <li>
          <NavLink to="/reports">{t("reports")}</NavLink>
        </li>
      </ul>
    </nav>
  );
}

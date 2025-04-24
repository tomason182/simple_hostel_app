import SetPasswordForm from "../../forms/SetPasswordForm";
import styles from "./EmailVerified.module.css";
import { useParams } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

export default function NewUser() {
  const { token } = useParams();
  const propertyName = jwtDecode(token).propertyName;
  const { t } = useTranslation();

  return (
    <div className={styles.mainContent}>
      <h1>{t("welcome_simple_hostel")}</h1>
      <h3>{t("invitation", { name: propertyName })}</h3>
      <p className={styles.text}>{t("get_started")}</p>
      <SetPasswordForm token={token} />
    </div>
  );
}

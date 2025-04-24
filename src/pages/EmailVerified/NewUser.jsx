import SetPasswordForm from "../../forms/SetPasswordForm";
import styles from "./EmailVerified.module.css";
import { useParams } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function NewUser() {
  const { token } = useParams();
  const propertyName = jwtDecode(token)?.sub?.propertyName;
  const { t } = useTranslation();

  // Log out any open session.
  useEffect(() => {
    const url = import.meta.env.VITE_URL_BASE + "/users/logout";
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server error");
        }
      })
      .catch(err => console.error("Unable to log out: ", err));
  }, []);

  return (
    <div className={styles.mainContent}>
      <h1>{t("welcome_simple_hostel")}</h1>
      <h3>{t("invitation", { name: propertyName })}</h3>
      <p className={styles.text}>{t("get_started")}</p>

      <SetPasswordForm token={token} />
    </div>
  );
}

import { useTranslation } from "react-i18next";
import styles from "./EmailVerified.module.css";
import formStyles from "../../forms/defaultFormStyle.module.css";
import passwordValidator from "../../utils/passwordValidator";
import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";

export default function ResetPasswordFinish() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const newPassword = e.target.newPassword.value;
      const repeatNewPassword = e.target.repeatNewPassword.value;

      if (newPassword !== repeatNewPassword) {
        throw new Error("PASSWORD_NOT_MATCH");
      }

      const isValidPassword = passwordValidator(newPassword);
      if (isValidPassword === false) {
        throw new Error("PASSWORD_REQUIREMENT");
      }

      const url =
        import.meta.env.VITE_URL_BASE +
        "/users/reset-password/finish-change-pass/" +
        token;
      const options = {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
          repeatNewPassword,
        }),
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg);
      }

      addToast({
        message: t("PASSWORD_UPDATE_SUCCESS", { ns: "validation" }),
        type: "success",
      });

      navigate("/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={styles.mainContent}>
      <h1>Simple Hostel.</h1>
      <h2>{t("reset_your_password")}</h2>
      <p className={styles.text}>{t("reset_your_password_text")}</p>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <div className={formStyles.formGroup}>
          <label>
            {t("new_password")}
            <input type="password" name="newPassword" required aria-required />
          </label>
          <p
            style={{
              maxWidth: "400px",
              fontSize: "12px",
              color: "#333",
            }}
          >
            {t("password_requirement")}
          </p>
        </div>
        <div className={formStyles.formGroup}>
          <label>
            {t("confirm_password")}
            <input
              type="password"
              name="repeatNewPassword"
              required
              aria-required
            />
          </label>
        </div>

        <button className={formStyles.submitButton} disabled={loading}>
          {loading ? "Loading..." : t("reset_password")}
        </button>
      </form>
      {error && (
        <div className={styles.error}>
          <p className={styles.errorMessage}>
            {t(error, { ns: "validation" })}
          </p>
        </div>
      )}
    </div>
  );
}

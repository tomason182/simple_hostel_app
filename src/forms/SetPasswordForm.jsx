import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useToast } from "../hooks/useToast.jsx";
import passwordValidator from "../utils/passwordValidator.js";
import { useNavigate } from "react-router";

export default function SetPasswordForm({ token }) {
  const [error, setError] = useState(null);
  const [passwordRequirement, setPasswordRequirement] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const { addToast } = useToast();
  const navigate = useNavigate();

  function handleChange(e) {
    const value = e.target.value;

    const isValid = passwordValidator(value);

    if (isValid === false) {
      setPasswordRequirement("PASSWORD_REQUIREMENT");
    } else {
      setPasswordRequirement(null);
    }
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const fromBody = {
        newPassword: e.target.password.value,
        repeatNewPassword: e.target.confirmPassword.value,
      };
      const url =
        import.meta.env.VITE_URL_BASE + "/users/validate/new-user/" + token;
      const options = {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fromBody),
      };

      if (fromBody.newPassword !== fromBody.repeatNewPassword) {
        setError("PASSWORD_NOT_MATCH");
        return;
      }

      const isValidPassword = passwordValidator(fromBody.newPassword);

      if (isValidPassword === false) {
        setError("PASSWORD_REQUIREMENT");
        return;
      }
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        setError(error.msg || "UNEXPECTED_ERROR");
        return;
      }

      addToast({
        message: t("USER_CREATED", { ns: "validation" }),
        type: "success",
      });

      navigate("/accounts/auth");
    } catch (err) {
      setError(err.message || "UNEXPECTED_ERROR");
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px" }}
    >
      <div className={styles.formGroup}>
        <label>
          {t("password")}
          <input
            type="password"
            name="password"
            required
            aria-required
            onChange={handleChange}
          />
        </label>
        {passwordRequirement && (
          <span className={styles.passwordRequirementMessage}>
            {t(passwordRequirement, { ns: "validation" })}
          </span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label>
          {t("confirm_password")}
          <input
            type="password"
            name="confirmPassword"
            required
            aria-required
          />
        </label>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.submitButton} disabled={loading}>
          {loading ? "Loading..." : t("submit")}
        </button>
      </div>
      {error && (
        <p className={styles.error}>{t(error, { ns: "validation" })}</p>
      )}
    </form>
  );
}

SetPasswordForm.propTypes = {
  token: PropTypes.string.isRequired,
};

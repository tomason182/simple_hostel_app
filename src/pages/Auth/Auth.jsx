import styles from "./Auth.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate, Navigate } from "react-router";

export default function Auth() {
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();

  if (document.cookie.includes("Auth=true")) return <Navigate to="/" replace />;

  return (
    <div className={styles.mainContent}>
      <h1>Simple Hostel.</h1>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => setIndex(0)}
          className={index === 0 ? styles.active : ""}
        >
          {t("sign_in")}
        </button>
        <button
          onClick={() => setIndex(1)}
          className={index === 1 ? styles.active : ""}
        >
          {t("sign_up")}
        </button>
      </div>
      <div className={styles.formContainer}>
        {index === 0 && <LogIn setIndex={setIndex} />}
        {index === 1 && <SignUp setIndex={setIndex} />}
      </div>
    </div>
  );
}

function LogIn({ setIndex }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const formBody = {
      username: e.target.username.value,
      password: e.target.password.value,
    };

    const url = import.meta.env.VITE_URL_BASE + "/users/auth";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formBody),
    };
    setLoading(true);
    setError(null);

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error(t("sign_in_fail_msg"));
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "error") {
          throw new Error(t("invalid_credentials"));
        }

        return navigate("/", { replace: true });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <h3>{t("sign_in_title")}</h3>
      <p className={styles.formText}>
        {t("sign_in_msg")}{" "}
        <button onClick={() => setIndex(1)} className={styles.linkButton}>
          {t("sign_up")}
        </button>
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          <span>{t("email_address")}</span>
          <input type="email" name="username" required aria-required />
        </label>
        <label>
          <span>{t("password")}</span>
          <input type="password" name="password" required aria-required />
        </label>
        <button type="submit" className={styles.submitButton}>
          {loading ? "Loading..." : t("sign_in")}
        </button>
        <button className={styles.forgotPass} disabled={loading}>
          {t("forgot_password")}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          <p className={styles.errorMessage} style={{ color: "red" }}>
            {error}
          </p>
        </div>
      )}
    </>
  );
}

function SignUp({ setIndex }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      <h3>{t("sign_up_title")}</h3>
      <p className={styles.formText}>
        {t("sign_up_msg")}{" "}
        <button onClick={() => setIndex(0)} className={styles.linkButton}>
          {t("sign_in")}
        </button>
      </p>
      <form className={styles.form}>
        <label>
          <span>{t("first_name")}</span>
          <input type="text" required aria-required name="firstName" />
        </label>
        <label>
          <span>{t("property_name")}</span>
          <input type="text" required aria-required name="propertyName" />
        </label>
        <label>
          <span>{t("email_address")}</span>
          <input type="email" required aria-required name="username" />
        </label>
        <label>
          <span>{t("password")}</span>
          <input type="password" required aria-required name="password" />
        </label>
        <label>
          <span>{t("confirm_password")}</span>
          <input type="password" required aria-required />
        </label>
        <div className={styles.acceptTerms}>
          <input type="checkbox" name="acceptTerms" required aria-required />
          <label htmlFor="acceptTerms">
            <Trans
              i18nKey="accept_terms"
              components={{
                terms: (
                  <a
                    href="https://www.simplehostel.net/legal/terms"
                    target="blank"
                    rel="noopener noreferrer"
                  />
                ),
                privacy: (
                  <a
                    href="https://www.simplehostel.net/legal/privacy"
                    target="blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            />
          </label>
        </div>
        <button type="submit" className={styles.submitButton}>
          {loading ? "Loading..." : t("sign_in")}
        </button>
      </form>
    </>
  );
}

LogIn.propTypes = {
  setIndex: PropTypes.func.isRequired,
};

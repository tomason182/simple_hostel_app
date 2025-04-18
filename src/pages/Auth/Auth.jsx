import styles from "./Auth.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
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
          Sign in
        </button>
        <button
          onClick={() => setIndex(1)}
          className={index === 1 ? styles.active : ""}
        >
          Sign up
        </button>
      </div>
      <div className={styles.formContainer}>
        {index === 0 && <LogIn setIndex={setIndex} />}
        {index === 1 && <h1>Log out</h1>}
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
      <h3>Sign in to your account</h3>
      <p className={styles.formText}>
        Don&apos;t you have an account?{" "}
        <button onClick={() => setIndex(1)} className={styles.linkButton}>
          Sign up
        </button>
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          <span>Email address</span>
          <input type="email" name="username" required aria-required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password" required aria-required />
        </label>
        <button type="submit">{loading ? "Loading..." : "Sign in"}</button>
        <button className={styles.forgotPass} disabled={loading}>
          Forgot your password?
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

LogIn.propTypes = {
  setIndex: PropTypes.func.isRequired,
};

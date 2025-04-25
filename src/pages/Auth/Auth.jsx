import styles from "./Auth.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate, Navigate } from "react-router";
import { useToast } from "../../hooks/useToast";

export default function Auth() {
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState(null);
  const { t } = useTranslation();

  if (document.cookie.includes("Auth=true")) return <Navigate to="/" replace />;

  return (
    <div className={styles.mainContent}>
      <h1>Simple Hostel.</h1>
      {index < 2 && (
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
      )}

      <div className={styles.formContainer}>
        {index === 0 && <LogIn setIndex={setIndex} />}
        {index === 1 && <SignUp setIndex={setIndex} setEmail={setEmail} />}
        {index === 2 && <EmailVerification email={email} />}
        {index === 3 && <ForgotPassword setIndex={setIndex} />}
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
        <button
          className={styles.forgotPass}
          disabled={loading}
          type="button"
          onClick={() => setIndex(3)}
        >
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

function SignUp({ setIndex, setEmail }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState({
    minLength: false,
    minLowerCase: false,
    minUpperCase: false,
    minNumbers: false,
    minSymbols: false,
    hasWhiteSpaces: false,
  });

  const minLength = 8;
  const minLowerCase = 1;
  const minUpperCase = 1;
  const minNumbers = 1;
  const minSymbols = 1;

  function passwordValidator(password) {
    const lowerCaseCount = (password.match(/[a-z]/g) || []).length;
    const upperCaseCount = (password.match(/[A-Z]/g) || []).length;
    const numbersCount = (password.match(/[0-9]/g) || []).length;
    const symbolsCount = (password.match(/[^A-Za-z0-9\s]/g) || []).length;
    const hasWhiteSpaces = /\s/.test(password);

    let isValid = true;
    switch (isValid) {
      case password.length < minLength:
        isValid = false;
        break;
      case lowerCaseCount < minLowerCase:
        isValid = false;
        break;
      case upperCaseCount < minUpperCase:
        isValid = false;
        break;
      case numbersCount < minNumbers:
        isValid = false;
        break;
      case symbolsCount < minSymbols:
        isValid = false;
        break;
      case hasWhiteSpaces:
        isValid = false;
        break;
      default:
        isValid = true;
    }
    return isValid;
  }

  function handleChange(e) {
    const password = e.target.value;
    const isValid = passwordValidator(password);
    if (isValid) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }

    const lowerCaseCount = (password.match(/[a-z]/g) || []).length;
    const upperCaseCount = (password.match(/[A-Z]/g) || []).length;
    const numbersCount = (password.match(/[0-9]/g) || []).length;
    const symbolsCount = (password.match(/[^A-Za-z0-9\s]/g) || []).length;
    const hasWhiteSpaces = /\s/.test(password);

    setPasswordCheck(prev => ({
      ...prev,
      minLength: password.length >= minLength,
      minLowerCase: lowerCaseCount >= minLowerCase,
      minUpperCase: upperCaseCount >= minUpperCase,
      minNumbers: numbersCount >= minNumbers,
      minSymbols: symbolsCount >= minSymbols,
      hasWhiteSpaces: hasWhiteSpaces,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      if (e.target.password.value !== e.target.confirmPassword.value) {
        throw new Error("Passwords don't match");
      }

      const isValidPassword = passwordValidator(e.target.password.value);

      if (!isValidPassword) {
        throw new Error(
          "Not a valid password. Please, check password restrictions."
        );
      }

      const formBody = {
        username: e.target.username.value,
        password: e.target.password.value,
        firstName: e.target.firstName.value,
        propertyName: e.target.propertyName.value,
        acceptTerms: e.target.acceptTerms.value === "true",
        captchaToken: "CAPTCHA_TOKEN_GOES_HERE",
      };

      const url = import.meta.env.VITE_URL_BASE + "/users/register";
      const options = {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formBody),
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.json();
        console.error(error);
        throw new Error(
          "We couldn't sign you up. Please try again or contact support."
        );
      }

      const data = await response.json();
      if (data?.status === "ok") {
        setEmail(formBody.username);
        setIndex(2);
      } else {
        const error = t(data.msg) || t("unexpected_error_message");
        throw new Error(error);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h3>{t("sign_up_title")}</h3>
      <p className={styles.formText}>
        {t("sign_up_msg")}{" "}
        <button onClick={() => setIndex(0)} className={styles.linkButton}>
          {t("sign_in")}
        </button>
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          <span>{t("first_name")}</span>
          <input
            type="text"
            required
            aria-required
            name="firstName"
            maxLength={100}
          />
        </label>
        <label>
          <span>{t("property_name")}</span>
          <input
            type="text"
            required
            aria-required
            name="propertyName"
            maxLength={255}
          />
        </label>
        <label>
          <span>{t("email_address")}</span>
          <input type="email" required aria-required name="username" />
        </label>
        <label>
          <span>{t("password")}</span>
          <input
            type="password"
            required
            aria-required
            name="password"
            onBlur={() => setIsActive(false)}
            onChange={handleChange}
          />
          <div
            className={`${styles.passwordValidation} ${
              isActive ? styles.active : ""
            }`}
          >
            <ul>
              <li>
                {passwordCheck.minLength ? (
                  <span className={styles.success}>&#x2713; 8 characters</span>
                ) : (
                  <span className={styles.notSuccess}>
                    &#x10102; 8 characters
                  </span>
                )}
              </li>
              <li>
                {passwordCheck.minUpperCase ? (
                  <span className={styles.success}>
                    &#x2713; At least 1 capital letters
                  </span>
                ) : (
                  <span className={styles.notSuccess}>
                    &#x10102; At least 1 capital letters
                  </span>
                )}
              </li>
              <li>
                {passwordCheck.minLowerCase ? (
                  <span className={styles.success}>
                    &#x2713; At least 1 lowercase letters
                  </span>
                ) : (
                  <span className={styles.notSuccess}>
                    &#x10102; At least 1 lowercase letters
                  </span>
                )}
              </li>
              <li>
                {passwordCheck.minNumbers ? (
                  <span className={styles.success}>
                    &#x2713; At least 1 numbers
                  </span>
                ) : (
                  <span className={styles.notSuccess}>
                    &#x10102; At least 1 numbers
                  </span>
                )}
              </li>
              <li>
                {passwordCheck.minSymbols ? (
                  <span className={styles.success}>
                    &#x2713; at least 1 special character
                  </span>
                ) : (
                  <span className={styles.notSuccess}>
                    &#x10102; at least 1 special character
                  </span>
                )}
              </li>
              <li>
                {!passwordCheck.hasWhiteSpaces ? (
                  <span className={styles.success}>
                    &#x2713; No white spaces
                  </span>
                ) : (
                  <span className={styles.notSuccess}>
                    &#x10102; No white spaces
                  </span>
                )}
              </li>
            </ul>
          </div>
        </label>
        <label>
          <span>{t("confirm_password")}</span>
          <input
            type="password"
            name="confirmPassword"
            required
            aria-required
          />
        </label>
        <div className={styles.acceptTerms}>
          <input
            type="checkbox"
            name="acceptTerms"
            value="true"
            required
            aria-required
          />
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
          {loading ? "Loading..." : t("sign_up")}
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

function EmailVerification({ email }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleResendEmail() {
    try {
      const url =
        import.meta.env.VITE_URL_BASE + "/users/resend-email-verification";
      const options = {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      };

      setMessage(null);
      setLoading(true);

      const response = await fetch(url, options);
      if (!response.ok) {
        const error = t("unexpected_error_message");
        throw new Error(error);
      }

      const data = await response.json();
      if (data.status && data.msg) {
        setMessage({
          status: data.status,
          message: data.msg,
          time: data.time || "",
        });
      }
    } catch (e) {
      setMessage({
        status: "error",
        message: e.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.emailValidationContent}>
      <h2>{t("confirm_email_title")}</h2>
      <p className={styles.emailValidationMessage}>
        {t("confirm_email_message")}
      </p>
      <p className={styles.stillTrouble}>
        {t("still_trouble")}
        <button type="button" disabled={loading} onClick={handleResendEmail}>
          {t("resend_email")}
        </button>
      </p>
      {message && (
        <div
          className={`${
            message.status === "ok" ? styles.success : styles.error
          }`}
        >
          <p
            className={`${
              message.status === "ok"
                ? styles.successMessage
                : styles.errorMessage
            }`}
          >
            {message.message === "WAITING_PERIOD"
              ? t(
                  message.message,
                  { count: message?.time },
                  { ns: "validation" }
                )
              : t(message.message, { ns: "validation" })}
          </p>
        </div>
      )}
    </div>
  );
}

function ForgotPassword({ setIndex }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { addToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      const url =
        import.meta.env.VITE_URL_BASE +
        "/users/reset-password/init-change-pass";
      const options = {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: e.target.email.value }),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "UNEXPECTED_ERROR");
      }

      addToast({
        message: t("EMAIL_SENT"),
        type: "success",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1>{t("forgot_password")}</h1>
      <p className={styles.formText}>{t("forgot_password_text")}</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          {t("email_address")}
          <input type="email" name="email" required aria-required />
        </label>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Loading..." : t("send")}
        </button>
        {error && (
          <div className={styles.error}>
            <p className={styles.errorMessage} style={{ color: "red" }}>
              {t(error, { ns: "validation" })}
            </p>
          </div>
        )}
        <br />
        <button
          type="button"
          className={styles.linkButton}
          style={{ float: "left" }}
          onClick={() => setIndex(0)}
        >
          back
        </button>
      </form>
    </div>
  );
}

LogIn.propTypes = {
  setIndex: PropTypes.func.isRequired,
};

SignUp.propTypes = {
  setIndex: PropTypes.func.isRequired,
  setEmail: PropTypes.func.isRequired,
};

EmailVerification.propTypes = {
  email: PropTypes.string.isRequired,
};

ForgotPassword.propTypes = {
  setIndex: PropTypes.func.isRequired,
};

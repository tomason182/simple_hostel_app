import { useEffect, useState } from "react";
import styles from "./EmailVerified.module.css";
import { useParams } from "react-router";
import Spinner from "../../components/Spinner/Spinner";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

export default function EmailVerified() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token } = useParams();
  useEffect(() => {
    if (token) {
      async function verifyToken() {
        try {
          const url =
            import.meta.env.VITE_URL_BASE +
            "/users/confirm-email/" +
            1234 +
            token;
          const options = {
            mode: "cors",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          };
          setLoading(true);
          setError(null);
          const response = await fetch(url, options);
          if (!response.ok) {
            const error = await response.json();
            if (error.msg === "EXPIRED_TOKEN") {
              throw new Error(error.msg);
            } else {
              throw new Error("UNEXPECTED_ERROR");
            }
          }
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }
      verifyToken();
    }
  }, [token]);

  if (loading) return <Spinner />;

  return (
    <div className={styles.mainContent}>
      <h1>SimpleHostel.</h1>
      {error === null ? (
        <SuccessfulMessage />
      ) : (
        <ErrorMessage error={error} token={token} />
      )}
    </div>
  );
}

function SuccessfulMessage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.iconSuccess}
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <h2>{t("email_verified")}</h2>
      <p>{t("email_verified_message")}</p>
      <button onClick={() => navigate("/accounts/auth", { replace: true })}>
        Go to back
      </button>
    </>
  );
}

function ErrorMessage({ error, token }) {
  const { t } = useTranslation();
  const [resendEmailLoading, setResendEmailLoading] = useState(false);
  const [resendEmailMessage, setResendEmailMessage] = useState(null);

  const decoded = jwtDecode(token);
  const email = decoded.sub.email;

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

      setResendEmailMessage(null);
      setResendEmailLoading(true);

      const response = await fetch(url, options);
      if (!response.ok) {
        const error = "UNEXPECTED_ERROR";
        throw new Error(error);
      }

      const data = await response.json();
      if (data.status && data.msg) {
        setResendEmailMessage({
          status: data.status,
          message: data.msg,
          time: data.time || "",
        });
      }
    } catch (e) {
      setResendEmailMessage({
        status: "error",
        message: e.message,
      });
    } finally {
      setResendEmailLoading(false);
    }
  }
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.iconError}
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      <h2>{t("email_verified_error")}</h2>
      <p className={styles.text}>{t(error)}</p>
      <button
        type="button"
        disabled={resendEmailLoading}
        onClick={handleResendEmail}
      >
        {t("resend_email")}
      </button>
      {resendEmailMessage && (
        <div
          className={`${
            resendEmailMessage.status === "ok" ? styles.success : styles.error
          }`}
        >
          <p
            className={`${
              resendEmailMessage.status === "ok"
                ? styles.successMessage
                : styles.errorMessage
            }`}
          >
            {resendEmailMessage.message === "WAITING_PERIOD"
              ? t(resendEmailMessage.message, {
                  count: resendEmailMessage?.time,
                })
              : t(resendEmailMessage.message)}
          </p>
        </div>
      )}
    </>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

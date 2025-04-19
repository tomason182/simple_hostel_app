import { useEffect, useState } from "react";
import styles from "./EmailVerified.module.css";
import { useParams } from "react-router";
import Spinner from "../../components/Spinner/Spinner";
import PropTypes from "prop-types";

export default function EmailVerified() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { token } = useParams();

  useEffect(() => {
    if (token) {
      async function verifyToken() {
        try {
          const url =
            import.meta.env.VITE_URL_BASE + "/users/confirm-email/" + token;
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
              throw new Error(
                "We couldn't verify your email. Token is invalid or has expired"
              );
            } else {
              throw new Error("Unexpected error occurred. Please try again");
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
      {error === null ? <SuccessfulMessage /> : <ErrorMessage error={error} />}
    </div>
  );
}

function SuccessfulMessage() {
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
      <h2>Email Verified</h2>
      <p>
        Your email address was successfully Verified. You can now log into your
        account
      </p>
      <button>Go to back</button>
    </>
  );
}

function ErrorMessage({ error }) {
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
      <h2>Email verification failed</h2>
      <p>{error}</p>
      <button>Resend email</button>
    </>
  );
}

ErrorMessage.propTypes = {
  error: PropTypes.string.isRequired,
};

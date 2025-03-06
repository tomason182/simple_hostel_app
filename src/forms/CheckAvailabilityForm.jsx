import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import PropTypes from "prop-types";

export default function CheckAvailabilityFrom({ setAvailability, setIndex }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const customStyle = {
    form: {
      width: "400px",
      margin: "0 auto",
    },
    title: {
      color: "#333",
      fontSize: "1.2rem",
    },
  };

  function handleSubmit(e) {
    e.preventDefault();

    const data = e.target;

    const checkIn = data.check_in.value.split("-").join("");
    const checkOut = data.check_out.value.split("-").join("");

    setLoading(true);
    const url =
      import.meta.env.VITE_URL_BASE +
      "/reservations/check-availability/" +
      checkIn +
      "-" +
      checkOut;
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
          throw new Error("Server Error");
        }

        return response.json();
      })
      .then(data => {
        setAvailability(data), setIndex(1);
      })
      .catch(e => {
        console.error(e.message);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <h4 style={customStyle.title}>Search for availability</h4>
      <form
        className={styles.form}
        style={customStyle.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.formGroup}>
          <label>
            Check-in:
            <input type="date" name="check_in" required aria-required />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            Check-out:
            <input type="date" name="check_out" required aria-required />
          </label>
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={styles.submitButton}
            disabled={loading}
            style={{ width: "180px" }}
          >
            {loading ? "Loading..." : "Search Availability"}
          </button>
        </div>
        <div>{error && error}</div>
      </form>
    </>
  );
}

CheckAvailabilityFrom.propTypes = {
  setAvailability: PropTypes.func,
  setIndex: PropTypes.func,
};

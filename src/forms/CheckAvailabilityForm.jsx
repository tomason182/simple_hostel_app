import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function CheckAvailabilityFrom({
  setReservationFormData,
  setAvailability,
  setIndex,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t } = useTranslation();

  function updateFormData(checkIn, checkOut) {
    setReservationFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "",
      phoneNumber: "",
      city: "",
      street: "",
      postalCode: "",
      countryCode: "",
      selectedRooms: [],
      bookingSource: "",
      checkIn: checkIn,
      checkOut: checkOut,
      reservationStatus: "",
      paymentStatus: "",
      specialRequest: "",
    });
  }

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

    const formData = e.target;

    const checkIn = formData.check_in.value.split("-").join("");
    const checkOut = formData.check_out.value.split("-").join("");

    if (parseInt(checkIn) >= parseInt(checkOut)) {
      setError("Invalid dates ranges");
      return false;
    }

    setLoading(true);
    setError(null);
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
      .then(async response => {
        if (response.status >= 400) {
          const error = await response.json();
          throw new Error(error.msg || "Server error");
        }

        return response.json();
      })
      .then(data => {
        if (data.status === "error") {
          setError(data.msg);
          return false;
        }
        setAvailability(data);
        updateFormData(formData.check_in.value, formData.check_out.value);
        setIndex(1);
      })
      .catch(e => {
        console.error(e.message);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <h4 style={customStyle.title}>{t("search_availability")}</h4>
      <form
        className={styles.form}
        style={customStyle.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.formGroup}>
          <label>
            {t("check_in")}:
            <input type="date" name="check_in" required aria-required />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("check_out")}:
            <input type="date" name="check_out" required aria-required />
          </label>
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={styles.submitButton}
            disabled={loading}
            style={{ width: "180px" }}
          >
            {loading ? "Loading..." : t("search")}
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </>
  );
}

CheckAvailabilityFrom.propTypes = {
  setReservationFormData: PropTypes.func,
  setAvailability: PropTypes.func,
  setIndex: PropTypes.func,
};

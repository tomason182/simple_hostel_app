import PropTypes from "prop-types";
import styles from "./defaultFormStyle.module.css";
import { useState } from "react";

export default function CancelReservationForm({
  name,
  setIsOpen,
  id,
  status = "canceled",
  refreshReservationById,
}) {
  const [loading, setLoading] = useState(false);

  function handleOnClick(id) {
    setLoading(true);
    const url =
      import.meta.env.VITE_URL_BASE +
      "/reservations/change-status/" +
      id +
      "-" +
      status;
    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    let message = "";
    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          message = {
            status: "error",
            msg: "Unable to modify reservation status",
          };
          return;
        }
        message = {
          status: "ok",
          msg: "Reservation status changed successfully",
        };
      })
      .catch(e => console.error(e.message))
      .finally(() => {
        refreshReservationById();
        setLoading(false);
        alert(message.msg);
        setIsOpen(false);
      });
  }
  return (
    <>
      <p className={styles.subtitle} style={{ margin: "0" }}>
        Mark {name} reservation {status === "canceled" ? "canceled" : "no-show"}
        ?
      </p>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          onClick={() => setIsOpen(false)}
        >
          No
        </button>
        <button
          className={styles.submitButton}
          disabled={loading}
          onClick={() => handleOnClick(id)}
        >
          {loading ? "Loading" : "Yes"}
        </button>
      </div>
    </>
  );
}

CancelReservationForm.propTypes = {
  name: PropTypes.string.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  status: PropTypes.string,
  refreshReservationById: PropTypes.func.isRequired,
};

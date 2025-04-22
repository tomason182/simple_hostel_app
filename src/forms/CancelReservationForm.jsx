import PropTypes from "prop-types";
import styles from "./defaultFormStyle.module.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

export default function CancelReservationForm({
  name,
  setIsOpen,
  id,
  status = "canceled",
  refreshReservationById,
}) {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { addToast } = useToast();

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
            msg: "RESERVATION_STATUS_CHANGE_ERROR",
          };
          return;
        }
        message = {
          status: "success",
          msg: "RESERVATION_STATUS_CHANGE",
        };
      })
      .catch(e => console.error(e.message))
      .finally(() => {
        refreshReservationById();
        setLoading(false);
        addToast({
          message: t(message.msg, { ns: "validation" }),
          type: message.status,
        });
        setIsOpen(false);
      });
  }
  return (
    <>
      <p className={styles.subtitle} style={{ margin: "0" }}>
        {status === "canceled"
          ? t("cancellation_message", { name: name })
          : t("mark_no_show_message", { name: name })}
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
          {loading ? "Loading..." : t("yes")}
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

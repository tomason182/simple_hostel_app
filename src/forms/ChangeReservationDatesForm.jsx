import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

export default function ChangeReservationsDatesForm({
  setIsOpen,
  reservation,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { addToast } = useToast();

  const { id, payment_status, reservation_status } = reservation;

  async function handleSubmit(e) {
    e.preventDefault();

    const formBody = {
      newCheckIn: e.target.check_in.value,
      newCheckOut: e.target.check_out.value,
    };

    if (new Date(formBody.newCheckIn) >= new Date(formBody.newCheckOut)) {
      alert(t("INVALID_DATES_ORDER", { ns: "validation" }));
      return;
    }

    if (reservation_status === "canceled" || reservation_status === "no_show") {
      alert(t("CHANGE_RESERVATION_DATES_POLICY", { ns: "validation" }));
      return;
    }

    if (payment_status === "paid") {
      alert(t("CANNOT_UPDATE_FULLY_PAID_RESERVATION", { ns: "validation" }));
      return;
    }

    if (reservation_status === "refunded") {
      alert(t("CANNOT_UPDATE_REFUNDED_RESERVATION", { ns: "validation" }));
      return;
    }

    if (payment_status === "partial") {
      if (
        !window.confirm(t("CHANGE_DATES_PARTIAL_PAYMENT", { ns: "validation" }))
      ) {
        return;
      }
    }

    if (reservation.payment_status === "pending") {
      if (
        !window.confirm(t("CHANGE_DATES_PENDING_PAYMENT", { ns: "validation" }))
      ) {
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      const url =
        import.meta.env.VITE_URL_BASE + "/reservations/change-date/" + id;
      const options = {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formBody),
      };

      const result = await fetch(url, options);
      if (!result.ok) {
        const error = await result.json();
        throw new Error(error.msg || "UNEXPECTED_ERROR");
      }

      addToast({
        message: t("DATES_AND_PRICE_UPDATED", { ns: "translation" }),
        status: "success",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            {t("check_in")}
            <input type="date" name="check_in" required aria-required />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            {t("check_out")}
            <input type="date" name="check_out" required aria-required />
          </label>
        </div>
      </div>
      {error && (
        <p className={styles.error}>{t(error, { ns: "validation" })}</p>
      )}
      <div className={styles.message}>
        <h4 className={styles.important}>{t("important")}</h4>
        <p style={{ fontSize: "14px" }}>{t("change_rates_message")}</p>
        <ul>
          <li>{t("change_rates_pending")}</li>
          <li>{t("change_rates_partial")}</li>
          <li>{t("change_rates_paid")}</li>
        </ul>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          onClick={() => setIsOpen(false)}
        >
          {t("cancel")}
        </button>
        <button className={styles.submitButton} disabled={loading}>
          {loading ? "Loading..." : t("save")}
        </button>
      </div>
    </form>
  );
}

ChangeReservationsDatesForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
};

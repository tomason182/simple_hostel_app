import PropTypes from "prop-types";
import styles from "./defaultFormStyle.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../components/Spinner/Spinner";
import { useToast } from "../hooks/useToast";

export default function EditReservationPrices({
  reservationData,
  roomTypes,
  setIsOpen,
  refreshReservationById,
}) {
  const [formData, setFormData] = useState({});
  const [manualDeposit, setManualDeposit] = useState(null);
  const [advancePaymentPolicy, setAdvancePaymentPolicy] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { addToast } = useToast();

  useEffect(() => {
    if (reservationData && Array.isArray(reservationData.selected_rooms)) {
      const roomData = reservationData.selected_rooms.reduce((acc, room) => {
        acc[room.room_type_id] = room.total_amount;
        return acc;
      }, {});

      if (reservationData.payment_status !== "pending") {
        setManualDeposit(reservationData.advance_payment_amount);
      }

      setFormData(prev => ({
        ...prev,
        ...roomData,
      }));
    }
  }, [reservationData]);

  useEffect(() => {
    const propertyId = reservationData.property_id;
    const url =
      import.meta.env.VITE_URL_BASE +
      "/data-provider/properties/advance-payment-policy/" +
      propertyId;
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    setLoading(true);
    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("UNEXPECTED_ERROR");
        }
        return response.json();
      })
      .then(data => setAdvancePaymentPolicy(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [reservationData]);

  const computedTotal = Object.values(formData).reduce(
    (acc, val) => acc + Number(val),
    0
  );

  const computedDeposit =
    advancePaymentPolicy.advance_payment_required === 0
      ? 0
      : Math.round(
          computedTotal * Number(advancePaymentPolicy.deposit_amount || 0) * 100
        ) / 100;

  const depositToDisplay =
    manualDeposit !== null ? manualDeposit : computedDeposit;

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function findRoomTypeDescription(id) {
    const roomType = roomTypes.find(room => room.id === id);
    return roomType?.description;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    const reservationId = reservationData.id;

    if (reservationId) {
      const url =
        import.meta.env.VITE_URL_BASE +
        "/reservations/change-prices/" +
        reservationId;
      const options = {
        mode: "cors",
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      };

      fetch(url, options)
        .then(response => {
          if (response.status >= 400) {
            throw new Error("UNEXPECTED_ERROR");
          }
          addToast({
            message: t("RESERVATION_PRICES_UPDATED", { ns: "validation" }),
            type: "success",
          });
        })
        .catch(err =>
          addToast({
            message: t(err.message, { ns: "validation" }),
            type: "error",
          })
        )
        .finally(() => {
          refreshReservationById();
          setIsOpen(false);
        });
    }
  }

  if (loading) return <Spinner />;
  if (error) return <p>{t(error)}</p>;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {reservationData.selected_rooms.map(room => (
        <div key={room.room_type_id} className={styles.formGroup}>
          <label className={styles.labelFlex}>
            {`${room.number_of_rooms} * ${findRoomTypeDescription(
              room.room_type_id
            )}`}
            <input
              type="number"
              className={styles.inputMedium}
              name={room.room_type_id.toString()}
              value={formData[room.room_type_id] ?? ""}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          <span>Total</span>
          <input
            type="text"
            disabled={true}
            name="total"
            className={styles.inputMedium}
            value={computedTotal}
            readOnly
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.labelFlex}>
          Deposit
          <input
            type="number"
            className={styles.inputMedium}
            name="deposit"
            value={depositToDisplay}
            onChange={e => {
              const value = Number(e.target.value);
              setManualDeposit(value);
            }}
          />
        </label>
      </div>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
        <button className={styles.submitButton}>Submit</button>
      </div>
    </form>
  );
}

EditReservationPrices.propTypes = {
  reservationData: PropTypes.object.isRequired,
  roomTypes: PropTypes.object.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  refreshReservationById: PropTypes.func.isRequired,
};

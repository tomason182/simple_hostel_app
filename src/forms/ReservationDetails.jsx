import PropTypes from "prop-types";
import styles from "./defaultFormStyle.module.css";
import { useTranslation } from "react-i18next";

export default function ReservationDetails({
  data,
  setData,
  availability,
  setIndex,
  setLoading,
  setError,
  refreshReservationsData,
}) {
  const { t } = useTranslation();

  function findDescription(id) {
    const room = availability.roomList.find(room => room.id === parseInt(id));
    return room.description || "";
  }

  const depositPercentage =
    availability.paymentPolicies.advance_payment_required === 1
      ? availability.paymentPolicies.deposit_amount
      : 0;
  const totalPriceCalculation = data.selectedRooms.reduce(
    (acc, value) => acc + value.total_amount,
    0
  );

  const depositAmount = totalPriceCalculation * depositPercentage;
  const payOnArrival = totalPriceCalculation - depositAmount;

  const currency = availability.currencies.base_currency;

  function dateTimeFormat(date) {
    const [year, month, day] = date.split("-");
    const formattedDate = new Date(year, month - 1, day);
    const lang = navigator.language || "en";

    const options = {
      weekend: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Intl.DateTimeFormat(lang, options).format(formattedDate);
  }

  function removeEmptyFields(obj) {
    return Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(obj).filter(([_, value]) => value !== "")
    );
  }

  function submitFormData() {
    setLoading(true);
    setIndex(4);

    const formBody = removeEmptyFields(data);
    formBody.currency = currency;

    const url = import.meta.env.VITE_URL_BASE + "/reservations/new";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formBody),
    };

    fetch(url, options)
      .then(async response => {
        if (response.status === 400) {
          const errors = await response.json();
          console.error(errors);
          throw Error("Invalid fields");
        }
        if (response.status > 400) {
          throw new Error("Server error. Unable to create reservation");
        }

        return response.json();
      })
      .then(data => {
        if (data.status === "error") {
          setError(data.msg);
        } else {
          setData(prev => ({
            ...prev,
            id: data.msg.id,
          }));
        }
      })
      .catch(e => setError(e.message))
      .finally(() => {
        setLoading(false);
        refreshReservationsData();
      });
  }

  return (
    <>
      <table className={styles.reservationDetailsTable}>
        <caption>{t("reservation_details")}</caption>
        <tbody>
          <tr>
            <th>{t("first_name")}</th>
            <td>
              {data.firstName} {data.lastName}
            </td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{data.email}</td>
          </tr>
          <tr>
            <th>{t("check_in")}</th>
            <td>{dateTimeFormat(data.checkIn)}</td>
          </tr>
          <tr>
            <th>{t("check_out")}</th>
            <td>{dateTimeFormat(data.checkOut)}</td>
          </tr>
          <tr>
            <th>{t("total_nights")}</th>
            <td>{availability.totalNights}</td>
          </tr>
          <tr>
            <th>{t("booking_source")}</th>
            <td>{data.bookingSource}</td>
          </tr>
          <tr>
            <th colSpan={2} style={{ textAlign: "center", height: "50px" }}>
              {t("selected_rooms")}
            </th>
          </tr>
          {data.selectedRooms.map(room => (
            <tr key={room.room_type_id}>
              <th>
                {room.number_of_rooms} * {findDescription(room.room_type_id)}{" "}
              </th>
              <td>
                {currency} {room.total_amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <table className={styles.reservationDetailsTable}>
        <caption>{t("price_details")}</caption>
        <tbody>
          {data.bookingSource === "direct" ? (
            <>
              <tr>
                <th>
                  {t("deposit")} ({depositPercentage * 100} %)
                </th>
                <td>
                  {currency} {depositAmount}
                </td>
              </tr>
              <tr>
                <th>{t("to_pay_on_arrival")}</th>
                <td>
                  {currency} {payOnArrival}
                </td>
              </tr>
            </>
          ) : (
            ""
          )}

          <tr>
            <th>Total</th>
            <td>
              {currency} {totalPriceCalculation}
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          onClick={() => {
            setIndex(2);
          }}
        >
          {t("back")}
        </button>
        <button
          className={styles.submitButton}
          onClick={() => submitFormData()}
        >
          {t("confirm_reservation")}
        </button>
      </div>
    </>
  );
}

ReservationDetails.propTypes = {
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  availability: PropTypes.array.isRequired,
  setIndex: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  refreshReservationsData: PropTypes.func.isRequired,
};

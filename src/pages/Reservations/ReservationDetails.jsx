import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import styles from "./ReservationDetails.module.css";

export default function ReservationDetails({ id }) {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toggle, setToggle] = useState("reservation");

  useEffect(() => {
    const mockedReservation = {
      reservation_id: 1,
      guest_id: 34,
      property_id: 4,
      room_type_id: 7,
      booking_source: "website",
      number_of_guest: 2,
      total_price: 243,
      currency: "USD",
      advanced_payment: 133,
      advanced_payment_status: "paid",
      reservation_status: "confirmed",
      payment_status: "partial",
      check_in: "2025-02-16",
      check_out: "2025-02-19",
      special_request: "late check in. After 9 PM",
      reservation_created_at: "2025-02-10 14:30:00",
      reservation_updated_at: "2025-02-11 09:15:00",
      first_name: "Samanta",
      last_name: "Clark",
      id_number: "123456",
      email: "guest@email.com",
      phone_number: "",
      street: "La Loma del Culo 123",
      city: "The capital",
      country_code: "AR",
      room_type_description: "6 bed max dormitory",
    };

    setReservationData(mockedReservation);
    setLoading(false);
  }, [setReservationData]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.switchContainer}>
        <div className={styles.switchTrack}>
          <div
            className={`${styles.switchIndicator} ${
              toggle === "guest" ? styles.moveRight : ""
            } `}
          />
          <button
            className={`${styles.switchButton} ${
              toggle === "reservation" ? styles.active : ""
            }`}
            onClick={() => setToggle("reservation")}
          >
            Reservation Info
          </button>
          <button
            className={`${styles.switchButton} ${
              toggle === "guest" ? styles.active : ""
            }`}
            onClick={() => setToggle("guest")}
          >
            Guest Info
          </button>
        </div>
      </div>
      <div className={styles.infoContainer}>
        {toggle === "reservation" ? (
          <ReservationInfo
            loading={loading}
            error={error}
            reservationData={reservationData}
          />
        ) : (
          <GuestInfo
            loading={loading}
            error={error}
            reservationData={reservationData}
          />
        )}
      </div>
    </div>
  );
}

function ReservationInfo({ loading, error, reservationData }) {
  if (loading) return <Spinner />;

  if (error) return <div>Error fetching reservation data</div>;

  const fullName = reservationData.first_name + " " + reservationData.last_name;
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const arrivalDate = new Date(
    reservationData.check_in.split("-")
  ).toLocaleDateString("es", options);

  const departureDate = new Date(
    reservationData.check_out.split("-")
  ).toLocaleDateString("es", options);

  return (
    <>
      <h3>{fullName}</h3>
      {/* General Reservation details */}
      <table className={styles.infoTable}>
        <tbody>
          <tr>
            <th>Arrival</th>
            <td>{arrivalDate}</td>
          </tr>
          <tr>
            <th>Departure</th>
            <td>{departureDate}</td>
          </tr>
          <tr>
            <th>Room Type</th>
            <td>{reservationData.room_type_description}</td>
          </tr>
          <tr>
            <th>Reservation Status</th>
            <td>{reservationData.reservation_status}</td>
          </tr>
          <tr>
            <th>Number of guest</th>
            <td>{reservationData.number_of_guest}</td>
          </tr>
          <tr>
            <th>Booking source</th>
            <td>{reservationData.booking_source}</td>
          </tr>

          {reservationData.special_request !== "" && (
            <tr>
              <th>Special request</th>
              <td>{reservationData.special_request}</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Payment information */}
      <h4>Payment Details</h4>
      <table className={styles.paymentTable}>
        <tbody>
          <tr>
            <th>Total price</th>
            <td>$ {reservationData.total_price}</td>
          </tr>
          <tr>
            <th>Payment status</th>
            <td>{reservationData.payment_status}</td>
          </tr>
          <tr>
            <th>Advance payment</th>
            <td>$ {reservationData.advanced_payment}</td>
          </tr>
          <tr>
            <th>Advance payment status</th>
            <td>{reservationData.advanced_payment_status}</td>
          </tr>
          <tr className={styles.highlightRow}>
            <th>Remaining balance</th>
            <td>
              $ {reservationData.total_price - reservationData.advanced_payment}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function GuestInfo({ loading, error, reservationData }) {
  if (loading) return <Spinner />;

  if (error) return <div>Error fetching reservation data</div>;

  const fullName = reservationData.first_name + " " + reservationData.last_name;

  return (
    <>
      <h1>{fullName}</h1>
      <table className={styles.infoTable}>
        <tbody>
          <tr>
            <th>ID or Passport number</th>
            <td>{reservationData.id_number}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{reservationData.email}</td>
          </tr>
          <tr>
            <th>Phone number</th>
            <td>{reservationData.phone_number}</td>
          </tr>
          <tr>
            <th>Country</th>
            <td>{reservationData.country_code}</td>
          </tr>
          <tr>
            <th>City</th>
            <td>{reservationData.city}</td>
          </tr>
          <tr>
            <th>Street</th>
            <td>{reservationData.street}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

ReservationDetails.propTypes = {
  id: PropTypes.number.isRequired,
};

ReservationInfo.propTypes = {
  reservationData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

GuestInfo.propTypes = {
  reservationData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

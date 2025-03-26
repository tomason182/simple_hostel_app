import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./ReservationDetails.module.css";
import SecondaryTabs from "../../../components/Tabs/SecondaryTabs";

// Forms
import ChangeReservationsDatesForm from "../../../forms/ChangeReservationDatesForm";

export default function ReservationDetails({ id }) {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const tabs = [
    {
      label: "Reservation Info",
      content: (
        <ReservationInfo
          loading={loading}
          error={error}
          reservationData={reservationData}
        />
      ),
    },
    {
      label: "Guest Info",
      content: (
        <GuestInfo
          loading={loading}
          error={error}
          reservationData={reservationData}
        />
      ),
    },
    {
      label: "Payment Details",
      content: (
        <PaymentDetails
          loading={loading}
          error={error}
          reservationData={reservationData}
        />
      ),
    },
  ];

  return (
    <div className={styles.infoContainer}>
      <h3>Reservation Details</h3>
      <SecondaryTabs tabs={tabs} />
    </div>
  );
}

function ReservationInfo({ loading, error, reservationData }) {
  const [index, setIndex] = useState(1);

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

  if (index === 0) return <ChangeReservationsDatesForm setIndex={setIndex} />;

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
      <div className={styles.controlPanel}>
        <h5>Update this reservation</h5>
        <button>Cancel Reservation</button>
        <button>Mark reservation as no-show</button>
        <button onClick={() => setIndex(0)}>Change dates</button>
      </div>
    </>
  );
}

function GuestInfo({ loading, error, reservationData }) {
  if (loading) return <Spinner />;

  if (error) return <div>Error fetching reservation data</div>;

  const fullName = reservationData.first_name + " " + reservationData.last_name;

  return (
    <>
      <h3>{fullName}</h3>
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
      <div className={styles.controlPanel}>
        <h5>Update Guest</h5>
        <button>Update guest info</button>
      </div>
    </>
  );
}

function PaymentDetails({ reservationData, loading, error }) {
  if (loading) return <Spinner />;

  if (error) return <div>Error fetching reservation data</div>;
  return (
    <>
      {/* Payment information */}
      <h3>Payment Details</h3>
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

ReservationDetails.propTypes = {
  id: PropTypes.number.isRequired,
};

ReservationInfo.propTypes = {
  reservationData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

GuestInfo.propTypes = {
  reservationData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

PaymentDetails.propTypes = {
  reservationData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

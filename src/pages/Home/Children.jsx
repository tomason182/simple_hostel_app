import Spinner from "../../components/Spinner/Spinner";
import { format } from "date-fns";
import PropTypes from "prop-types";
import styles from "./Children.module.css";
import {
  dateFormatHelper,
  formateDateToLocale,
} from "../../utils/dateFormatHelper";

import { useNavigate } from "react-router";

export function ReservationsList({ data, error, loading, info }) {
  const navigate = useNavigate();

  function onReservationClick(id) {
    const url = "/reservations/" + id;
    return navigate(url);
  }

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <h1>Error</h1>;
  }

  const today = format(new Date(), "yyyyMMdd");

  let filteredData;

  if (info.type === "coming") {
    filteredData = data.filter(d => {
      const checkIn = dateFormatHelper(d.check_in);
      return (
        checkIn === today &&
        (d.reservation_status === "confirmed" ||
          d.reservation_status === "provisional")
      );
    });
  } else if (info.type === "leaving") {
    filteredData = data.filter(d => {
      const checkOut = dateFormatHelper(d.check_out);
      return (
        checkOut === today &&
        (d.reservation_status === "confirmed" ||
          d.reservation_status === "provisional")
      );
    });
  } else {
    filteredData = data;
  }

  const reservationsList =
    filteredData.length === 0 ? (
      <li>{info.message}</li>
    ) : (
      filteredData.map(d => (
        <li
          key={d.id}
          onClick={() => {
            onReservationClick(d.id);
          }}
        >
          <p>
            {d.first_name} {d.last_name}
          </p>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formateDateToLocale(d.check_in)} |{" "}
            {formateDateToLocale(d.check_out)}
          </span>
        </li>
      ))
    );

  return <ul className={styles.list}>{reservationsList}</ul>;
}

// Esta function parece no estar en uso
export function ReservationDetails({ loading, error, data }) {
  if (loading) return <Spinner />;
  if (error) return <h3>Error fetching reservation data</h3>;

  const reservation = data.reservation;
  const checkIn = formateDateToLocale(reservation.check_in);
  const checkOut = formateDateToLocale(reservation.check_out);

  return (
    <div className={styles.content}>
      <ul>
        <li>
          <span>Check-in:</span>
          <span>{checkIn}</span>
        </li>
        <li>
          <span>Check-out:</span>
          <span>{checkOut}</span>
        </li>
        <li>
          <span>Booking Source:</span>
          <span>{reservation.booking_source}</span>
        </li>
        <li>
          <span>Reservation Status:</span>
          <span>{reservation.reservation_status}</span>
        </li>
        <li>
          <span>Payment Status:</span>
          <span>{reservation.payment_status}</span>
        </li>
        <li>
          <span>Special Request:</span>
          <span>{reservation.special_request}</span>
        </li>
      </ul>
      <button>Edit</button>
    </div>
  );
}

ReservationsList.propTypes = {
  data: PropTypes.array.isRequired,
  error: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  info: PropTypes.object.isRequired,
};

ReservationDetails.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

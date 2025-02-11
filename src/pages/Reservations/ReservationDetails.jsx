import PropTypes from "prop-types";
import { useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import styles from "./ReservationDetails.module.css";

export default function ReservationDetails({ id }) {
  const [guestData, setGuestData] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toggle, setToggle] = useState("reservation");

  if (error) return <div>Error fetching reservation data</div>;

  if (loading) return <Spinner />;

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
          <h1>Reservation Information</h1>
        ) : (
          <h1>Guest Information</h1>
        )}
      </div>
    </div>
  );
}

ReservationDetails.propTypes = {
  id: PropTypes.number.isRequired,
};

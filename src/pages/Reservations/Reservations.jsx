import { useState } from "react";
import styles from "./Reservations.module.css";
import ReservationDetails from "./components/ReservationDetails";
import Spinner from "../../components/Spinner/Spinner";
import { formateDateToLocale } from "../../utils/dateFormatHelper";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showReservation, setShowReservation] = useState({
    status: false,
    id: 0,
  });

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    const from = e.target.from.value;
    const until = e.target.until.value;

    const fromFormatted = from.split("-").join("");
    const untilFormatted = until.split("-").join("");

    const url =
      import.meta.env.VITE_URL_BASE +
      "/reservations/find-by-range/" +
      fromFormatted +
      "-" +
      untilFormatted;
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error");
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "error") {
          setError(data.msg);
          return;
        }

        if (Array.isArray(data.msg) && data.msg.length === 0) {
          setError("No reservations found");
          return;
        }
        setReservations(data.msg);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const list = reservations.map(r => {
    const checkIn = formateDateToLocale(r.check_in);
    const checkOut = formateDateToLocale(r.check_out);

    return (
      <li
        key={r.id}
        onClick={() => setShowReservation({ status: true, id: r.id })}
      >
        <p className={styles.fullName}>{r.guest_info.full_name}</p>
        <p className={styles.dates}>{checkIn}</p>
        <p className={styles.dates}>{checkOut}</p>
        <p className={styles.price}>{r.reservation_status}</p>
      </li>
    );
  });

  if (showReservation.status === true)
    return <ReservationDetails id={showReservation.id} />;

  return (
    <div className={styles.content}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          From
          <input type="date" name="from" required aria-required />
        </label>
        <label>
          Until
          <input type="date" name="until" required aria-required />
        </label>
        <label>
          Search
          <input type="text" name="search" />
        </label>
        <button type="submit">Search</button>
      </form>

      <ul className={styles.reservationsList}>
        {loading ? <Spinner /> : error ? <h3>{error}</h3> : list}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import styles from "./Reservations.module.css";
import Modal from "../../components/Modal/Modal";
import ReservationDetails from "./components/ReservationDetails";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  // Modal states
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const reservationsList = [
      {
        id: 1,
        property_id: 1,
        booking_source: "booking.com",
        currency: "USD",
        guest_info: {
          full_name: "Larry Clark",
        },
        check_in: "2025-02-03",
        check_out: "2025-02-07",
        number_of_guest: 2,
        total_price: 48,
        reservation_status: "confirmed",
        payment_status: "partial",
        assigned_beds: [10, 11],
        special_request: "",
        created_by: "",
        updated_by: "",
        create_at: "",
        updated_at: "",
      },
      {
        id: 2,
        property_id: 1,
        booking_source: "booking.com",
        currency: "USD",
        guest_info: {
          full_name: "Sophia Martinez",
        },
        check_in: "2025-02-05",
        check_out: "2025-02-09",
        number_of_guest: 1,
        total_price: 75,
        reservation_status: "confirmed",
        payment_status: "partial",
        assigned_beds: [12],
        special_request: "",
        created_by: "",
        updated_by: "",
        create_at: "",
        updated_at: "",
      },
      {
        id: 3,
        property_id: 1,
        booking_source: "website",
        currency: "USD",
        guest_info: {
          full_name: "Michael Johnson",
        },
        check_in: "2025-02-05",
        check_out: "2025-02-07",
        number_of_guest: 3,
        total_price: 125,
        reservation_status: "confirmed",
        payment_status: "partial",
        assigned_beds: [15, 16, 17],
        special_request: "",
        created_by: "",
        updated_by: "",
        create_at: "",
        updated_at: "",
      },
      {
        id: 4,
        property_id: 1,
        booking_source: "website",
        currency: "USD",
        guest_info: {
          full_name: "Emma Thompson",
        },
        check_in: "2025-02-05",
        check_out: "2025-02-12",
        number_of_guest: 2,
        total_price: 86,
        reservation_status: "confirmed",
        payment_status: "partial",
        assigned_beds: [19],
        special_request: "",
        created_by: "",
        updated_by: "",
        create_at: "",
        updated_at: "",
      },
      {
        id: 5,
        property_id: 1,
        booking_source: "website",
        currency: "USD",
        guest_info: {
          full_name: "Daniel Rivera",
        },
        check_in: "2025-02-05",
        check_out: "2025-02-06",
        number_of_guest: 1,
        total_price: 12,
        reservation_status: "confirmed",
        payment_status: "partial",
        assigned_beds: [20],
        special_request: "",
        created_by: "",
        updated_by: "",
        create_at: "",
        updated_at: "",
      },
    ];

    setReservations(reservationsList);
  }, []);

  const list = reservations.map(r => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const price = Number.parseFloat(r.total_price).toFixed(2);
    const checkIn = new Date(r.check_in.split("-")).toLocaleDateString(
      undefined,
      options
    );
    const checkOut = new Date(r.check_out.split("-")).toLocaleDateString(
      undefined,
      options
    );

    return (
      <li key={r.id} onClick={() => setIsOpen(true)}>
        <p className={styles.fullName}>{r.guest_info.full_name}</p>
        <p className={styles.dates}>{checkIn}</p>
        <p className={styles.dates}>{checkOut}</p>
        <p className={styles.price}>
          <span>{r.currency}</span>&nbsp;
          {price}
        </p>
      </li>
    );
  });

  return (
    <div className={styles.content}>
      <form className={styles.form}>
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

      <ul className={styles.reservationsList}>{list}</ul>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ReservationDetails id={1} />
      </Modal>
    </div>
  );
}

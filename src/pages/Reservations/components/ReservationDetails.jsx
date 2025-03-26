import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./ReservationDetails.module.css";
import Modal from "../../../components/Modal/Modal";

// Forms
import ChangeReservationsDatesForm from "../../../forms/ChangeReservationDatesForm";
import UpdateGuestInformation from "../../../forms/UpdateGuestInformation";

export default function ReservationDetails({ id }) {
  const [activeTab, setActiveTab] = useState(0);
  const [index, setIndex] = useState(0);
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Modal state */
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mockedReservation = {
      reservation_id: 1,
      guest_id: 34,
      booking_source: "website",
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
          setIsOpen={setIsOpen}
          setIndex={setIndex}
          reservationData={reservationData}
        />
      ),
    },
    {
      label: "Guest Info",
      content: (
        <GuestInfo
          setIsOpen={setIsOpen}
          setIndex={setIndex}
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

  const forms = [
    {
      header: "Change reservation date",
      content: <ChangeReservationsDatesForm setIsOpen={setIsOpen} />,
    },
    {
      header: "Cancel reservation",
      content: <h1>Cancel reservation?</h1>,
    },
    {
      header: "Mark reservation as no-show",
      content: <h1>Mark reservation as no show?</h1>,
    },
    {
      header: "Update guest information",
      content: <UpdateGuestInformation setIsOpen={setIsOpen} />,
    },
  ];

  if (loading) return <Spinner />;

  if (error) return <div>Error fetching reservation data</div>;

  const fullName = reservationData?.first_name + reservationData?.last_name;
  return (
    <div className={styles.mainContainer}>
      <h3>{fullName}</h3>
      <div className={styles.header}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.headerButton} ${
              index === activeTab ? styles.activeTabBtn : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.content}>{tabs[activeTab].content}</div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        header={forms[index].header}
        display={index === 3 ? "fixed" : "center"}
      >
        {forms[index].content}
      </Modal>
    </div>
  );
}

function ReservationInfo({ reservationData, setIsOpen, setIndex }) {
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
      <div className={styles.leftContent}>
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
      </div>

      <div className={styles.controlPanel}>
        <h5>Update this reservation</h5>
        <button
          onClick={() => {
            setIndex(1), setIsOpen(true);
          }}
        >
          Cancel Reservation
        </button>
        <button
          onClick={() => {
            setIndex(2), setIsOpen(true);
          }}
        >
          Mark reservation as no-show
        </button>
        <button
          onClick={() => {
            setIndex(0), setIsOpen(true);
          }}
        >
          Change dates
        </button>
      </div>
    </>
  );
}

function GuestInfo({ reservationData, setIndex, setIsOpen }) {
  return (
    <>
      <div className={styles.leftContent}>
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
      </div>
      <div className={styles.controlPanel}>
        <h5>Update Guest</h5>
        <button
          onClick={() => {
            setIndex(3), setIsOpen(true);
          }}
        >
          Update guest info
        </button>
      </div>
    </>
  );
}

function PaymentDetails({ reservationData }) {
  return (
    <>
      <div className={styles.leftContent}>
        {/* Payment information */}
        <h3>Payment Details</h3>
        <table className={styles.infoTable}>
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
                ${" "}
                {reservationData.total_price - reservationData.advanced_payment}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.controlPanel}>
        <h5>Update this reservation</h5>
        <button>Cancel Reservation</button>
        <button>Mark reservation as no-show</button>
        <button>Change dates</button>
      </div>
    </>
  );
}

ReservationDetails.propTypes = {
  id: PropTypes.number.isRequired,
};

ReservationInfo.propTypes = {
  reservationData: PropTypes.object.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  setIndex: PropTypes.func.isRequired,
};

GuestInfo.propTypes = {
  reservationData: PropTypes.object.isRequired,
  setIndex: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

PaymentDetails.propTypes = {
  reservationData: PropTypes.object.isRequired,
};

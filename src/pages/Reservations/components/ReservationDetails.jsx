import PropTypes from "prop-types";
import { useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./ReservationDetails.module.css";
import Modal from "../../../components/Modal/Modal";

// Helpers
import { formateDateToLocale } from "../../../utils/dateFormatHelper";

// Data provider
import { useFetchReservationById } from "../../../data_providers/reservationDataProvider";

// Forms
import ChangeReservationsDatesForm from "../../../forms/ChangeReservationDatesForm";
import UpdateGuestInformation from "../../../forms/UpdateGuestInformation";

export default function ReservationDetails({ id }) {
  const [activeTab, setActiveTab] = useState(0);
  const [index, setIndex] = useState(0);
  /* Modal state */
  const [isOpen, setIsOpen] = useState(false);

  const { reservation, loading, error } = useFetchReservationById(id);

  console.log(reservation);

  if (loading) return <Spinner />;

  if (error) return <div>Error fetching reservation data</div>;

  const totalPrice = reservation.reservation.selected_rooms.reduce(
    (acc, room) => acc + Number(room.total_amount),
    0
  );

  const tabs = [
    {
      label: "Reservation Info",
      content: (
        <ReservationInfo
          setIsOpen={setIsOpen}
          setIndex={setIndex}
          reservationData={reservation.reservation}
        />
      ),
    },
    {
      label: "Guest Info",
      content: (
        <GuestInfo
          setIsOpen={setIsOpen}
          setIndex={setIndex}
          guestData={reservation.guest}
        />
      ),
    },
    {
      label: "Payment Details",
      content: (
        <PaymentDetails
          loading={loading}
          error={error}
          reservationData={reservation.reservation}
          totalPrice={totalPrice}
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

  const fullName = reservation.guest?.first_name + reservation.guest?.last_name;
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
  const arrivalDate = formateDateToLocale(reservationData.check_in);
  const departureDate = formateDateToLocale(reservationData.check_out);

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
              <th colSpan={2} style={{ textAlign: "center" }}>
                Selected rooms
              </th>
            </tr>
            {reservationData.selected_rooms.map((room, index) => (
              <tr key={room.room_type_id}>
                <th>Room {index + 1}</th>
                <td>
                  {room.number_of_rooms} * {room.room_type_id}
                </td>
              </tr>
            ))}
            <tr>
              <th>Reservation Status</th>
              <td>{reservationData.reservation_status}</td>
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

function GuestInfo({ guestData, setIndex, setIsOpen }) {
  return (
    <>
      <div className={styles.leftContent}>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <th>ID or Passport number</th>
              <td>{guestData.id_number}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{guestData.contact_info.email}</td>
            </tr>
            <tr>
              <th>Phone number</th>
              <td>{guestData.contact_info.phone_number}</td>
            </tr>
            <tr>
              <th>Country</th>
              <td>{guestData.address.country_code}</td>
            </tr>
            <tr>
              <th>City</th>
              <td>{guestData.address.city}</td>
            </tr>
            <tr>
              <th>Street</th>
              <td>{guestData.address.street}</td>
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

function PaymentDetails({ reservationData, totalPrice }) {
  const advancePaymentAmount = Number(reservationData.advance_payment_amount);
  const remainingBalance = totalPrice - advancePaymentAmount;

  return (
    <>
      <div className={styles.leftContent}>
        {/* Payment information */}
        <h3>Payment Details</h3>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <th>Total price</th>
              <td>$ {totalPrice}</td>
            </tr>
            <tr>
              <th>Advance payment</th>
              <td>
                $ {advancePaymentAmount}{" "}
                <span className={styles.status}>
                  {reservationData.advance_payment_status}
                </span>
              </td>
            </tr>
            <tr className={styles.highlightRow}>
              <th>Remaining balance</th>
              <td>
                $ {remainingBalance}{" "}
                <span className={styles.status}>
                  {reservationData.payment_status}
                </span>
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
  guestData: PropTypes.object.isRequired,
  setIndex: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

PaymentDetails.propTypes = {
  reservationData: PropTypes.object.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

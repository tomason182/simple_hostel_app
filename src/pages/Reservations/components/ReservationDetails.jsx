import PropTypes from "prop-types";
import { useState, useContext, useEffect } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./ReservationDetails.module.css";
import Modal from "../../../components/Modal/Modal";
import { RoomTypeContext } from "../../../data_providers/RoomTypesDataProvider";

// Helpers
import { formateDateToLocale } from "../../../utils/dateFormatHelper";

// Data provider
import { useFetchReservationById } from "../../../data_providers/reservationDataProvider";

// Forms
import ChangeReservationsDatesForm from "../../../forms/ChangeReservationDatesForm";
import UpdateGuestInformation from "../../../forms/UpdateGuestInformation";
import CancelReservationForm from "../../../forms/CancelReservationForm";

export default function ReservationDetails({ id }) {
  const [activeTab, setActiveTab] = useState(0);
  const [index, setIndex] = useState(0);
  /* Modal state */
  const [isOpen, setIsOpen] = useState(false);

  const { roomTypes, isLoading } = useContext(RoomTypeContext);

  const { reservation, loading, error, refreshReservationById } =
    useFetchReservationById(id);

  if (loading || isLoading) return <Spinner />;

  if (error) return <div>Error fetching reservation data</div>;

  const totalPrice = reservation.reservation.selected_rooms
    .reduce((acc, room) => acc + Number(room.total_amount), 0)
    .toFixed(2);

  const tabs = [
    {
      label: "Reservation Info",
      content: (
        <ReservationInfo
          setIsOpen={setIsOpen}
          setIndex={setIndex}
          reservationData={reservation.reservation}
          roomTypes={roomTypes}
          refreshData={refreshReservationById}
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
          reservationData={reservation.reservation}
          totalPrice={totalPrice}
          roomTypes={roomTypes}
          refreshData={refreshReservationById}
        />
      ),
    },
  ];

  const fullName =
    reservation.guest?.first_name + " " + reservation.guest?.last_name;

  const forms = [
    {
      header: "Change reservation date",
      content: <ChangeReservationsDatesForm setIsOpen={setIsOpen} />,
    },
    {
      header: "Cancel reservation",
      content: (
        <CancelReservationForm
          name={fullName}
          setIsOpen={setIsOpen}
          id={id}
          status="canceled"
          refreshReservationById={refreshReservationById}
        />
      ),
    },
    {
      header: "Mark reservation as no-show",
      content: (
        <CancelReservationForm
          name={fullName}
          setIsOpen={setIsOpen}
          id={id}
          status="no_show"
          refreshReservationById={refreshReservationById}
        />
      ),
    },
    {
      header: "Update guest information",
      content: (
        <UpdateGuestInformation
          setIsOpen={setIsOpen}
          guestData={reservation.guest}
          refreshData={refreshReservationById}
        />
      ),
    },
  ];

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

function ReservationInfo({
  reservationData,
  roomTypes,
  setIsOpen,
  setIndex,
  refreshData,
}) {
  const [reservationStatus, setReservationStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const arrivalDate = formateDateToLocale(reservationData.check_in);
  const departureDate = formateDateToLocale(reservationData.check_out);

  useEffect(() => {
    setReservationStatus(reservationData.reservation_status);
  }, [reservationData]);

  function findRoomTypeDescription(id) {
    const roomType = roomTypes.find(room => room.id === id);
    return roomType.description;
  }

  function handleChange(e) {
    const url =
      import.meta.env.VITE_URL_BASE +
      "/reservations/change-status/" +
      reservationData.id +
      "-" +
      e.target.value;

    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Unable to update payment status. Server Error");
        }

        alert("Payment status updated successfully");
        refreshData();
      })
      .catch(e => alert(e.message))
      .finally(() => setLoading(false));
  }
  return (
    <>
      <div className={styles.leftContent}>
        {/* General Reservation details */}
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <th>Status</th>
              <td>
                <span className={styles.status}>
                  {reservationData.reservation_status}
                </span>
              </td>
            </tr>
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
                  {room.number_of_rooms} *{" "}
                  {findRoomTypeDescription(room.room_type_id)}
                </td>
              </tr>
            ))}
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
            setIndex(1);
            setIsOpen(true);
          }}
          disabled={loading}
        >
          Cancel Reservation
        </button>
        <button
          onClick={() => {
            setIndex(2);
            setIsOpen(true);
          }}
          disabled={loading}
        >
          Mark reservation as no-show
        </button>
        <button
          onClick={() => {
            setIndex(0);
            setIsOpen(true);
          }}
          disabled={loading}
        >
          Change dates
        </button>
        <br />
        <span style={{ fontSize: "12px", color: "#000", marginBottom: "10px" }}>
          -- Change payment status --
        </span>
        <select
          name="reservationStatus"
          value={reservationStatus}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="canceled">Canceled</option>
          <option value="no_show">No-show</option>
          <option value="provisional">Provisional</option>
          <option value="confirmed">Confirmed</option>
        </select>
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

function PaymentDetails({
  reservationData,
  totalPrice,
  roomTypes,
  refreshData,
}) {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPaymentStatus(reservationData.payment_status || "");
  }, [reservationData]);

  const advancePaymentAmount = Number(
    reservationData.advance_payment_amount
  ).toFixed(2);
  const remainingBalance = totalPrice - advancePaymentAmount;

  function findRoomTypeDescription(id) {
    const roomType = roomTypes.find(room => room.id === id);
    return roomType.description;
  }

  function handlePaymentStatusChange(e) {
    const url =
      import.meta.env.VITE_URL_BASE +
      "/reservations/change-payment-status/" +
      reservationData.id +
      "-" +
      e.target.value;

    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Unable to update payment status. Server Error");
        }

        alert("Payment status updated successfully");
        refreshData();
      })
      .catch(e => alert(e.message))
      .finally(() => setLoading(false));
  }

  let status = "";
  let advancePayStatus = "";

  switch (paymentStatus) {
    case "pending":
      status = "Pending";
      advancePayStatus = "Pending";
      break;
    case "partial":
      status = "Pending";
      advancePayStatus = "Paid";
      break;
    case "paid":
      status = "Paid";
      advancePayStatus = "Paid";
      break;
    case "refunded":
      status = "Canceled";
      advancePayStatus = "Refunded";
      break;
    case "fully_refunded":
      status = "Refunded";
      advancePayStatus = "Refunded";
  }

  return (
    <>
      <div className={styles.leftContent}>
        {/* Payment information */}
        <h3>Payment Details</h3>
        <table className={styles.infoTable}>
          <thead>
            <tr>
              <th>Price details</th>
              <th>Amount</th>
              <th>Payment status</th>
            </tr>
          </thead>
          <tbody>
            {reservationData.selected_rooms.map(room => (
              <tr key={room.room_type_id}>
                <th>
                  {room.number_of_rooms} *{" "}
                  {findRoomTypeDescription(room.room_type_id)}
                </th>
                <td>$ {room.total_amount}</td>
                <td></td>
              </tr>
            ))}
            <tr>
              <th>Total price</th>
              <td>$ {totalPrice}</td>
              <td></td>
            </tr>
            <tr>
              <th>Advance payment</th>
              <td>$ {advancePaymentAmount}</td>
              <td>{advancePayStatus}</td>
            </tr>
            <tr className={styles.highlightRow}>
              <th>Remaining balance</th>
              <td>$ {remainingBalance.toFixed(2)}</td>
              <td>{status}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.controlPanel}>
        <span style={{ fontSize: "14px", color: "#333", marginBottom: "10px" }}>
          -- Change payment status --
        </span>
        <select
          value={paymentStatus}
          onChange={handlePaymentStatusChange}
          disabled={loading}
        >
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
        <div className={styles.statusNotes}>
          <p>Statuses</p>
          <ul>
            <li>Pending: Deposit and remaining balance unpaid</li>
            <li>Partial: Deposit paid. Remaining balance Pending</li>
            <li>Paid: Deposit and remaining balance paid</li>
            <li>Refunded: Deposit refunded</li>
            <li>
              Fully Refunded: Total amount refunded (deposit + remaining
              balance)
            </li>
          </ul>
        </div>
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
  roomTypes: PropTypes.array.isRequired,
  refreshData: PropTypes.func.isRequired,
};

GuestInfo.propTypes = {
  guestData: PropTypes.object.isRequired,
  setIndex: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

PaymentDetails.propTypes = {
  reservationData: PropTypes.object.isRequired,
  totalPrice: PropTypes.number.isRequired,
  roomTypes: PropTypes.array.isRequired,
  refreshData: PropTypes.func.isRequired,
};

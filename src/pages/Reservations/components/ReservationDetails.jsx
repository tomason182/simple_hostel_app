import PropTypes from "prop-types";
import { useState, useContext, useEffect } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./ReservationDetails.module.css";
import Modal from "../../../components/Modal/Modal";
import { RoomTypeContext } from "../../../data_providers/RoomTypesDataProvider";

// Helpers
import { formateDateToLocale } from "../../../utils/dateFormatHelper";
import country_code from "../../../utils/country_code.json";
// Data provider
import { useFetchReservationById } from "../../../data_providers/reservationDataProvider";

// Forms
import ChangeReservationsDatesForm from "../../../forms/ChangeReservationDatesForm";
import UpdateGuestInformation from "../../../forms/UpdateGuestInformation";
import CancelReservationForm from "../../../forms/CancelReservationForm";
import EditReservationPrices from "../../../forms/EditReservationPrices";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useToast } from "../../../hooks/useToast";

export default function ReservationDetails() {
  const [activeTab, setActiveTab] = useState(0);
  const [index, setIndex] = useState(0);
  /* Modal state */
  const [isOpen, setIsOpen] = useState(false);

  const { roomTypes, loadingRoomTypes, errorRoomTypes } =
    useContext(RoomTypeContext);
  const { id } = useParams();

  const { reservation, loading, error, refreshReservationById } =
    useFetchReservationById(id);

  const { t } = useTranslation();

  if (loading || loadingRoomTypes) return <Spinner />;

  if (error || errorRoomTypes)
    return (
      <div>
        <p>{t("unexpected_error_message")}</p>
      </div>
    );

  const totalPrice = reservation.reservation.selected_rooms
    .reduce((acc, room) => acc + Number(room.total_amount), 0)
    .toFixed(2);

  const tabs = [
    {
      label: t("reservation_info"),
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
      label: t("guest_info"),
      content: (
        <GuestInfo
          setIsOpen={setIsOpen}
          setIndex={setIndex}
          guestData={reservation.guest}
        />
      ),
    },
    {
      label: t("payment_details"),
      content: (
        <PaymentDetails
          reservationData={reservation.reservation}
          totalPrice={totalPrice}
          roomTypes={roomTypes}
          refreshData={refreshReservationById}
          setIndex={setIndex}
          setIsOpen={setIsOpen}
        />
      ),
    },
  ];

  const fullName =
    reservation.guest?.first_name + " " + reservation.guest?.last_name;

  const forms = [
    {
      header: t("change_reservation_dates"),
      content: (
        <ChangeReservationsDatesForm
          setIsOpen={setIsOpen}
          reservation={reservation?.reservation}
        />
      ),
    },
    {
      header: t("cancel_reservation"),
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
      header: t("mark_reservation_no_show"),
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
      header: t("update_guest_info"),
      content: (
        <UpdateGuestInformation
          setIsOpen={setIsOpen}
          guestData={reservation.guest}
          refreshData={refreshReservationById}
        />
      ),
    },
    {
      header: t("modify_prices"),
      content: (
        <EditReservationPrices
          reservationData={reservation.reservation}
          roomTypes={roomTypes}
          setIsOpen={setIsOpen}
          refreshReservationById={refreshReservationById}
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

  const { t } = useTranslation();
  const { addToast } = useToast();

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
          throw new Error("UNEXPECTED_ERROR");
        }
        addToast({
          message: t("RESERVATION_STATUS_UPDATED", { ns: "validation" }),
          type: "success",
        });
        refreshData();
      })
      .catch(e =>
        addToast({ message: t(e.message, { ns: "validation" }), type: "error" })
      )
      .finally(() => setLoading(false));
  }
  return (
    <>
      <div className={styles.leftContent}>
        {/* General Reservation details */}
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <th>{t("status")}</th>
              <td>
                <span className={styles.status}>
                  {reservationData.reservation_status}
                </span>
              </td>
            </tr>
            <tr>
              <th>{t("arrival")}</th>
              <td>{arrivalDate}</td>
            </tr>
            <tr>
              <th>{t("departure")}</th>
              <td>{departureDate}</td>
            </tr>
            <tr>
              <th colSpan={2} style={{ textAlign: "center" }}>
                {t("selected_rooms")}
              </th>
            </tr>
            {reservationData.selected_rooms.map((room, index) => (
              <tr key={room.room_type_id}>
                <th>
                  {t("room")} {index + 1}
                </th>
                <td>
                  {room.number_of_rooms} *{" "}
                  {findRoomTypeDescription(room.room_type_id)}
                </td>
              </tr>
            ))}
            <tr>
              <th>{t("booking_source")}</th>
              <td>{reservationData.booking_source}</td>
            </tr>

            {reservationData.special_request !== "" && (
              <tr>
                <th>{t("special_request")}</th>
                <td>{reservationData.special_request}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.controlPanel}>
        <h5>{t("update_this_reservation")}</h5>
        <button
          onClick={() => {
            setIndex(1);
            setIsOpen(true);
          }}
          disabled={loading}
        >
          {t("cancel_reservation")}
        </button>
        <button
          onClick={() => {
            setIndex(2);
            setIsOpen(true);
          }}
          disabled={loading}
        >
          {t("mark_reservation_no_show")}
        </button>
        <button
          onClick={() => {
            setIndex(0);
            setIsOpen(true);
          }}
          disabled={loading}
        >
          {t("change_reservation_dates")}
        </button>
        <br />
        <span style={{ fontSize: "12px", color: "#000", marginBottom: "10px" }}>
          -- {t("change_reservation_status")} --
        </span>
        <select
          name="reservationStatus"
          value={reservationStatus}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="canceled">{t("canceled")}</option>
          <option value="no_show">No-show</option>
          <option
            value="provisional"
            disabled={
              reservationStatus === "canceled" ||
              reservationStatus === "no_show"
            }
          >
            {t("provisional")}
          </option>
          <option
            value="confirmed"
            disabled={
              reservationStatus === "canceled" ||
              reservationStatus === "no_show"
            }
          >
            {t("confirmed")}
          </option>
        </select>
      </div>
    </>
  );
}

function GuestInfo({ guestData, setIndex, setIsOpen }) {
  const { t } = useTranslation();

  function getCountryName(code) {
    const countryObject = country_code.find(
      country => country.value === code.toLowerCase()
    );
    return countryObject.label;
  }
  return (
    <>
      <div className={styles.leftContent}>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <th>{t("id_passport_number")}</th>
              <td>{guestData.id_number}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{guestData.contact_info.email}</td>
            </tr>
            <tr>
              <th>{t("phone_number")}</th>
              <td>{guestData.contact_info.phone_number}</td>
            </tr>
            <tr>
              <th>{t("country")}</th>
              <td>{getCountryName(guestData.address.country_code)}</td>
            </tr>
            <tr>
              <th>{t("city")}</th>
              <td>{guestData.address.city}</td>
            </tr>
            <tr>
              <th>{t("street")}</th>
              <td>{guestData.address.street}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.controlPanel}>
        <h5>{t("update_guest")}</h5>
        <button
          onClick={() => {
            setIndex(3);
            setIsOpen(true);
          }}
        >
          {t("update_guest_info")}
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
  setIndex,
  setIsOpen,
}) {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const { addToast } = useToast();

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

  function handleChange(e) {
    const { name, value } = e.target;

    let status = "";

    if (name === "advance_payment") {
      switch (value) {
        case "pending":
          status = "pending";
          break;
        case "paid":
          status = "partial";
          break;
        case "refunded":
          status = "refunded";
          break;
      }
    }

    if (name === "remaining_balance") {
      switch (value) {
        case "pending":
          status = "partial";
          break;
        case "paid":
          status = "paid";
          break;
      }
    }

    const url =
      import.meta.env.VITE_URL_BASE +
      "/reservations/change-payment-status/" +
      reservationData.id +
      "-" +
      status;

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
          throw new Error("UNEXPECTED_ERROR");
        }

        addToast({
          message: t("PAYMENT_STATUS_UPDATED", { ns: "validation" }),
          type: "success",
        });
        refreshData();
      })
      .catch(e =>
        addToast({ message: t(e.message, { ns: "validation" }), type: "error" })
      )
      .finally(() => setLoading(false));
  }

  let status = "";
  let advancePayStatus = "";

  switch (paymentStatus) {
    case "pending":
      status = "pending";
      advancePayStatus = "pending";
      break;
    case "partial":
      status = "pending";
      advancePayStatus = "paid";
      break;
    case "paid":
      status = "paid";
      advancePayStatus = "paid";
      break;
    case "refunded":
      status = "canceled";
      advancePayStatus = "refunded";
      break;
    case "fully_refunded":
      status = "refunded";
      advancePayStatus = "refunded";
  }

  return (
    <>
      <div className={styles.leftContent}>
        {/* Payment information */}
        <h3>{t("payment_details")}</h3>
        <table className={styles.infoTable}>
          <thead>
            <tr>
              <th>{t("price_details")}</th>
              <th>{t("amount")}</th>
              <th>{t("payment_status")}</th>
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
              <th>{t("total_price")}</th>
              <td>$ {totalPrice}</td>
              <td></td>
            </tr>
            <tr>
              <th>{t("advance_payment")}</th>
              <td>$ {advancePaymentAmount}</td>
              <td>
                <select
                  name="advance_payment"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option
                    value="pending"
                    selected={advancePayStatus === "pending"}
                  >
                    {t("pending")}
                  </option>
                  <option value="paid" selected={advancePayStatus === "paid"}>
                    {t("paid")}
                  </option>
                  <option
                    value="refunded"
                    selected={advancePayStatus === "refunded"}
                  >
                    {t("refunded")}
                  </option>
                </select>
              </td>
            </tr>
            <tr className={styles.highlightRow}>
              <th>{t("remaining_balance")}</th>
              <td>$ {remainingBalance.toFixed(2)}</td>
              <td>
                <select
                  name="remaining_balance"
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="pending" selected={(status = "pending")}>
                    {t("pending")}
                  </option>
                  <option value="paid" selected={status === "paid"}>
                    {t("paid")}
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.controlPanel}>
        <span style={{ fontSize: "14px", color: "#333", marginBottom: "10px" }}>
          -- {t("modify_prices")} --
        </span>
        <button
          onClick={() => {
            setIndex(4);
            setIsOpen(true);
          }}
        >
          {t("change_prices")}
        </button>
      </div>
    </>
  );
}

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
  setIndex: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

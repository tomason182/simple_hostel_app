import styles from "./Calendar.module.css";
import { format, sub, add, setDefaultOptions } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Fragment, useContext, useState, useMemo } from "react";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import StepNavigation from "../../components/StepNavigation/StepNavigation";
import Button from "../../components/Button/Button";
// Forms
import CheckAvailabilityFrom from "../../forms/CheckAvailabilityForm";
import RoomSelectionForm from "../../forms/RoomSelectionForm";
import GuestInformationForm from "../../forms/GuestInformationForm";
import ReservationDetails from "../../forms/ReservationDetails";
import ReservationConfirmation from "../../forms/ReservationConfirmation";
// Data providers
import { RoomTypeContext } from "../../data_providers/RoomTypesDataProvider";
import { useFetchReservationByDateRange } from "../../data_providers/reservationDataProvider";
// Utils and helper functions
import { dateFormatHelper } from "../../utils/dateFormatHelper";

import { useTranslation } from "react-i18next";

export default function Calendar() {
  const today = new Date();
  const lengthOfCalendar = 14;
  const [startDate, setStartDate] = useState(today);
  // CREATE RESERVATION STATES
  // availability State
  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false);
  const [errorOnSubmit, setErrorOnSubmit] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [reservationFormData, setReservationFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "",
    phoneNumber: "",
    city: "",
    street: "",
    postalCode: "",
    countryCode: "",
    currency: "",
    selectedRooms: [],
    bookingSource: "",
    checkIn: "",
    checkOut: "",
    reservationStatus: "",
    paymentStatus: "",
    specialRequest: "",
  });
  const fromDate = useMemo(() => sub(startDate, { days: 3 }), [startDate]);
  const toDate = useMemo(
    () => add(fromDate, { days: lengthOfCalendar }),
    [fromDate]
  );

  // Modal States
  const [isOpen, setIsOpen] = useState(false);

  // Form index
  const [currentIndex, setCurrentIndex] = useState(0);

  const { roomTypes, isLoading, error } = useContext(RoomTypeContext);
  const {
    reservations,
    loadingReservations,
    errorReservations,
    refreshReservationsData,
  } = useFetchReservationByDateRange(fromDate, toDate);

  const { t } = useTranslation();

  const lng = localStorage.getItem("i18nextLng") || navigator.language || "en";

  setDefaultOptions({ locale: lng === "es" ? es : enUS });

  const year = format(startDate, "yyyy");
  const MMM = format(startDate, "MMMM");

  const handleNextBtn = () =>
    setStartDate(add(startDate, { days: lengthOfCalendar }));
  const handlePrevBtn = () =>
    setStartDate(sub(startDate, { days: lengthOfCalendar }));

  // Generate days array
  const firstDayOfCalendar = sub(startDate, { days: 3 });
  const daysArray = Array.from({ length: lengthOfCalendar }, (_, i) =>
    add(firstDayOfCalendar, { days: i })
  );

  // Helper to format day cells
  const formatDayCell = isToday => ({
    fontSize: isToday ? "1.25rem" : "0.75rem",
    color: isToday ? "#fff" : "#636363",
  });

  const formatDayName = isToday => ({
    fontSize: "0.75rem",
    color: isToday ? "#fff" : "#7c7c7c",
  });

  // Render headers
  const days = daysArray.map(day => {
    const isToday = format(today, "yyyyMMdd") === format(day, "yyyyMMdd");
    setDefaultOptions({ locale: lng === "es" ? es : enUS });
    return (
      <th
        scope="col"
        key={day.toISOString()}
        className={styles.dates}
        style={
          isToday
            ? {
                textAlign: "center",
                background: "#004a77",
              }
            : { textAlign: "center" }
        }
      >
        <span style={formatDayName(isToday)}>{format(day, "iii")}</span>
        <br />
        <span style={formatDayCell(isToday)}>{format(day, "dd")}</span>
      </th>
    );
  });

  // Reservation finding logic
  function handleReservationClassName(reservation) {
    const expr = parseInt(format(today, "yyyyMMdd"));
    const checkIn = Number(dateFormatHelper(reservation.checkIn));
    const checkOut = Number(dateFormatHelper(reservation.checkOut));

    let statusClassName = "confirmed";

    if (checkOut <= expr) {
      statusClassName = "checkedOut";
    } else if (checkIn <= expr && checkOut > expr) {
      statusClassName = "inHouse";
    } else {
      statusClassName = reservation.status;
    }
    return statusClassName;
  }

  // Assigning beds
  function getReservationDetails(day, bedId, type = "find") {
    const currentDay = new Date(day.toISOString().split("T")[0]);
    const reservation = reservations.find(r => {
      const checkIn = new Date(r.check_in.split("T")[0]);
      const checkOut = new Date(r.check_out.split("T")[0]);

      return (
        r.assigned_beds.includes(bedId) &&
        checkIn <= currentDay &&
        checkOut > currentDay
      );
    });

    if (
      !reservation ||
      (reservation.reservation_status !== "confirmed" &&
        reservation.reservation_status !== "provisional")
    ) {
      return null;
    }

    const checkIn = new Date(reservation.check_in.split("T")[0]);
    const checkOut = new Date(reservation.check_out.split("T")[0]);

    const daysDiff =
      type === "start" ? checkOut - currentDay : checkOut - checkIn;

    return {
      guestName: reservation.guest_info.full_name,
      checkIn: reservation.check_in,
      checkOut: reservation.check_out,
      status: reservation.reservation_status,
      nights: daysDiff / (1000 * 3600 * 24),
    };
  }

  // Render rooms and beds.
  const roomList = roomTypes.map(room => (
    <Fragment key={`${room.id}-${room.property_id}`}>
      <tr className={styles.roomDescription}>
        <th colSpan={17} key={room.id}>
          {room.description}
        </th>
      </tr>
      {room.products.map(product => (
        <Fragment key={`${product.id}-${room.id}`}>
          <tr className={styles.roomRow}>
            <th key={product.id} colSpan={2} rowSpan={product.beds.length + 1}>
              <div className={styles.roomName}>
                <p>{product.room_name}</p>
                {room.type === "dorm" ? (
                  <span>Dorm</span>
                ) : (
                  <span>Private</span>
                )}
              </div>
            </th>
          </tr>
          {product.beds.map((bed, i) => {
            let skipDays = 0;
            return (
              <tr
                key={bed}
                className={
                  room.type === "dorm" ? styles.rows : styles.rowsPrivate
                }
              >
                <th className={styles.beds}>{i + 1}</th>
                {daysArray.map((day, index) => {
                  if (skipDays > 0) {
                    skipDays -= 1;
                    return null;
                  }

                  const reservationType = index === 0 ? "start" : "find";
                  const reservation = getReservationDetails(
                    day,
                    bed,
                    reservationType
                  );

                  if (reservation) {
                    skipDays = reservation.nights - 1;

                    const colSpan =
                      index + reservation.nights > days.length
                        ? daysArray.length - index
                        : reservation.nights;
                    const statusClassName =
                      handleReservationClassName(reservation);

                    return (
                      <td
                        key={index}
                        colSpan={colSpan}
                        className={`${styles.guestName} ${styles[statusClassName]}`}
                      >
                        {reservation.guestName}
                      </td>
                    );
                  }
                  return <td key={index}></td>;
                })}
              </tr>
            );
          })}
        </Fragment>
      ))}
    </Fragment>
  ));

  /* Table footer */
  function CalendarFooter() {
    const statusList = [
      {
        key: "1",
        title: "Reserved-Provisional",
        customStyle: { color: "#3a86ff" },
      },
      {
        key: "2",
        title: "Reserved-Confirmed",
        customStyle: { color: "#6a994e" },
      },
      { key: "3", title: "In House", customStyle: { color: "#e36414" } },
      { key: "4", title: "Checked-out", customStyle: { color: "#343a40" } },
    ];

    const listItems = statusList.map(item => (
      <li key={item.key} style={item.customStyle}>
        {item.title}
      </li>
    ));
    return (
      <tr className={styles.reservationStatus}>
        <th scope="row" colSpan={3}></th>
        <td colSpan={14}>
          <ul>{listItems}</ul>
        </td>
      </tr>
    );
  }

  /* Step Navigation */
  const steps = [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "4" },
    { label: "5" },
  ];

  const onStepClick = index => {
    setCurrentIndex(index);
  };

  const stepsNavigation = (
    <StepNavigation
      activeStep={currentIndex}
      steps={steps}
      clickableSteps={false}
      onStepClick={onStepClick}
    />
  );

  const formChildren = {
    0: (
      <CheckAvailabilityFrom
        setReservationFormData={setReservationFormData}
        setAvailability={setAvailability}
        setIndex={setCurrentIndex}
      />
    ),
    1: (
      <RoomSelectionForm
        selectedRooms={reservationFormData.selectedRooms}
        setReservationFormData={setReservationFormData}
        availability={availability}
        setIndex={setCurrentIndex}
      />
    ),
    2: (
      <GuestInformationForm
        formData={reservationFormData}
        setReservationFormData={setReservationFormData}
        setIndex={setCurrentIndex}
      />
    ),
    3: (
      <ReservationDetails
        data={reservationFormData}
        setData={setReservationFormData}
        availability={availability}
        setIndex={setCurrentIndex}
        setLoading={setLoadingOnSubmit}
        setError={setErrorOnSubmit}
        refreshReservationsData={refreshReservationsData}
      />
    ),
    4: (
      <ReservationConfirmation
        setIsOpen={setIsOpen}
        setIndex={setCurrentIndex}
        loading={loadingOnSubmit}
        error={errorOnSubmit}
        data={reservationFormData}
      />
    ),
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.calendarTable}>
        <thead>
          <tr>
            <th colSpan={3} rowSpan={3}>
              <Button title={t("create")} onClick={() => setIsOpen(true)} />
            </th>
          </tr>
          <tr>
            <th colSpan={12} className={styles.monthDisplay}>
              {MMM}&nbsp;{year}
            </th>

            <th>
              <button onClick={handlePrevBtn} className={styles.arrowBtn}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </th>
            <th>
              <button onClick={handleNextBtn} className={styles.arrowBtn}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </th>
          </tr>
          <tr className={styles.fixedDays}>{days}</tr>
        </thead>
        <tbody>
          {error || errorReservations ? (
            <tr height={250}>
              <td>An Error occurred fetching room types data</td>
            </tr>
          ) : isLoading && loadingReservations ? (
            <tr height={250}>
              <td colSpan={17}>
                <Spinner />
              </td>
            </tr>
          ) : roomList.length === 0 ? (
            <tr height={250}>
              <td colSpan={17} className={styles.noRoomTypesMessage}>
                There are no room types created. Before you begin, please create
                your property room types
              </td>
            </tr>
          ) : (
            roomList
          )}
        </tbody>
        <tfoot>
          <CalendarFooter />
        </tfoot>
      </table>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setCurrentIndex(0);
        }}
        width="800px"
        header={stepsNavigation}
      >
        {formChildren[currentIndex]}
      </Modal>
    </div>
  );
}

import { format, setDefaultOptions, sub, add } from "date-fns";
import { es, enUS } from "date-fns/locale";
import styles from "./RatesAndAvailability.module.css";
import { useState, Fragment, useContext, useMemo } from "react";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";
import RatesAndAvailabilityFrom from "../../forms/RatesAndAvailabilityFrom";
// Data providers
import { RoomTypeContext } from "../../data_providers/RoomTypesDataProvider";
import { useFetchReservationByDateRange } from "../../data_providers/reservationDataProvider";
import { useFetchRatesAndAvailabilityByDateRange } from "../../data_providers/ratesAndAvailabilityDataProvider";
// Utils
import { dateFormatHelper } from "../../utils/dateFormatHelper.js";
import { useTranslation } from "react-i18next";

export default function RatesAndAvailability() {
  const today = new Date();
  const lengthOfCalendar = 14;
  const [startDate, setStartDate] = useState(today);
  const fromDate = useMemo(() => sub(startDate, { days: 3 }), [startDate]);
  const toDate = useMemo(
    () => add(fromDate, { days: lengthOfCalendar }),
    [fromDate]
  );

  const { roomTypes, isLoading, error } = useContext(RoomTypeContext);

  /* Modal State */
  const [isOpen, setIsOpen] = useState(false);

  // Fetch reservations
  const { reservations, loadingReservations, errorReservations } =
    useFetchReservationByDateRange(fromDate, toDate);

  // Fetch rates and availability
  const {
    ratesAndAvailability,
    loadingRatesAndAvailability,
    errorRatesAndAvailability,
    refreshRatesAndAvailability,
  } = useFetchRatesAndAvailabilityByDateRange(fromDate, toDate);

  const { t } = useTranslation();

  /* dates-fns language */
  const lng = localStorage.getItem("i18nextLng") || navigator.language || "en";
  setDefaultOptions({ locale: lng === "es" ? es : enUS });
  const year = format(startDate, "yyyy");
  const MMM = format(startDate, "MMMM");

  const handleNextBtn = () => setStartDate(add(startDate, { days: 14 }));
  const handlePrevBtn = () => setStartDate(sub(startDate, { days: 14 }));

  // Day array
  const firstDayOfCalendar = sub(startDate, { days: 3 });
  const daysArray = Array.from({ length: 14 }, (_, i) =>
    add(firstDayOfCalendar, { days: i })
  );

  // Helper to render day cells
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
    return (
      <th
        scope="col"
        key={day.toISOString()}
        className={styles.dates}
        style={
          isToday
            ? { textAlign: "center", background: "#004a77" }
            : { textAlign: "center" }
        }
      >
        <span style={formatDayName(isToday)}>{format(day, "iii")}</span>
        <br />
        <span style={formatDayCell(isToday)}>{format(day, "dd")}</span>
      </th>
    );
  });

  // Room calculation to sell
  const roomInfo = (day, room) => {
    const currentDay = Number(format(day, "yyyyMMdd"));

    const roomTypeBeds = room.products.flatMap(product => product.beds);

    // Get rates and availability range for current day and room type
    const rateAndAvailability = ratesAndAvailability.find(r => {
      const startDate = Number(dateFormatHelper(r.start_date));
      const endDate = Number(dateFormatHelper(r.end_date));

      return (
        r.room_type_id === room.id &&
        currentDay >= startDate &&
        currentDay <= endDate
      );
    });

    const maxOccupancy =
      room.type === "dorm"
        ? room.max_occupancy * room.inventory
        : room.inventory;

    // Count bookings for current day
    let bookingsCount = 0;
    for (const reservation of reservations) {
      const checkIn = dateFormatHelper(reservation.check_in);
      const checkOut = dateFormatHelper(reservation.check_out);
      if (checkIn <= currentDay && checkOut > currentDay) {
        // Count bookings
        bookingsCount += reservation.assigned_beds.filter(b =>
          roomTypeBeds.includes(b)
        ).length;
      }
    }

    if (!rateAndAvailability)
      return {
        roomsToSell: maxOccupancy,
        standardRate: 0,
        bookings: bookingsCount,
        roomStatus: false,
      };

    // Calculus for rooms to sell and standard rate
    const roomsToSell = rateAndAvailability?.rooms_to_sell;

    const standardRate = rateAndAvailability?.custom_rate;

    const roomStatus = roomsToSell > bookingsCount;

    return {
      roomsToSell,
      standardRate,
      bookings: bookingsCount,
      roomStatus: roomStatus,
    };
  };

  // Open and close styling
  const customStyle = {
    close: {
      background: "red",
      color: "white",
    },
    closeLight: {
      background: "rgba(255,0,0,0.3)",
      color: "#666",
    },

    open: {
      background: "green",
      color: "white",
    },
  };

  // Render room types
  const roomList = roomTypes.map(room => (
    <Fragment key={`${room.id}-${room.property_id}`}>
      {/* Room description */}
      <tr key={room.id} className={styles.roomDescription}>
        <th colSpan={17}>{room.description}</th>
      </tr>

      {/* Calculate room info once per room per day */}
      {(() => {
        const roomDataByDay = daysArray.map(day => roomInfo(day, room));

        return [
          t("room_status"),
          t("rooms_to_sell"),
          t("bookings"),
          t("standard_rate"),
        ].map((label, index) => (
          <tr key={index}>
            <th colSpan={3} className={styles.label}>
              {label}
            </th>

            {roomDataByDay.map((info, dayIndex) => {
              let value;
              let style;
              switch (index) {
                case 0:
                  value = info.roomStatus ? "Open" : "Close";
                  style = info.roomStatus ? "open" : "close";
                  break;
                case 1:
                  value = info.roomsToSell;
                  style = !info.roomStatus && "closeLight";

                  break;
                case 2:
                  value = info.bookings;
                  break;
                case 3:
                  value = info.standardRate;
                  style = !info.roomStatus && "closeLight";
                  break;
                default:
                  value = "";
                  style = !info.roomStatus && "closeLight";
              }
              return (
                <td
                  key={daysArray[dayIndex].toISOString()}
                  style={customStyle[style]}
                >
                  {value}
                </td>
              );
            })}
          </tr>
        ));
      })()}
    </Fragment>
  ));

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={3} rowSpan={3}>
              <Button title="Bulk edit" onClick={() => setIsOpen(true)} />
            </th>
          </tr>
          <tr>
            <th colSpan={12}>
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
          <tr>{days}</tr>
        </thead>
        <tbody>
          {error || errorRatesAndAvailability || errorReservations ? (
            <tr height={250}>
              <td colSpan={17}>{t("unexpected_error_message")}</td>
            </tr>
          ) : isLoading &&
            loadingReservations &&
            loadingRatesAndAvailability ? (
            <tr height={250}>
              <td colSpan={17}>
                <Spinner />
              </td>
            </tr>
          ) : roomList.length === 0 ? (
            <tr height={250}>
              <td colSpan={17} className={styles.noRoomTypesMessage}>
                {t("no_room_message")}
              </td>
            </tr>
          ) : (
            roomList
          )}
        </tbody>
      </table>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <RatesAndAvailabilityFrom
          roomTypes={roomTypes}
          setIsOpen={setIsOpen}
          refreshRatesAndAvailability={refreshRatesAndAvailability}
        />
      </Modal>
    </>
  );
}

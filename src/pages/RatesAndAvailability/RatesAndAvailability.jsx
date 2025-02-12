import { format, setDefaultOptions, sub, add } from "date-fns";
import { es, enUS } from "date-fns/locale";
import styles from "./RatesAndAvailability.module.css";
import { useState, useEffect, Fragment } from "react";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";
import RatesAndAvailabilityFrom from "../../forms/RatesAndAvailabilityFrom";

export default function RatesAndAvailability() {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [reservations, setReservations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Modal State */
  const [isOpen, setIsOpen] = useState(false);

  /* dates-fns language */
  setDefaultOptions({ locale: es });

  useEffect(() => {
    const roomTypesList = [
      {
        id: 1,
        property_id: 1,
        description: "4max dormitory",
        type: "dorm",
        gender: "mix",
        max_occupancy: 4,
        inventory: 2,
        products: [
          {
            id: 1,
            room_name: "El refugio",
            beds: [10, 11, 12, 14], // IDs from Beds table?
          },
          {
            id: 2,
            room_name: "El andino",
            beds: [15, 16, 17, 18],
          },
        ],
      },
      {
        id: 2,
        property_id: 1,
        description: "Private Dormitory",
        type: "private",
        gender: "mix",
        max_occupancy: 2,
        inventory: 2,
        products: [
          {
            id: 3,
            room_name: "El ranchito",
            beds: [19], // IDs from Beds table?
          },
          {
            id: 4,
            room_name: "La casita",
            beds: [20],
          },
        ],
      },
    ];

    setRoomTypes(roomTypesList);
  }, []);

  useEffect(() => {
    const reservationsList = [
      {
        id: 1,
        property_id: 1,
        room_type_id: 1,
        booking_source: "booking.com",
        currency: "USD",
        guest_info: {
          full_name: "Larry Clark",
        },
        check_in: "2025-02-03",
        check_out: "2025-02-07",
        number_of_guest: 2,
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
        room_type_id: 1,
        booking_source: "booking.com",
        currency: "USD",
        guest_info: {
          full_name: "Sophia Martinez",
        },
        check_in: "2025-02-05",
        check_out: "2025-02-09",
        number_of_guest: 1,
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
        room_type_id: 1,
        booking_source: "website",
        currency: "USD",
        guest_info: {
          full_name: "Michael Johnson",
        },
        check_in: "2025-02-05",
        check_out: "2025-02-07",
        number_of_guest: 3,
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
        room_type_id: 2,
        booking_source: "website",
        currency: "USD",
        guest_info: {
          full_name: "Emma Thompson",
        },
        check_in: "2025-02-05",
        check_out: "2025-02-12",
        number_of_guest: 2,
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
        room_type_id: 2,
        booking_source: "website",
        currency: "USD",
        guest_info: {
          full_name: "Daniel Rivera",
        },
        check_in: "2025-02-05",
        check_out: "2025-02-06",
        number_of_guest: 1,
        reservation_status: "confirmed",
        payment_status: "partial",
        assigned_beds: [19],
        special_request: "",
        created_by: "",
        updated_by: "",
        create_at: "",
        updated_at: "",
      },
    ];

    setReservations(reservationsList);
  }, []);

  // Rates and Availability mocked data
  const ratesAndAvailabilityList = [
    {
      id: 1,
      room_type_id: 1,
      start_date: "2025-02-08",
      end_date: "2025-02-09",
      standard_rate: 25,
      custom_availability: 6,
    },
    {
      id: 2,
      room_type_id: 1,
      start_date: "2025-02-10",
      end_date: "2025-02-12",
      standard_rate: 25,
      custom_availability: 0,
    },
    {
      id: 3,
      room_type_id: 1,
      start_date: "2025-02-13",
      end_date: "2025-02-18",
      standard_rate: 13,
      custom_availability: 6,
    },
  ];

  const year = format(startDate, "yyyy");
  const MMM = format(startDate, "MMM");

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
  const roomInfo = (day, roomId) => {
    const currentDay = Number(format(day, "yyyyMMdd"));

    // Find the room type
    const roomType = roomTypes.find(r => r.id === roomId);
    if (!roomType)
      return { roomToSell: 0, standardRate: 0, bookings: 0, roomStatus: false };

    // Get rates and availability range for current day and room type
    const rateAndAvailability = ratesAndAvailabilityList.find(r => {
      const startDate = Number(r.start_date.split("-").join(""));
      const endDate = Number(r.end_date.split("-").join(""));

      return (
        r.room_type_id === roomId &&
        currentDay >= startDate &&
        currentDay <= endDate
      );
    });

    // Calculus for rooms to sell and standard rate
    const roomsToSell =
      rateAndAvailability?.custom_availability ??
      roomType.inventory * roomType.max_occupancy;

    const standardRate = rateAndAvailability?.standard_rate ?? 0;

    // Count bookings for current day
    const filteredReservations = reservations.filter(r => {
      const checkIn = r.check_in.split("-").join("");
      const checkOut = r.check_out.split("-").join("");

      return (
        r.room_type_id === roomId &&
        checkIn <= currentDay &&
        checkOut > currentDay
      );
    });

    const bookings =
      roomType.type === "dorm"
        ? filteredReservations.reduce(
            (acc, currentValue) => acc + currentValue.number_of_guest,
            0
          )
        : filteredReservations.length;

    // Determine room status
    const roomStatus = roomsToSell > bookings && standardRate > 0;

    return { roomsToSell, standardRate, bookings, roomStatus };
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
        const roomDataByDay = daysArray.map(day => roomInfo(day, room.id));

        return [
          "Room status",
          "Rooms to sell",
          "Bookings",
          "Standard Rate",
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
          {loading ? (
            <Spinner />
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
      </table>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <RatesAndAvailabilityFrom roomTypes={roomTypes} />
      </Modal>
    </>
  );
}

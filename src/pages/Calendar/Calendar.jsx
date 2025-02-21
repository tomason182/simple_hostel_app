import styles from "./Calendar.module.css";
import { format, sub, add, setDefaultOptions } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Fragment, useEffect, useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import StepNavigation from "../../components/StepNavigation/StepNavigation";
import Button from "../../components/Button/Button";
import CheckAvailabilityFrom from "../../forms/CheckAvailabilityForm";

export default function Calendar() {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [reservations, setReservations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isOpen, setIsOpen] = useState(false);

  // Form index
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const year = format(startDate, "yyyy");
  const MMM = format(startDate, "MMMM");

  const handleNextBtn = () => setStartDate(add(startDate, { days: 14 }));
  const handlePrevBtn = () => setStartDate(sub(startDate, { days: 14 }));

  // Generate days array
  const firstDayOfCalendar = sub(startDate, { days: 3 });
  const daysArray = Array.from({ length: 14 }, (_, i) =>
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
    const checkIn = Number(reservation.checkIn.split("-").join(""));
    const checkOut = Number(reservation.checkOut.split("-").join(""));

    let statusClassName = "confirmed";

    if (checkOut <= expr) {
      statusClassName = "checkedOut";
    } else if (checkIn <= expr && checkOut > expr) {
      statusClassName = "inHouse";
    } else {
      statusClassName = reservation.reservation_status;
    }
    return statusClassName;
  }

  // Assigning beds
  function getReservationDetails(day, bedId, type = "find") {
    const currentDay = Number(format(day, "yyyyMMdd"));

    const reservation = reservations.find(r => {
      const checkIn = Number(r.check_in.split("-").join(""));
      const checkOut = Number(r.check_out.split("-").join(""));

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

    const checkIn = Number(reservation.check_in.split("-").join(""));
    const checkOut = Number(reservation.check_out.split("-").join(""));
    const daysDiff =
      type === "start" ? checkOut - currentDay : checkOut - checkIn;

    return {
      guestName: reservation.guest_info.full_name,
      checkIn: reservation.check_in,
      checkOut: reservation.check_out,
      status: reservation.reservation_status,
      nights: daysDiff,
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

  /* HANDLING RESERVATION FORM */
  const nextForm = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === formChildren.length ? formChildren.length : prevIndex + 1
    );
  };

  // Handle form submit

  const checkAvailability = data => {
    setTimeout(() => {
      console.log("Availability retrieve");
    }, 3000);
    return data;
  };

  const handleDatesSubmit = async data => {
    try {
      const result = await checkAvailability(data);
      console.log("Search check-in and check-out dates:", result);
      nextForm();
    } catch (e) {
      console.log(e);
    }
  };

  const handleEmailSubmit = data => {
    console.log("Search guest email submitted", data);
    nextForm();
  };

  const handleGuestInfoSubmit = data => {
    console.log("Sending guest information: ", data);
  };

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
      clickableSteps={true}
      onStepClick={onStepClick}
    />
  );

  const formChildren = {
    0: <CheckAvailabilityFrom />,
  };

  // if (reservations === null || roomTypes === null) return <Spinner />;

  return (
    <>
      <table className={styles.calendarTable}>
        <thead>
          <tr>
            <th colSpan={3} rowSpan={3}>
              <Button title="Create" onClick={() => setIsOpen(true)} />
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
          <tr>
            {/* <th colSpan={3}></th> */}
            {days}
          </tr>
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
    </>
  );
}

import { useState } from "react";
import Card from "../../components/Card/Card";
import Modal from "../../components/Modal/Modal";
import {
  useGetTodayReservations,
  useGetLatestReservations,
} from "../../data_providers/reservationDataProvider";
import { ReservationsList } from "./Children";
import styles from "./Home.module.css";

export default function Home() {
  const { todayReservations, loadingTodayReservations, error } =
    useGetTodayReservations();
  const {
    latestReservations,
    loadingLatestReservation,
    errorLatestReservations,
  } = useGetLatestReservations();

  const [isOpen, setIsOpen] = useState(false);

  function onModalClose() {
    setIsOpen(false);
  }

  const customStyle = {
    children: {
      maxHeight: "300px",
      overflowY: "auto",
      overflowX: "hidden",
    },
  };

  const loadingStyling = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem 0",
  };

  const coming = {
    type: "coming",
    message: "You have no arrivals today",
  };

  const leaving = {
    type: "leaving",
    message: "You have no departures today",
  };

  const latest = {
    type: "latest",
    message: "No reservations in the last 30 days",
  };

  return (
    <div className={styles.container}>
      <Card title="Who's coming today" customStyle={customStyle}>
        <ReservationsList
          data={todayReservations}
          error={error}
          loading={loadingTodayReservations}
          info={coming}
        />
      </Card>
      <Card title="Who's leaving today" customStyle={customStyle}>
        <ReservationsList
          data={todayReservations}
          error={error}
          loading={loadingTodayReservations}
          info={leaving}
        />
      </Card>
      <Card title="Latest reservations" customStyle={customStyle}>
        <ReservationsList
          data={latestReservations}
          error={errorLatestReservations}
          loading={loadingLatestReservation}
          info={latest}
        />
      </Card>
      <Modal isOpen={isOpen} onClose={onModalClose}></Modal>
    </div>
  );
}

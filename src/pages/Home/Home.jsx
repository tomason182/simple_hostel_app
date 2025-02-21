import { useState, useEffect } from "react";
import Card from "../../components/Card/Card";
import Modal from "../../components/Modal/Modal";
import { ReservationsList, LatestReservations } from "./Children";
import styles from "./Home.module.css";

export default function Home() {
  const [todaysReservations, setTodaysReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  function onModalClose() {
    setIsOpen(false);
  }

  const actions = [
    {
      label: "SHOW MORE",
      onClick: () => setIsOpen(true),
    },
  ];

  const loadingStyling = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem 0",
  };

  const listStyle = {
    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "hidden",
  };

  const coming = {
    type: "coming",
    message: "No reservations coming today",
  };

  const leaving = {
    type: "leaving",
    message: "No reservations leaving today",
  };

  const latest = {
    type: "latest",
    message: "No reservations in the last 30 days",
  };

  return (
    <div className={styles.container}>
      <Card
        title="Who's coming today"
        actions={actions}
        customStyle={loading ? loadingStyling : listStyle}
      >
        <ReservationsList
          data={todaysReservations}
          error={error}
          loading={loading}
          info={coming}
        />
      </Card>
      <Card
        title="Who's leaving today"
        actions={actions}
        customStyle={loading ? loadingStyling : {}}
      >
        <ReservationsList
          data={todaysReservations}
          error={error}
          loading={loading}
          info={leaving}
        />
      </Card>
      <Card
        title="Latest reservations"
        actions={actions}
        customStyle={loading ? loadingStyling : {}}
      >
        <LatestReservations />
      </Card>
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <ReservationsList
          data={todaysReservations}
          error={error}
          loading={loading}
          info={coming}
        />
      </Modal>
    </div>
  );
}

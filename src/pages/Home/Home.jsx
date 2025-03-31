import { useState } from "react";
import Card from "../../components/Card/Card";
import Modal from "../../components/Modal/Modal";
import {
  useGetTodayReservations,
  useGetLatestReservations,
} from "../../data_providers/reservationDataProvider";
import { ReservationsList } from "./Children";
import styles from "./Home.module.css";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

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

  const coming = {
    type: "coming",
    message: t("arrivals_msg"),
  };

  const leaving = {
    type: "leaving",
    message: t("departures_msg"),
  };

  const latest = {
    type: "latest",
    message: t("latest_msg"),
  };

  return (
    <div className={styles.container}>
      <Card title={t("arrivals_title")} customStyle={customStyle}>
        <ReservationsList
          data={todayReservations}
          error={error}
          loading={loadingTodayReservations}
          info={coming}
        />
      </Card>
      <Card title={t("departures_title")} customStyle={customStyle}>
        <ReservationsList
          data={todayReservations}
          error={error}
          loading={loadingTodayReservations}
          info={leaving}
        />
      </Card>
      <Card title={t("latest_title")} customStyle={customStyle}>
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

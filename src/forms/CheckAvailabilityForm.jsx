import styles from "./defaultFormStyle.module.css";
import { useFetchReservationByDateRange } from "../data_providers/reservationDataProvider";

export default function CheckAvailabilityFrom() {
  const customStyle = {
    form: {
      width: "400px",
      margin: "0 auto",
    },
    title: {
      color: "#333",
      fontSize: "1.2rem",
    },
  };
  return (
    <>
      <h4 style={customStyle.title}>Search for availability</h4>
      <form className={styles.form} style={customStyle.form}>
        <div className={styles.formGroup}>
          <label>
            From:
            <input type="date" name="from" />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            To:
            <input type="date" name="to" />
          </label>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.submitButton}>Search Availability</button>
        </div>
      </form>
    </>
  );
}

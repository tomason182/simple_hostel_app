import { format } from "date-fns";
import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./defaultFormStyle.module.css";

export default function RatesAndAvailabilityFrom({ roomTypes }) {
  const [formData, setFormData] = useState({
    roomTypeId: "",
    from: "",
    upTo: "",
    roomsToSell: 0,
    standardRate: 0,
  });

  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");

  function onChange(e) {
    e.preventDefault();
    const [name, value] = e.target;
    setFormData({ ...formData, [name]: value });
  }
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label>
          Room type
          <select onChange={onChange}>
            <option value="">Select a Room Type</option>
            {roomTypes.map(room => (
              <option key={room.id}>{room.description}</option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.groupContainer}>
        <div className={styles.formGroup}>
          <label>
            From
            <input
              name="from"
              type="date"
              required
              min={formattedToday}
              onChange={onChange}
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            Up to and including
            <input
              name="upTo"
              type="date"
              required
              onChange={onChange}
              className={styles.dates}
            />
          </label>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>
          Rooms to sell
          <input
            name="roomsToSell"
            type="number"
            required
            onChange={onChange}
          />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Standard Rate
          <input
            name="standardRate"
            type="number"
            required
            onChange={onChange}
          />
        </label>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton}>Cancel</button>
        <button className={styles.submitButton}>Save</button>
      </div>
    </form>
  );
}

RatesAndAvailabilityFrom.propTypes = {
  roomTypes: PropTypes.object.isRequired,
};

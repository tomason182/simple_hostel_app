import { format } from "date-fns";
import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./defaultFormStyle.module.css";

export default function RatesAndAvailabilityFrom({
  roomTypes,
  setIsOpen,
  refreshRatesAndAvailability,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    roomTypeId: "",
    from: "",
    upTo: "",
    roomsToSell: 0,
    standardRate: 0,
  });

  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");

  let selectedROomType = roomTypes.find(
    r => r.id === parseInt(formData.roomTypeId)
  );

  let numberOfRooms = 0;

  if (selectedROomType) {
    numberOfRooms =
      selectedROomType.type === "dorm"
        ? selectedROomType.max_occupancy * selectedROomType.inventory
        : selectedROomType.inventory;
  }

  function onChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formBody = {
      roomTypeId: formData.roomTypeId,
      startDate: formData.from,
      endDate: formData.upTo,
      customRate: formData.standardRate,
      roomsToSell: formData.roomsToSell,
    };

    const url =
      import.meta.env.VITE_URL_BASE + "/rates-and-availability/create";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formBody),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        refreshRatesAndAvailability();
        setIsOpen(false);
      } else {
        let error = "";
        error = data.msg || "Server Error";
        setError(error);
        throw new Error(error);
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>
          Room type
          <select name="roomTypeId" onChange={onChange}>
            <option value="">Select a Room Type</option>
            {roomTypes.map(room => (
              <option key={room.id} value={room.id}>
                {room.description}
              </option>
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
          <select name="roomsToSell" type="number" required onChange={onChange}>
            {Array.from({ length: numberOfRooms }, (_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
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
        <button
          className={styles.cancelButton}
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
        <button className={styles.submitButton} disabled={loading}>
          {loading ? "Loading..." : "Save"}
        </button>
      </div>
      <div className={styles.error}>{error && error}</div>
    </form>
  );
}

RatesAndAvailabilityFrom.propTypes = {
  roomTypes: PropTypes.object.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  refreshRatesAndAvailability: PropTypes.func.isRequired,
};

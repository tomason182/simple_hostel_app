import styles from "./defaultFormStyle.module.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function RoomTypeForm({
  roomData,
  setIsOpen,
  resetState,
  refreshRoomTypeData,
}) {
  const [formData, setFormData] = useState({
    id: 0,
    description: "",
    type: "private",
    gender: "mixed",
    max_occupancy: 0,
    inventory: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({ ...roomData });
  }, [roomData]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const url = import.meta.env.VITE_URL_BASE + "/room-types/create";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    };

    setLoading(true);

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error");
        }

        return response.json();
      })
      .then(data => {
        if (data.status === "success") {
          alert(data.msg);
          refreshRoomTypeData();
          setIsOpen(false);
        } else {
          setError(data.msg);
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>
          Room description
          <input
            type="text"
            name="description"
            minLength={1}
            maxLength={255}
            placeholder="e.g. Bed in 6max mixed dormitory"
            required
            aria-required
            value={formData.description}
            onChange={handleChange}
          />
        </label>
      </div>
      <fieldset>
        <legend>Room type selection: Dormitory or Private</legend>
        <div className={styles.groupContainer}>
          <div className={styles.radioContainer}>
            <label>
              Private
              <input
                type="radio"
                name="type"
                value="private"
                onChange={handleChange}
                checked={formData.type === "private"}
              />
            </label>
          </div>
          <div className={styles.radioContainer}>
            <label>
              Dormitory
              <input
                type="radio"
                name="type"
                value="dorm"
                onChange={handleChange}
                checked={formData.type === "dorm"}
              />
            </label>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Gender</legend>
        <div className={styles.groupContainer}>
          <div className={styles.radioContainer}>
            <label>
              Mixed
              <input
                type="radio"
                name="gender"
                value="mixed"
                onChange={handleChange}
                checked={formData.gender === "mixed"}
              />
            </label>
          </div>
          <div className={styles.radioContainer}>
            <label>
              Female
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleChange}
                checked={formData.gender === "female"}
              />
            </label>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Room Capacity</legend>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              Max. occupancy
              <input
                type="number"
                name="max_occupancy"
                value={formData.max_occupancy}
                onChange={handleChange}
                required
                aria-required
                min={1}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Inventory
              <input
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                required
                aria-required
                min={1}
              />
            </label>
          </div>
        </div>
      </fieldset>
      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          type="button"
          onClick={() => {
            setIsOpen(false);
            resetState();
          }}
        >
          Cancel
        </button>
        <button className={styles.submitButton} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

RoomTypeForm.propTypes = {
  roomData: PropTypes.object.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  resetState: PropTypes.func.isRequired,
  refreshRoomTypeData: PropTypes.func.isRequired,
};

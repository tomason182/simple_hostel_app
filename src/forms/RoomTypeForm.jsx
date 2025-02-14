import styles from "./defaultFormStyle.module.css";
import { useState } from "react";

export default function RoomTypeForm() {
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label>
          Room description
          <input
            type="text"
            name="description"
            minLength={1}
            maxLength={100}
            placeholder="e.g. Bed in 6max mixed dormitory"
            required
            aria-required
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
                defaultValue="private"
                defaultChecked
              />
            </label>
          </div>
          <div className={styles.radioContainer}>
            <label>
              Dormitory
              <input type="radio" name="type" defaultValue="dorm" />
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
                defaultValue="mixed"
                defaultChecked
              />
            </label>
          </div>
          <div className={styles.radioContainer}>
            <label>
              Female
              <input type="radio" name="gender" defaultValue="female" />
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
                required
                aria-required
                min={1}
                max={20}
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Inventory
              <input type="number" name="inventory" required aria-required />
            </label>
          </div>
        </div>
      </fieldset>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton}>Cancel</button>
        <button className={styles.submitButton}>Submit</button>
      </div>
    </form>
  );
}

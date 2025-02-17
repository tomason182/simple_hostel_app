import styles from "./defaultFormStyle.module.css";

export default function OtherPoliciesForm() {
  return (
    <form className={styles.form}>
      <fieldset>
        <legend>Children Policies</legend>
        <div className={styles.formGroup}>
          <label>
            Do you accept children in your property?
            <select name="children_allow">
              <option value="">Select an option...</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>

              <option value="partial">
                Yes (Only private rooms reservations)
              </option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Pets Policies</legend>
        <div className={styles.formGroup}>
          <label>Do you accept pets in your Property?</label>
          <select name="pets">
            <option value="">Select an option...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </fieldset>
      <fieldset>
        <legend>Check-in times</legend>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              from:
              <input
                type="time"
                name="check_in_from"
                defaultValue="14:00"
                required
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              to:
              <input
                type="time"
                name="check_in_to"
                defaultValue="21:00"
                required
              />
            </label>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Check-out time</legend>
        <div className={styles.formGroup}>
          <label>
            Until:
            <input type="time" name="check_out_until" defaultValue="11:00" />
          </label>
        </div>
      </fieldset>
    </form>
  );
}

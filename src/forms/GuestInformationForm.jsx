import styles from "./defaultFormStyle.module.css";
import countryCodes from "../utils/country_code.json";

export default function GuestInformationForm() {
  console.log(countryCodes);
  return (
    <>
      <h4>Guest Information</h4>
      <form className={styles.form}>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              First name
              <input type="text" required aria-required />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              last name
              <input type="text" required aria-required />
            </label>
          </div>
        </div>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup} style={{ flex: "1" }}>
            <label>
              email
              <input type="email" required aria-required />
            </label>
          </div>
          <div
            className={styles.formGroup}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            <div className={styles.formGroup} style={{ flex: "1" }}>
              <label>
                phone code
                <select name="phone_code" id="phone_code">
                  {countryCodes.map(c => (
                    <option key={c.code}>{c.code}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.formGroup} style={{ flex: "2" }}>
              <label>
                Phone number
                <input type="text" />
              </label>
            </div>
          </div>
        </div>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              Country
              <select name="country" id="country">
                {countryCodes.map(c => (
                  <option key={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              City
              <input type="text" />
            </label>
          </div>
        </div>
        <div className={styles.groupContainer}>
          <div className={styles.formGroup}>
            <label>
              Postal code
              <input type="text" />
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>
              Street
              <input type="text" />
            </label>
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton}>Back</button>
          <button className={styles.submitButton}>Continue</button>
        </div>
      </form>
    </>
  );
}

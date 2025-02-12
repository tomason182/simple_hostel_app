import styles from "./defaultFormStyle.module.css";

export default function UserForm() {
  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label>
          First name
          <input type="text" name="first_name" required aria-required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Last name
          <input type="text" name="last_name" required aria-required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Email
          <input type="email" name="email" required aria-required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>
          Role
          <select name="role" required aria-required>
            <option value="">Select a role...</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </label>
      </div>

      <button className={styles.submitButton}>Submit</button>
    </form>
  );
}

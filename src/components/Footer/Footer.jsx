import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer>
      <div className={styles.footer}>
        <div className={styles.language}>
          <p>language</p>
        </div>
        <div className={styles.info}>
          <p>&#9400; 2025 SimpleHostel</p>
          <p>
            <a href="http://google.com">Terms and Conditions</a>
          </p>
          <p>
            <a href="#">Privacy</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

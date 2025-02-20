import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <ul className={styles.navList}>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Calendar</a>
        </li>
        <li>
          <a href="#">Rates &amp; Availability</a>
        </li>
        <li>
          <a href="#">Reservations</a>
        </li>
        <li>
          <a href="#">Property</a>
        </li>
        <li>
          <a href="#">Inbox</a>
        </li>
        <li>
          <a href="#">My Website</a>
        </li>
        <li>
          <a href="#">Reports</a>
        </li>
      </ul>
    </nav>
  );
}

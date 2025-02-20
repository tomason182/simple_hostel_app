import styles from "./NavBar.module.css";
import { Link } from "react-router";

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <ul className={styles.navList}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/calendar">Calendar</Link>
        </li>
        <li>
          <Link to="/rates-and-availability">Rates &amp; Availability</Link>
        </li>
        <li>
          <Link to="/reservations">Reservations</Link>
        </li>
        <li>
          <Link to="/property">Property</Link>
        </li>
        <li>
          <Link to="/inbox">Inbox</Link>
        </li>
        <li>
          <Link to="#">My Website</Link>
        </li>
        <li>
          <Link to="#">Reports</Link>
        </li>
      </ul>
    </nav>
  );
}

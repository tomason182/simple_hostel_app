import styles from "./NavBar.module.css";
import { NavLink } from "react-router";

export default function NavBar() {
  return (
    <nav className={styles.navBar}>
      <ul className={styles.navList}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/calendar">Calendar</NavLink>
        </li>
        <li>
          <NavLink to="/rates-and-availability">
            Rates &amp; Availability
          </NavLink>
        </li>
        <li>
          <NavLink to="/reservations">Reservations</NavLink>
        </li>
        <li>
          <NavLink to="/property">Property</NavLink>
        </li>
        <li>
          <NavLink to="/inbox">Inbox</NavLink>
        </li>
        <li>
          <NavLink to="/website">My Website</NavLink>
        </li>
        <li>
          <NavLink to="/reports">Reports</NavLink>
        </li>
      </ul>
    </nav>
  );
}

import styles from "./Profile.module.css";
import { Link } from "react-router";
import { useState } from "react";
import ProfileEditForm from "../../forms/ProfileEditForm.jsx";
import DeleteAccountForm from "../../forms/DeleteAccountForm.jsx";
import PasswordEditForm from "../../forms/PasswordEditForm.jsx";

export default function Profile() {
  const [toggle, setToggle] = useState(0);

  return (
    <div className={styles.mainContainer}>
      <aside className={styles.sideBar}>
        <nav>
          <Link
            to="#"
            role="button"
            onClick={() => setToggle(0)}
            className={toggle === 0 ? styles.active : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="00000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
              <circle cx="12" cy="10" r="3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <p>Profile</p>
          </Link>
          <Link
            to="#"
            role="button"
            onClick={() => setToggle(1)}
            className={toggle === 1 ? styles.active : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="00000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
            </svg>
            <p>Password</p>
          </Link>
        </nav>
      </aside>
      {toggle === 0 ? (
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <h3>Profile</h3>
            <ProfileEditForm />
          </div>
          <div className={styles.content}>
            <h3>Delete Your Account</h3>
            <DeleteAccountForm />
          </div>
        </div>
      ) : (
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <h3>Change your password</h3>
            <PasswordEditForm />
          </div>
        </div>
      )}
    </div>
  );
}

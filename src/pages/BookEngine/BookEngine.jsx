import styles from "./BookEngine.module.css";
import { useState } from "react";

export default function BookEngine() {
  const [requestSent, setRequestSent] = useState(false);

  // Necesitamos verificar si book engine esta activado. En property ?
  const isBookEngineActive = false; // property.book_engine_enable
  const propertyId = 10;

  async function handleRequestClick() {
    // Send and API call or email
    alert("Request sent");
    setRequestSent(true);
  }

  if (isBookEngineActive) {
    return (
      <div className={styles.content}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="green"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.801 10A10 10 0 1 1 17 3.335" />
          <path d="m9 11 3 3L22 4" />
        </svg>
        <h2>Booking Engine Activated</h2>
        <p>
          Your booking engine is live! Share the link below on your website or
          social media:
        </p>
        <div className={styles.link}>
          https://bookings.simplehostel.net/properties/{propertyId}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="red"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Book Engine
      </h1>
      <p>
        Receive reservations directly from your website with a professional
        booking page.
      </p>
      <div className={styles.requirements}>
        <h3>To get started, please make sure your property:</h3>
        <ul>
          <li>Is verified</li>
          <li>Has uploaded images</li>
          <li>Has booking policies configured</li>
          <li>Has contact details completed</li>
        </ul>
      </div>
      {requestSent ? (
        <p className={styles.requestSentText}>
          Request sent! We&apos;ll contact you shortly.
        </p>
      ) : (
        <button className={styles.requestButton} onClick={handleRequestClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
            <path d="m21.854 2.147-10.94 10.939" />
          </svg>
          Request Access
        </button>
      )}
    </div>
  );
}

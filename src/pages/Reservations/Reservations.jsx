import { useState } from "react";
import styles from "./Reservations.module.css";
import Spinner from "../../components/Spinner/Spinner";
import { formateDateToLocale } from "../../utils/dateFormatHelper";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const body = {};

    if (e.target.from.value) {
      body.from = e.target.from.value;
    }

    if (e.target.until.value) {
      body.until = e.target.until.value;
    }

    if (e.target.name.value) {
      body.name = e.target.name.value;
    }

    const url =
      import.meta.env.VITE_URL_BASE + "/reservations/find-by-dates-and-name/";
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error(t("unexpected_error_message"));
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "error") {
          setError(data.msg);
          return;
        }

        if (Array.isArray(data.msg) && data.msg.length === 0) {
          setError(t("no_reservation_found"));
          return;
        }
        setReservations(data.msg);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function handleClick(id) {
    const url = "/reservations/" + id;
    return navigate(url);
  }

  const list = reservations.map(r => {
    const checkIn = formateDateToLocale(r.check_in);
    const checkOut = formateDateToLocale(r.check_out);

    let status = "";
    let color = "";
    switch (r.reservation_status) {
      case "provisional":
        status = t("provisional");
        color = "blue";
        break;
      case "confirmed":
        status = t("confirmed");
        color = "green";
        break;
      case "canceled":
        status = t("canceled");
        color = "red";
        break;
      case "no_show":
        status = "No-show";
        color = "gray";
    }

    return (
      <li key={r.reservation_id} onClick={() => handleClick(r.reservation_id)}>
        <p className={styles.fullName}>
          {r.first_name} {r.last_name}
        </p>
        <p className={styles.dates}>{checkIn}</p>
        <p className={styles.dates}>{checkOut}</p>
        <p className={styles.price} style={{ color: color }}>
          {status}
        </p>
      </li>
    );
  });

  return (
    <div className={styles.content}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          {t("from")}
          <input type="date" name="from" aria-required />
        </label>
        <label>
          {t("until")}
          <input type="date" name="until" aria-required />
        </label>
        <label>
          {t("guest_name")}
          <input type="text" name="name" />
        </label>
        <button type="submit">{t("search")}</button>
      </form>

      <ul className={styles.reservationsList}>
        {loading ? <Spinner /> : error ? <h3>{error}</h3> : list}
      </ul>
    </div>
  );
}

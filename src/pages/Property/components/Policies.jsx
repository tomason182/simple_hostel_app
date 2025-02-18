import styles from "./Policies.module.css";
import PropTypes from "prop-types";
import Card from "../../../components/Card/Card";
import Modal from "../../../components/Modal/Modal";
import { useState } from "react";
// Import forms
import ReservationPoliciesForm from "../../../forms/ReservationPoliciesForm";
import AdvancePaymentAndCancellationForm from "../../../forms/AdvancePaymentAndCancellationForm";
import OtherPoliciesForm from "../../../forms/OtherPoliciesForm";
import Spinner from "../../../components/Spinner/Spinner";

export default function Policies({ policies, isLoading, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(null);

  const formSelector = {
    1: <ReservationPoliciesForm />,
    2: (
      <AdvancePaymentAndCancellationForm closeModal={() => setIsOpen(false)} />
    ),

    4: <OtherPoliciesForm />,
  };

  function handleFormSelection(id) {
    setForm(formSelector[id]);
  }

  const actionReservation = [
    {
      label: "Edit",
      onClick: () => {
        handleFormSelection(1);
        setIsOpen(true);
      },
    },
  ];

  const actionPayment = [
    {
      label: "Edit",
      onClick: () => {
        handleFormSelection(2);
        setIsOpen(true);
      },
    },
  ];

  const actionChildren = [
    {
      label: "Edit",
      onClick: () => {
        handleFormSelection(4);
        setIsOpen(true);
      },
    },
  ];

  const actionOthers = [
    {
      label: "Edit",
      onClick: () => {
        handleFormSelection(6);
        setIsOpen(true);
      },
    },
  ];

  const customStyle = {
    children: {
      textAlign: "left",
    },
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <div className={styles.policiesContainer}>
        <Card title="Reservation Policies" actions={actionReservation}>
          <ul className={styles.list}>
            <li>
              <span>Minimum length of stay:</span>{" "}
              {policies.reservation.min_length_stay} days
            </li>
            <li>
              <span>Maximum length of stay:</span>{" "}
              {policies.reservation.max_length_stay} days
            </li>
            <li>
              <span>Minimum advance booking:</span>{" "}
              {policies.reservation.min_advance_booking}
            </li>
            <li>
              <span>allow same day reservation:</span>{" "}
              {policies.reservation.allow_same_day_reservation ? "Yes" : "No"}
            </li>
            <li>
              <span>Check-in window:</span>
              {policies.reservation.check_in_window.from} -{" "}
              {policies.reservation.check_in_window.to}
            </li>
            <li>
              <span>check-out time</span>{" "}
              {policies.reservation.check_out_time.until}
            </li>
            <li>
              <span>Payment method:</span>
              <ul>
                {policies.reservation.payment_methods.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </li>
          </ul>
        </Card>
        <Card
          title="Advance Payment & Cancellation Policies"
          actions={actionPayment}
          customStyle={customStyle}
        >
          <p>
            The deposit amount is 30% of the total reservation amount and will
            be arrange between you (the owner) and the guest
          </p>
        </Card>

        <Card
          title="Children policies"
          actions={actionChildren}
          customStyle={customStyle}
        >
          <p>Children of all age are allowed only in private rooms.</p>
        </Card>
        <Card
          title="Other Property Policies"
          actions={actionOthers}
          customStyle={customStyle}
        >
          <p>Check-in & Check-out times</p>
          <ul>
            <li>Check-in from 14:00 PM to 21:00 PM</li>
            <li>Check-out until 11:00 AM</li>
          </ul>
        </Card>
      </div>
      <div className={styles.policiesDescription}>
        <h2>Policies Information</h2>
        <h3>Advance payment Policies</h3>
        <p>
          When a guest makes a reservation through your webpage using the Simple
          Hostel booking engine, the reservation will initially be marked as
          &quot;Provisional&quot; in your calendar. As the property owner, you
          are responsible for contacting the guest to arrange the required
          deposit payment. The reservation will remain provisional until the
          payment is confirmed.
        </p>
        <h3>Cancellation Policies</h3>
        <p>
          When a guest cancels a reservation, you can define whether the advance
          payment will be refunded or not. Your cancellation policy helps set
          clear expectations for guests and ensures a fair process for both
          parties.
        </p>
        <h3>Children Policies</h3>
        <p>
          Define whether children are allowed in your property. If permitted,
          you can specify which types of rooms they can stay in, such as private
          rooms only or any room. This policy helps set clear expectations for
          families and ensures a suitable accommodation experience.
        </p>
        <h3>Pets Policies</h3>
        <p>Specify whether pets are allowed in your property.</p>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {form}
      </Modal>
    </>
  );
}

Policies.propTypes = {
  policies: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

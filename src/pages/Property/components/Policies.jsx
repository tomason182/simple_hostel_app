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
    1: {
      header: <h3>Reservation Policies</h3>,
      form: <ReservationPoliciesForm closeModal={() => setIsOpen(false)} />,
    },
    2: {
      header: <h3>Advance Payment and Cancellation Policies</h3>,
      form: (
        <AdvancePaymentAndCancellationForm
          closeModal={() => setIsOpen(false)}
        />
      ),
    },

    4: {
      header: <h2>Other Property Policies</h2>,
      form: <OtherPoliciesForm />,
    },
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

  if (error) return <h1>Error Page</h1>;

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
          <h4>Advance Payment</h4>
          <ul className={styles.list}>
            <li>
              {policies.advance_payment.required
                ? `You required ${
                    policies.advance_payment.amount * 10
                  } % of deposit when guest make a reservation`
                : "You DO NOT required an advance payment for guest reservations"}
            </li>
            <li>
              You accept the following payment method for advance payment:
              <ul>
                {policies.advance_payment.payment_methods.map(
                  (method, index) => (
                    <li key={index}>{method}</li>
                  )
                )}
              </ul>
            </li>
          </ul>
          <h4>Cancellations</h4>
          <p>{policies.cancellation.type}</p>
          <p>
            {policies.cancellation.type === "strict"
              ? "You will not refund the deposit if guest cancel anytime"
              : `You will refund ${
                  policies.cancellation.refund_percentage * 100
                }% of the deposit if the guest cancel ${
                  policies.cancellation.cancellation_notice_period
                } days before arrival.`}
          </p>
        </Card>

        <Card
          title="Children policies"
          actions={actionChildren}
          customStyle={customStyle}
        >
          <ul className={styles.list}>
            <li>
              {policies.children_policies.children_allowed &&
              policies.children_policies.min_age === 0
                ? "Children of all age are allow in your property"
                : !policies.children_policies.children_allowed
                ? "Children are not allow in your property"
                : `Children of ${policies.children_policies.min_age} years old or greater are allow in your property`}
            </li>
            <li>
              {policies.children_policies.allowed_room_types &&
                `Children are allow in ${
                  policies.children_policies.allowed_room_types ===
                  "private_room"
                    ? "Private Rooms only"
                    : "any Room"
                }`}
            </li>
            <li>
              {policies.children_policies.free_stay_age > 0 &&
                `Children of ${policies.children_policies.free_stay_age} years old can stay for free`}
            </li>
          </ul>
        </Card>
        <Card
          title="Other Property Policies"
          actions={actionOthers}
          customStyle={customStyle}
        >
          <h4>House rules</h4>
          <ul>
            <li>Quiet hours</li>
            <ul>
              <li>
                From: {policies.other_policies.house_rules.quiet_hours.from}
              </li>
              <li>To: {policies.other_policies.house_rules.quiet_hours.to}</li>
            </ul>
            <li>
              Smoking areas:{" "}
              {policies.other_policies.house_rules.smoking_areas ? "Yes" : "No"}
            </li>
            <li>
              Are external guest allowed?:{" "}
              {policies.other_policies.house_rules.external_guest_allowed
                ? "Yes"
                : "No"}
            </li>
            <li>
              Are pets allowed?:{" "}
              {policies.other_policies.house_rules.pets_allowed ? "Yes" : "No"}
            </li>
          </ul>
          <h4>Special services</h4>
          <ul>
            {policies.other_policies.special_services.luggage_storage
              .available && (
              <li>
                Luggage storage is available for $
                {policies.other_policies.special_services.luggage_storage.price}
              </li>
            )}
            {policies.other_policies.special_services.airport_pickup_service
              .available && (
              <li>
                Airport pickup service is available for $
                {
                  policies.other_policies.special_services
                    .airport_pickup_service.price
                }
              </li>
            )}
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
      <Modal
        header={form?.header}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {form?.form}
      </Modal>
    </>
  );
}

Policies.propTypes = {
  policies: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

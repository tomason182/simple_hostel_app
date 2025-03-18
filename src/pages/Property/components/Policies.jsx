import styles from "./Policies.module.css";
import PropTypes from "prop-types";
import Card from "../../../components/Card/Card";
import Modal from "../../../components/Modal/Modal";
import { useCallback, useEffect, useMemo, useState } from "react";
// Import forms
import ReservationPoliciesForm from "../../../forms/ReservationPoliciesForm";
import AdvancePaymentPolicyForm from "../../../forms/AdvancePaymentPolicyForm";
import CancellationPoliciesForm from "../../../forms/CancellationPoliciesForm";
import OtherPoliciesForm from "../../../forms/OtherPoliciesForm";
import ChildrenPoliciesForm from "../../../forms/ChildrenPoliciesForm";
import Spinner from "../../../components/Spinner/Spinner";

export default function Policies() {
  const [policies, setPolicies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(null);

  const fetchPropertyPolicies = useCallback(() => {
    const url = import.meta.env.VITE_URL_BASE + "/properties/policies";
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    setLoading(true);

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error");
        }
        return response.json();
      })
      .then(data => setPolicies(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPropertyPolicies();
  }, [fetchPropertyPolicies]);

  // Policies States
  const reservationPolicies = useMemo(
    () => ({
      min_length_stay: policies.reservationPolicies?.min_length_stay || 0,
      max_length_stay: policies.reservationPolicies?.max_length_stay || 0,
      min_advance_booking:
        policies.reservationPolicies?.min_advance_booking || 0,
      check_in_from: policies.reservationPolicies?.check_in_from || "",
      check_in_to: policies.reservationPolicies?.check_in_to || "",
      check_out_until: policies.reservationPolicies?.check_out_until || "",
      payment_methods_accepted:
        policies.reservationPolicies?.payment_methods_accepted || [],
    }),
    [policies]
  ); // Recalculate only when policies change

  const advancePaymentPolicies = useMemo(
    () => ({
      required:
        policies.advancePaymentPolicies?.advance_payment_required || false,
      deposit_amount: policies.advancePaymentPolicies?.deposit_amount || 0,
    }),
    [policies]
  );

  const cancellationPolicies = useMemo(
    () => policies?.cancellationPolicies,
    [policies]
  );

  const childrenPolicies = useMemo(
    () => ({
      children_allowed: policies.childrenPolicies?.allow_children || false,
      min_age: policies.childrenPolicies?.children_min_age || 0,
      allowed_room_types: policies.childrenPolicies?.minors_room_types || null,
      free_stay_age: policies.childrenPolicies?.free_stay_age || 0,
    }),
    [policies]
  );

  console.log(childrenPolicies);

  const formSelector = useMemo(
    () => ({
      1: {
        header: <h3 className={styles.header}>Reservation Policies</h3>,
        form: (
          <ReservationPoliciesForm
            reservationPoliciesData={reservationPolicies}
            closeModal={() => setIsOpen(false)}
            refreshPropertyPolicies={fetchPropertyPolicies}
          />
        ),
      },
      2: {
        header: <h3 className={styles.header}>Advance Payment Policies</h3>,
        form: (
          <AdvancePaymentPolicyForm
            advancePaymentData={advancePaymentPolicies}
            closeModal={() => setIsOpen(false)}
            refreshPropertyPolicies={fetchPropertyPolicies}
          />
        ),
      },
      3: {
        header: <h3 className={styles.header}>Cancellation Policies</h3>,
        form: (
          <CancellationPoliciesForm
            cancellationPolicies={cancellationPolicies}
            refreshPropertyPolicies={fetchPropertyPolicies}
            closeModal={() => setIsOpen(false)}
          />
        ),
      },
      4: {
        header: <h3 className={styles.header}>Children Policies</h3>,
        form: (
          <ChildrenPoliciesForm
            childrenPoliciesData={childrenPolicies}
            closeModal={() => setIsOpen(false)}
          />
        ),
      },
      5: {
        header: <h3 className={styles.header}>Other Property Policies</h3>,
        form: <OtherPoliciesForm />,
      },
    }),
    [
      reservationPolicies,
      advancePaymentPolicies,
      cancellationPolicies,
      childrenPolicies,
      fetchPropertyPolicies,
    ]
  );

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
        handleFormSelection(5);
        setIsOpen(true);
      },
    },
  ];

  const customStyle = {
    children: {
      textAlign: "left",
    },
  };

  if (loading) return <Spinner />;

  if (error) return <h1>Error Page</h1>;

  return (
    <>
      <div className={styles.policiesContainer}>
        <Card title="Reservation Policies" actions={actionReservation}>
          {reservationPolicies.min_length_stay === 0 ? (
            <p>
              No reservation polices are created. Click on &quot;Edit&quot; to
              add your policies.
            </p>
          ) : (
            <ul className={styles.list}>
              <li>
                <span>Minimum length of stay:</span>{" "}
                {reservationPolicies.min_length_stay} days
              </li>
              <li>
                <span>Maximum length of stay:</span>{" "}
                {reservationPolicies.max_length_stay} days
              </li>
              <li>
                <span>Allow same day reservation:</span>{" "}
                {reservationPolicies.min_advance_booking !== 0 ? "No" : "Yes"}
              </li>
              <li>
                <span>Minimum advance booking:</span>{" "}
                {reservationPolicies.min_advance_booking === 0
                  ? "---"
                  : reservationPolicies.min_advance_booking}
              </li>
              <li>
                <span>Check-in:</span>
                {reservationPolicies.check_in_from} -{" "}
                {reservationPolicies.check_in_to}
              </li>
              <li>
                <span>check-out:</span> {reservationPolicies.check_out_until}
              </li>
              <li>
                <span>Payment methods accepted:</span>
                <ul>
                  {reservationPolicies.payment_methods_accepted.map(method => (
                    <li key={method}>{method}</li>
                  ))}
                </ul>
              </li>
            </ul>
          )}
        </Card>
        <Card
          title="Advance Payment & Cancellation Policies"
          customStyle={customStyle}
        >
          <h4>Advance Payment</h4>
          <ul className={styles.list}>
            <li>
              {advancePaymentPolicies.required === null
                ? "No advance payment policies added"
                : advancePaymentPolicies.required === 1
                ? `You required ${
                    advancePaymentPolicies.deposit_amount * 100
                  } % of deposit when guest make a reservation`
                : "You DO NOT required an advance payment for guest reservations"}
            </li>
          </ul>
          <button
            className={styles.button}
            onClick={() => {
              handleFormSelection(2);
              setIsOpen(true);
            }}
          >
            ADD
          </button>
          <br />
          <h4>Cancellations</h4>
          <ul className={styles.list}>
            {cancellationPolicies[0] === null ? (
              <li>No cancellation policies added</li>
            ) : advancePaymentPolicies.required === 0 ? (
              "Cancellation policies will no be display when advance payment is not required"
            ) : (
              cancellationPolicies.map(policy => (
                <li key={policy.id}>
                  {policy.amount_refund * 100}% of deposit refunded if cancel{" "}
                  {policy.days_before_arrival} days before arrival
                </li>
              ))
            )}
          </ul>
          <button
            className={styles.button}
            onClick={() => {
              handleFormSelection(3);
              setIsOpen(true);
            }}
          >
            ADD
          </button>
        </Card>

        <Card
          title="Children policies"
          actions={actionChildren}
          customStyle={customStyle}
        >
          <ul className={styles.list}>
            {childrenPolicies.children_allowed === 0 ||
            childrenPolicies.children_allowed === false ? (
              <li>Children are not allowed in your property</li>
            ) : (
              <>
                <li>
                  {childrenPolicies.min_age === 0
                    ? "Children of all age are allowed in your property"
                    : `Children of ${childrenPolicies?.min_age} years old or greater are allow in your property`}
                </li>
                <li>
                  {childrenPolicies.allowed_room_types === "only_private"
                    ? "children are allowed in private rooms only"
                    : childrenPolicies.allowed_room_types === "only_dorm"
                    ? "Children are allowed only in dormitories"
                    : "Children are allowed in any kind of room"}
                </li>
                <li>
                  {childrenPolicies.free_stay_age > 0 &&
                    `Children of ${childrenPolicies?.free_stay_age} years old can stay for free`}
                </li>
              </>
            )}
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
                From: {policies.other_policies?.house_rules.quiet_hours.from}
              </li>
              <li>To: {policies.other_policies?.house_rules.quiet_hours.to}</li>
            </ul>
            <li>
              Smoking areas:{" "}
              {policies.other_policies?.house_rules.smoking_areas
                ? "Yes"
                : "No"}
            </li>
            <li>
              Are external guest allowed?:{" "}
              {policies.other_policies?.house_rules.external_guest_allowed
                ? "Yes"
                : "No"}
            </li>
            <li>
              Are pets allowed?:{" "}
              {policies.other_policies?.house_rules.pets_allowed ? "Yes" : "No"}
            </li>
          </ul>
          <h4>Special services</h4>
          <ul>
            {policies.other_policies?.special_services.luggage_storage
              .available && (
              <li>
                Luggage storage is available for $
                {
                  policies.other_policies?.special_services.luggage_storage
                    .price
                }
              </li>
            )}
            {policies.other_policies?.special_services.airport_pickup_service
              .available && (
              <li>
                Airport pickup service is available for $
                {
                  policies.other_policies?.special_services
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
